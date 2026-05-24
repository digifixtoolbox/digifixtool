import { useState, useRef } from "react";
import SaveAsDialog from "./SaveAsDialog";

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.jpg', { type: 'image/jpeg' })] }); }
  catch(e) { return false; }
})();

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

export default function WebpToJpg() {
  const [images, setImages] = useState([]);
  const [converted, setConverted] = useState([]);
  const [converting, setConverting] = useState(false);
  const [saveAsItem, setSaveAsItem] = useState(null);
  const [saveAsName, setSaveAsName] = useState(null);
  const [bulkSaveAsBlob, setBulkSaveAsBlob] = useState(null);
  const canvasRef = useRef(null);

  function handleFiles(e) {
    var files = Array.from(e.target.files);
    setImages(files);
    setConverted([]);
  }

  function handleDrop(e) {
    e.preventDefault();
    var files = Array.from(e.dataTransfer.files).filter(function(f) { return f.type.startsWith("image/"); });
    setImages(files);
    setConverted([]);
  }

  function convert() {
    if (!images.length) return;
    setConverting(true);
    var results = [];
    var remaining = images.length;
    images.forEach(function(file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          var jpgUrl = canvas.toDataURL("image/jpeg", 0.92);
          var name = file.name.replace(/\.webp$/i, "").replace(/\.[^.]+$/, "") + ".jpg";
          results.push({ name: name, url: jpgUrl });
          remaining--;
          if (remaining === 0) {
            setConverted(results);
            setConverting(false);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function download(item) {
    var link = document.createElement("a");
    link.href = item.url;
    link.download = item.name;
    link.click();
  }

  function downloadAll() {
    converted.forEach(function(item) { download(item); });
  }

  function handleItemSaveAs(item) {
    setSaveAsItem(item);
  }

  function doSaveAs(filename) {
    var a = document.createElement("a"); a.href = saveAsItem.url; a.download = filename; a.click();
    setSaveAsItem(null);
  }

  async function handleBulkSaveAs() {
    if (!converted.length) return;
    if (converted.length === 1) {
      if (typeof window.showSaveFilePicker === "function") {
        try {
          var blob = await fetch(converted[0].url).then(function(r) { return r.blob(); });
          var handle = await window.showSaveFilePicker({ suggestedName: converted[0].name, types: [{ description: "JPEG Image", accept: { "image/jpeg": [".jpg"] } }] });
          var writable = await handle.createWritable();
          await writable.write(blob); await writable.close(); return;
        } catch(e) { if (e.name === "AbortError") return; }
      }
      setBulkSaveAsBlob(null);
      setSaveAsName(converted[0].name);
      return;
    }
    var JSZipLib;
    try { JSZipLib = await loadJszip(); } catch(e) { downloadAll(); return; }
    var zip = new JSZipLib();
    for (var i = 0; i < converted.length; i++) {
      var b = await fetch(converted[i].url).then(function(r) { return r.blob(); });
      zip.file(converted[i].name, b);
    }
    var zipBlob = await zip.generateAsync({ type: "blob" });
    var zipFilename = "converted-images.zip";
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var handle2 = await window.showSaveFilePicker({ suggestedName: zipFilename, types: [{ description: "ZIP Archive", accept: { "application/zip": [".zip"] } }] });
        var writable2 = await handle2.createWritable();
        await writable2.write(zipBlob); await writable2.close(); return;
      } catch(e) { if (e.name === "AbortError") return; }
    }
    setBulkSaveAsBlob(zipBlob);
    setSaveAsName(zipFilename);
  }

  function doBulkSaveAs(filename) {
    if (bulkSaveAsBlob) {
      var url = URL.createObjectURL(bulkSaveAsBlob);
      var a = document.createElement("a"); a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
      setBulkSaveAsBlob(null);
    } else {
      var a2 = document.createElement("a"); a2.href = converted[0].url; a2.download = filename; a2.click();
    }
    setSaveAsName(null);
  }

  function reset() { setImages([]); setConverted([]); setBulkSaveAsBlob(null); setSaveAsName(null); }

  var saveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var shareBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var resetBtn = { background: "transparent", color: "var(--reset-btn-text)", border: "1.5px solid var(--reset-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };

  async function handleShareAll() {
    if (!converted.length) return;
    try {
      var files = await Promise.all(converted.map(async function(item) {
        var blob = await fetch(item.url).then(function(r) { return r.blob(); });
        return new File([blob], item.name, { type: 'image/jpeg' });
      }));
      if (navigator.share && navigator.canShare && navigator.canShare({ files: files })) {
        try { await navigator.share({ files: files, title: 'PixMidas' }); }
        catch(err) { if (err.name !== 'AbortError') { downloadAll(); } }
      } else { downloadAll(); }
    } catch(e) { downloadAll(); }
  }
  var itemSaveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer", flexShrink: "0" };
  var itemSaveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1px solid var(--outline-btn-color)", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer", flexShrink: "0" };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 }}>
      {!images.length ? (
        <div
          onDrop={handleDrop}
          onDragOver={function(e) { e.preventDefault(); }}
          onClick={function() { document.getElementById("webp-input").click(); }}
          style={{ border: "2px dashed var(--border)", borderRadius: "16px", padding: "48px 24px", textAlign: "center", cursor: "pointer", background: "var(--surface-2)" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}><i className="ti ti-photo" style={{color:'#0090FF'}}></i></div>
          <p style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>Drop WebP images here</p>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>or click to browse. Multiple files supported.</p>
          <input id="webp-input" type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: "none" }} />
          <button style={{ background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "12px 24px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>Choose Images</button>
        </div>
      ) : (
        <div>
          <div style={{ background: "var(--surface-2)", borderRadius: "14px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px", color: "var(--text)" }}>{images.length} image{images.length > 1 ? "s" : ""} selected</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{images.map(function(f) { return f.name; }).join(", ")}</p>
          </div>
          {!converted.length ? (
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={convert} disabled={converting} style={{ background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "600", cursor: "pointer", flex: "1", minHeight: "44px", fontFamily: "inherit" }}>
                {converting ? "Converting..." : "Convert to JPG"}
              </button>
              <button onClick={function() { setImages([]); }} style={{ background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border-light)", borderRadius: "99px", padding: "14px 20px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", minHeight: "44px" }}>
                Clear
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                {converted.map(function(item, i) {
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-2)", borderRadius: "12px", padding: "14px 16px", gap: "12px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "500", flex: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)" }}>{item.name}</span>
                      <button onClick={function() { download(item); }} style={itemSaveBtn}>Save</button>
                      <button onClick={function() { handleItemSaveAs(item); }} style={itemSaveAsBtn}>Save As...</button>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                <button onClick={downloadAll} style={saveBtn}>Save All</button>
                <button onClick={handleBulkSaveAs} style={saveAsBtn}>Save As...</button>
                {supportsFileShare && <button onClick={handleShareAll} style={shareBtn}><i className="ti ti-share" /> Share</button>}
                <button onClick={reset} style={resetBtn}>Reset</button>
              </div>
            </div>
          )}
        </div>
      )}
      {saveAsItem !== null && <SaveAsDialog defaultName={saveAsItem.name} onSave={doSaveAs} onCancel={function() { setSaveAsItem(null); }} />}
      {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doBulkSaveAs} onCancel={function() { setSaveAsName(null); setBulkSaveAsBlob(null); }} />}
    </div>
  );
}
