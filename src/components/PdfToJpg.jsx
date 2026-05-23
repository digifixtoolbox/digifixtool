import { useState } from "react";
import SaveAsDialog from "./SaveAsDialog";

var _pdfjsPromise = null;
function loadPdfJs() {
  if (typeof window !== "undefined" && window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (_pdfjsPromise) return _pdfjsPromise;
  _pdfjsPromise = new Promise(function(resolve, reject) {
    var script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = function() {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    script.onerror = function() { _pdfjsPromise = null; reject(new Error("Could not load PDF.js")); };
    document.head.appendChild(script);
  });
  return _pdfjsPromise;
}

var _jszipPromise = null;
function loadJszip() {
  if (typeof window !== "undefined" && window.JSZip) return Promise.resolve(window.JSZip);
  if (_jszipPromise) return _jszipPromise;
  _jszipPromise = new Promise(function(resolve, reject) {
    var script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    script.onload = function() { resolve(window.JSZip); };
    script.onerror = function() { _jszipPromise = null; reject(new Error("Could not load JSZip")); };
    document.head.appendChild(script);
  });
  return _jszipPromise;
}

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.jpg', { type: 'image/jpeg' })] }); }
  catch(e) { return false; }
})();

export default function PdfToJpg() {
  const [status, setStatus] = useState("idle");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [saveAsItem, setSaveAsItem] = useState(null);
  const [saveAsName, setSaveAsName] = useState(null);
  const [bulkSaveAsBlob, setBulkSaveAsBlob] = useState(null);

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    var file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please drop a PDF file."); return;
    }
    processFile(file);
  }

  async function processFile(file) {
    setError(""); setImages([]); setStatus("loading");
    var pdfjsLib;
    try {
      pdfjsLib = await loadPdfJs();
    } catch (e) {
      setError("Could not load PDF library. Please check your connection and try again.");
      setStatus("idle"); return;
    }
    var data;
    try {
      data = new Uint8Array(await file.arrayBuffer());
    } catch (e) {
      setError("Could not read file."); setStatus("idle"); return;
    }
    pdfjsLib.getDocument({ data: data }).promise.then(function(pdf) {
      var total = pdf.numPages;
      var results = new Array(total);
      var done = 0;
      for (var p = 1; p <= total; p++) {
        (function(pageNum) {
          pdf.getPage(pageNum).then(function(page) {
            var viewport = page.getViewport({ scale: 2 });
            var canvas = document.createElement("canvas");
            canvas.width = viewport.width; canvas.height = viewport.height;
            page.render({ canvasContext: canvas.getContext("2d"), viewport: viewport }).promise.then(function() {
              results[pageNum-1] = { url: canvas.toDataURL("image/jpeg", 0.92), name: "page-" + pageNum + ".jpg" };
              done++;
              if (done === total) { setImages(results); setStatus("done"); }
            });
          });
        })(p);
      }
    }).catch(function() { setError("Could not read this PDF."); setStatus("idle"); });
  }

  function handleFile(ev) {
    var file = ev.target.files[0];
    if (!file) return;
    processFile(file);
  }

  function download(img) {
    var a = document.createElement("a"); a.href = img.url; a.download = img.name; a.click();
  }

  async function handleItemSaveAs(img) {
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var blob = await fetch(img.url).then(function(r) { return r.blob(); });
        var handle = await window.showSaveFilePicker({ suggestedName: img.name, types: [{ description: "JPEG Image", accept: { "image/jpeg": [".jpg"] } }] });
        var writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch(e) { if (e.name === "AbortError") return; }
    }
    setSaveAsItem(img);
  }

  function doSaveAs(filename) {
    var a = document.createElement("a"); a.href = saveAsItem.url; a.download = filename; a.click();
    setSaveAsItem(null);
  }

  function downloadAll() { images.forEach(function(img) { download(img); }); }

  async function handleBulkSaveAs() {
    if (!images.length) return;
    if (images.length === 1) { handleItemSaveAs(images[0]); return; }
    var JSZipLib;
    try { JSZipLib = await loadJszip(); } catch(e) { downloadAll(); return; }
    var zip = new JSZipLib();
    for (var i = 0; i < images.length; i++) {
      var b = await fetch(images[i].url).then(function(r) { return r.blob(); });
      zip.file(images[i].name, b);
    }
    var zipBlob = await zip.generateAsync({ type: "blob" });
    var zipFilename = "converted-pages.zip";
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var handle = await window.showSaveFilePicker({ suggestedName: zipFilename, types: [{ description: "ZIP Archive", accept: { "application/zip": [".zip"] } }] });
        var writable = await handle.createWritable();
        await writable.write(zipBlob); await writable.close(); return;
      } catch(e) { if (e.name === "AbortError") return; }
    }
    setBulkSaveAsBlob(zipBlob);
    setSaveAsName(zipFilename);
  }

  function doBulkSaveAs(filename) {
    var url = URL.createObjectURL(bulkSaveAsBlob);
    var a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    setBulkSaveAsBlob(null); setSaveAsName(null);
  }

  function reset() { setStatus("idle"); setImages([]); setBulkSaveAsBlob(null); setSaveAsName(null); }

  function openPicker() { document.getElementById("pdf-input").click(); }

  var saveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var shareBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var resetBtn = { background: "transparent", color: "var(--reset-btn-text)", border: "1.5px solid var(--reset-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };

  async function handleShare() {
    if (!images.length) return;
    try {
      var files = await Promise.all(images.map(async function(img) {
        var blob = await fetch(img.url).then(function(r) { return r.blob(); });
        return new File([blob], img.name, { type: 'image/jpeg' });
      }));
      if (navigator.share && navigator.canShare && navigator.canShare({ files: files })) {
        try { await navigator.share({ files: files, title: 'PixMidas' }); }
        catch(err) { if (err.name !== 'AbortError') { downloadAll(); } }
      } else { downloadAll(); }
    } catch(e) { downloadAll(); }
  }
  var itemSaveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer" };
  var itemSaveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1px solid var(--outline-btn-color)", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer" };

  var cardStyle = { background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 };

  if (status === "idle") return (
    <div style={cardStyle}>
      <div
        onClick={openPicker}
        onDragOver={function(e) { e.preventDefault(); setDragOver(true); }}
        onDragLeave={function() { setDragOver(false); }}
        onDrop={handleDrop}
        style={{ border: "2px dashed " + (dragOver ? "#0071e3" : "var(--border)"), borderRadius: "16px", padding: "48px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? "#f0f7ff" : "var(--surface-2)", transition: "border-color 0.15s, background 0.15s" }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}><i className="ti ti-file-export" style={{color:'#E54D2E'}}></i></div>
        <p style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>Drop a PDF here or click to browse</p>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>Each page will be converted to JPG</p>
        <input id="pdf-input" type="file" accept="application/pdf" onChange={handleFile} style={{ display: "none" }} />
        <span style={{ background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "12px 24px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>Choose PDF</span>
        {error && <p style={{ color: "#dc2626", marginTop: "16px", fontSize: "14px" }}>{error}</p>}
      </div>
    </div>
  );

  if (status === "loading") return (
    <div style={cardStyle}>
      <div style={{ textAlign: "center", padding: "48px", background: "var(--surface-2)", borderRadius: "16px" }}>
        <p style={{ fontSize: "17px", fontWeight: "600", color: "var(--text)" }}>Converting pages...</p>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>Please wait.</p>
      </div>
    </div>
  );

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
        {images.map(function(img, i) {
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--surface-2)", borderRadius: "12px", padding: "14px 16px" }}>
              <img src={img.url} alt={"p" + i} loading="lazy" style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "6px" }} />
              <span style={{ flex: "1", fontSize: "14px", fontWeight: "600", color: "var(--text)" }}>{img.name}</span>
              <button onClick={function() { download(img); }} style={itemSaveBtn}>Save</button>
              <button onClick={function() { handleItemSaveAs(img); }} style={itemSaveAsBtn}>Save As...</button>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        {images.length > 1 && <button onClick={downloadAll} style={saveBtn}>Save All</button>}
        {images.length === 1 && <button onClick={function() { download(images[0]); }} style={saveBtn}>Save</button>}
        {images.length === 1
          ? <button onClick={function() { handleItemSaveAs(images[0]); }} style={saveAsBtn}>Save As...</button>
          : <button onClick={handleBulkSaveAs} style={saveAsBtn}>Save As...</button>
        }
        {supportsFileShare && <button onClick={handleShare} style={shareBtn}><i className="ti ti-share" /> Share</button>}
        <button onClick={reset} style={resetBtn}>Reset</button>
      </div>
      {saveAsItem !== null && <SaveAsDialog defaultName={saveAsItem.name} onSave={doSaveAs} onCancel={function() { setSaveAsItem(null); }} />}
      {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doBulkSaveAs} onCancel={function() { setSaveAsName(null); setBulkSaveAsBlob(null); }} />}
    </div>
  );
}
