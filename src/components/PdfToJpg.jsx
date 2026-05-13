import { useState } from "react";

export default function PdfToJpg() {
  const [status, setStatus] = useState("idle");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  function handleFile(ev) {
    var file = ev.target.files[0];
    if (!file) return;
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

  function download(img) {
    var a = document.createElement("a"); a.href = img.url; a.download = img.name; a.click();
  }

  function openPicker() { document.getElementById("pdf-input").click(); }

  var boxStyle = { border: "2px dashed #d2d2d7", borderRadius: "16px", padding: "48px 24px", textAlign: "center", cursor: "pointer", background: "#f5f5f7" };
  var btnBlue = { background: "#0071e3", color: "white", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "15px", fontWeight: "600", cursor: "pointer" };
  var btnGray = { background: "#f5f5f7", color: "#1d1d1f", border: "1px solid #e8e8ed", borderRadius: "12px", padding: "14px 20px", fontSize: "15px", fontWeight: "600", cursor: "pointer" };

  if (status === "idle") return (
    <div onClick={openPicker} style={boxStyle}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
      <p style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px" }}>Click to choose a PDF</p>
      <p style={{ fontSize: "14px", color: "#6e6e73", marginBottom: "20px" }}>Each page will be converted to JPG</p>
      <input id="pdf-input" type="file" accept="application/pdf" onChange={handleFile} style={{ display: "none" }} />
      <span style={btnBlue}>Choose PDF</span>
      {error && <p style={{ color: "red", marginTop: "16px", fontSize: "14px" }}>{error}</p>}
    </div>
  );

  if (status === "loading") return (
    <div style={{ textAlign: "center", padding: "48px", background: "#f5f5f7", borderRadius: "16px" }}>
      <p style={{ fontSize: "17px", fontWeight: "600" }}>Converting pages...</p>
      <p style={{ fontSize: "14px", color: "#6e6e73", marginTop: "8px" }}>Please wait.</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
        {images.map(function(img, i) {
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f5f5f7", borderRadius: "12px", padding: "14px 16px" }}>
              <img src={img.url} alt={"p" + i} loading="lazy" style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "6px" }} />
              <span style={{ flex: "1", fontSize: "14px", fontWeight: "600" }}>{img.name}</span>
              <button onClick={function() { download(img); }} style={{ background: "#0071e3", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Download</button>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {images.length > 1 && <button onClick={function() { images.forEach(function(img) { download(img); }); }} style={{ background: "#0071e3", color: "white", border: "none", borderRadius: "12px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", flex: "1" }}>Download All</button>}
        <button onClick={function() { setStatus("idle"); setImages([]); }} style={btnGray}>Convert Another</button>
      </div>
    </div>
  );
}