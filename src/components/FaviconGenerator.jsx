import { useState } from "react";

export default function FaviconGenerator() {
  const [imageUrl, setImageUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [zipping, setZipping] = useState(false);

  var SIZES = [16, 32, 48, 64, 180, 192, 512];
  var sizeLabels = { 16: "Browser", 32: "Browser HD", 48: "Windows", 64: "Windows HD", 180: "Apple Touch", 192: "Android", 512: "PWA" };

  function processFile(file) {
    if (!file) return;
    var allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type) && !file.name.toLowerCase().endsWith(".svg")) {
      setError("Please upload a JPG, PNG, WebP, or SVG image."); return;
    }
    setError("");
    setImageUrl(URL.createObjectURL(file));
  }

  function handleFile(e) { processFile(e.target.files[0]); }

  function handleDrop(e) {
    e.preventDefault(); setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }

  function renderToCanvas(size) {
    return new Promise(function(resolve, reject) {
      var canvas = document.createElement("canvas");
      canvas.width = size; canvas.height = size;
      var ctx = canvas.getContext("2d");
      var img = new Image();
      img.onload = function() { ctx.drawImage(img, 0, 0, size, size); resolve(canvas); };
      img.onerror = reject;
      img.src = imageUrl;
    });
  }

  function downloadSize(size) {
    renderToCanvas(size).then(function(canvas) {
      var a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "favicon-" + size + "x" + size + ".png"; a.click();
    }).catch(function() { setError("Download failed."); });
  }

  function downloadAll() {
    if (typeof window.JSZip === "undefined") { setError("ZIP library not loaded. Please refresh the page."); return; }
    setZipping(true); setError("");
    var promises = SIZES.map(function(size) {
      return renderToCanvas(size).then(function(canvas) {
        return new Promise(function(resolve) {
          canvas.toBlob(function(blob) {
            resolve({ name: "favicon-" + size + "x" + size + ".png", blob: blob });
          }, "image/png");
        });
      });
    });
    Promise.all(promises).then(function(files) {
      var zip = new window.JSZip();
      files.forEach(function(f) { zip.file(f.name, f.blob); });
      return zip.generateAsync({ type: "blob" });
    }).then(function(content) {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(content); a.download = "favicons.zip"; a.click();
      setZipping(false);
    }).catch(function() { setError("Failed to create ZIP. Please try again."); setZipping(false); });
  }

  async function handleSaveAs() {
    if (typeof window.JSZip === "undefined") { setError("ZIP library not loaded. Please refresh the page."); return; }
    setZipping(true); setError("");
    var promises = SIZES.map(function(size) {
      return renderToCanvas(size).then(function(canvas) {
        return new Promise(function(resolve) {
          canvas.toBlob(function(blob) {
            resolve({ name: "favicon-" + size + "x" + size + ".png", blob: blob });
          }, "image/png");
        });
      });
    });
    Promise.all(promises).then(function(files) {
      var zip = new window.JSZip();
      files.forEach(function(f) { zip.file(f.name, f.blob); });
      return zip.generateAsync({ type: "blob" });
    }).then(async function(content) {
      setZipping(false);
      if (typeof window.showSaveFilePicker === "function") {
        try {
          var handle = await window.showSaveFilePicker({ suggestedName: "favicons.zip", types: [{ description: "File", accept: { "application/zip": [".zip"] } }] });
          var writable = await handle.createWritable();
          await writable.write(content);
          await writable.close();
          return;
        } catch(e) {
          if (e.name === "AbortError") return;
        }
      }
      var a = document.createElement("a");
      a.href = URL.createObjectURL(content); a.download = "favicons.zip"; a.click();
    }).catch(function() { setError("Failed to create ZIP. Please try again."); setZipping(false); });
  }

  var saveBtn = { background: "#0071e3", color: "white", border: "none", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "#0071e3", border: "1.5px solid #0071e3", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };
  var resetBtn = { background: "var(--surface-2)", color: "var(--text-muted)", border: "none", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "600", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };

  var cardStyle = { background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 };

  if (!imageUrl) return (
    <div style={cardStyle}>
      <div
        onClick={function() { document.getElementById("fav-input").click(); }}
        onDragOver={function(e) { e.preventDefault(); setDragOver(true); }}
        onDragLeave={function() { setDragOver(false); }}
        onDrop={handleDrop}
        style={{ border: "2px dashed " + (dragOver ? "#0071e3" : "var(--border)"), borderRadius: "16px", padding: "48px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? "#f0f7ff" : "var(--surface-2)", transition: "border-color 0.15s, background 0.15s" }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}><i className="ti ti-browser" style={{color:'#30A46C'}}></i></div>
        <p style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>Drop an image here or click to browse</p>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>JPG, PNG, WebP, or SVG. Square images work best</p>
        <input id="fav-input" type="file" accept="image/*,.svg" onChange={handleFile} style={{ display: "none" }} />
        <span style={{ background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "12px 24px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>Choose Image</span>
        {error && <p style={{ color: "#dc2626", marginTop: "16px", fontSize: "14px" }}>{error}</p>}
      </div>
    </div>
  );

  return (
    <div style={cardStyle}>
      <div style={{ background: "var(--surface-2)", borderRadius: "12px", padding: "14px 18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ background: "var(--surface)", borderRadius: "8px", padding: "8px 14px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid var(--border-light)", fontSize: "13px" }}>
          <img src={imageUrl} alt="" style={{ width: "16px", height: "16px", objectFit: "cover", borderRadius: "3px", flexShrink: 0 }} />
          <span style={{ color: "var(--text-muted)" }}>my-website.com</span>
          <span style={{ color: "var(--text)", fontWeight: "500" }}>Page Title</span>
          <span style={{ color: "var(--text-muted)" }}>×</span>
        </div>
        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Browser tab preview</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px", marginBottom: "20px" }}>
        {SIZES.map(function(size) {
          var displaySize = Math.min(size, 64);
          return (
            <div key={size} style={{ background: "var(--surface-2)", borderRadius: "12px", padding: "16px 12px", textAlign: "center" }}>
              <img src={imageUrl} alt={size + "x" + size}
                style={{ width: displaySize + "px", height: displaySize + "px", objectFit: "cover", borderRadius: size <= 32 ? "4px" : "10px", marginBottom: "10px", display: "block", margin: "0 auto 10px" }} />
              <p style={{ fontSize: "13px", fontWeight: "700", marginBottom: "2px", color: "var(--text)" }}>{size}×{size}</p>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "10px" }}>{sizeLabels[size]}</p>
              <button onClick={function() { downloadSize(size); }}
                style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", color: "#0071e3", width: "100%" }}>
                Download
              </button>
            </div>
          );
        })}
      </div>

      {error && <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "16px" }}>{error}</p>}

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
        <button onClick={downloadAll} disabled={zipping} style={{ ...saveBtn, opacity: zipping ? 0.7 : 1, cursor: zipping ? "not-allowed" : "pointer" }}>
          {zipping ? "Creating ZIP..." : "Save"}
        </button>
        <button onClick={handleSaveAs} disabled={zipping} style={{ ...saveAsBtn, opacity: zipping ? 0.7 : 1, cursor: zipping ? "not-allowed" : "pointer" }}>Save As...</button>
        <button onClick={function() { setImageUrl(null); setError(""); }} style={resetBtn}>Reset</button>
      </div>
    </div>
  );
}
