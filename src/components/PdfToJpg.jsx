import { useState } from "react";

export default function PdfToJpg() {
  const [status, setStatus] = useState("idle");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

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

  function processFile(file) {
    setError(""); setImages([]); setStatus("loading");
    var reader = new FileReader();
    reader.onload = function(event) {
      var data = new Uint8Array(event.target.result);
      if (typeof window.pdfjsLib === "undefined") {
        setError("PDF library not loaded. Please refresh."); setStatus("idle"); return;
      }
      window.pdfjsLib.getDocument({ data: data }).promise.then(function(pdf) {
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
    };
    reader.readAsArrayBuffer(file);
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
        var handle = await window.showSaveFilePicker({ suggestedName: img.name, types: [{ description: "File", accept: { "image/jpeg": [".jpg"] } }] });
        var blob = await fetch(img.url).then(function(r) { return r.blob(); });
        var writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch(e) {
        if (e.name === "AbortError") return;
      }
    }
    download(img);
  }

  function downloadAll() { images.forEach(function(img) { download(img); }); }

  function reset() { setStatus("idle"); setImages([]); }

  function openPicker() { document.getElementById("pdf-input").click(); }

  var saveBtn = { background: "#0071e3", color: "white", border: "none", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "#0071e3", border: "1.5px solid #0071e3", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };
  var resetBtn = { background: "var(--surface-2)", color: "var(--text-muted)", border: "none", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "600", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };
  var itemSaveBtn = { background: "#0071e3", color: "white", border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer" };
  var itemSaveAsBtn = { background: "transparent", color: "#0071e3", border: "1px solid #0071e3", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer" };

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
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {images.length > 1 && <button onClick={downloadAll} style={saveBtn}>Save All</button>}
        {images.length === 1 && <button onClick={function() { download(images[0]); }} style={saveBtn}>Save</button>}
        {images.length === 1
          ? <button onClick={function() { handleItemSaveAs(images[0]); }} style={saveAsBtn}>Save As...</button>
          : <button onClick={downloadAll} style={saveAsBtn}>Save As...</button>
        }
        <button onClick={reset} style={resetBtn}>Reset</button>
      </div>
    </div>
  );
}
