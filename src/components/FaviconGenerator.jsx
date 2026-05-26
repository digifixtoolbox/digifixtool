import { useState } from "react";
import SaveAsDialog from "./SaveAsDialog";
import { iconSvgs } from '../data/iconSvgs.js';

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.zip', { type: 'application/zip' })] }); }
  catch(e) { return false; }
})();

export default function FaviconGenerator() {
  const [imageUrl, setImageUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [zipping, setZipping] = useState(false);
  const [saveAsName, setSaveAsName] = useState(null);

  var SIZES = [16, 32, 48, 64, 180, 192, 512];
  var sizeLabels = { 16: "Browser", 32: "Browser HD", 48: "Windows", 64: "Windows HD", 180: "Apple Touch", 192: "Android", 512: "PWA" };

  function processFile(file) {
    if (!file) return;
    var allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type) && !file.name.toLowerCase().endsWith(".svg")) {
      setError("Please upload a JPG, PNG, WebP, or SVG image."); return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 50MB. Pro version coming soon with higher limits.`); return;
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

  function handleSaveAs() {
    setSaveAsName("favicons.zip");
  }

  function doSaveAs(filename) {
    if (typeof window.JSZip === "undefined") { setError("ZIP library not loaded. Please refresh the page."); setSaveAsName(null); return; }
    setSaveAsName(null);
    setZipping(true); setError("");
    var promises = SIZES.map(function(size) {
      return renderToCanvas(size).then(function(canvas) {
        return new Promise(function(resolve) {
          canvas.toBlob(function(blob) { resolve({ name: "favicon-" + size + "x" + size + ".png", blob: blob }); }, "image/png");
        });
      });
    });
    Promise.all(promises).then(function(files) {
      var zip = new window.JSZip();
      files.forEach(function(f) { zip.file(f.name, f.blob); });
      return zip.generateAsync({ type: "blob" });
    }).then(function(content) {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(content); a.download = filename; a.click();
      setZipping(false);
    }).catch(function() { setError("Failed to create ZIP. Please try again."); setZipping(false); });
  }

  var saveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var shareBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var resetBtn = { background: "transparent", color: "var(--reset-btn-text)", border: "1.5px solid var(--reset-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };

  async function handleShare() {
    if (typeof window.JSZip === "undefined") { setError("ZIP library not loaded. Please refresh."); return; }
    setZipping(true); setError("");
    var promises = SIZES.map(function(size) {
      return renderToCanvas(size).then(function(canvas) {
        return new Promise(function(resolve) {
          canvas.toBlob(function(blob) { resolve({ name: "favicon-" + size + "x" + size + ".png", blob: blob }); }, "image/png");
        });
      });
    });
    Promise.all(promises).then(function(files) {
      var zip = new window.JSZip();
      files.forEach(function(f) { zip.file(f.name, f.blob); });
      return zip.generateAsync({ type: "blob" });
    }).then(async function(content) {
      setZipping(false);
      var shareFile = new File([content], "favicons.zip", { type: "application/zip" });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [shareFile] })) {
        try { await navigator.share({ files: [shareFile], title: 'PixMidas' }); }
        catch(err) { if (err.name !== 'AbortError') { downloadAll(); } }
      } else { downloadAll(); }
    }).catch(function() { setError("Failed to create ZIP."); setZipping(false); });
  }

  var cardStyle = { background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 };

  if (!imageUrl) return (
    <div style={cardStyle}>
      <div
        onClick={function() { document.getElementById("fav-input").click(); }}
        onDragOver={function(e) { e.preventDefault(); setDragOver(true); }}
        onDragLeave={function() { setDragOver(false); }}
        onDrop={handleDrop}
        style={{ border: "2px dashed " + (dragOver ? "var(--upload-btn-bg)" : "var(--border)"), borderRadius: "16px", padding: "48px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? "var(--accent-light)" : "var(--surface-2)", transition: "border-color 0.15s, background 0.15s" }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#30A46C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: iconSvgs['browser'] }} /></div>
        <p style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>Drop an image here or click to browse</p>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>JPG, PNG, WebP, or SVG. Square images work best</p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "20px" }}>Maximum file size: 50MB</p>
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
                style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", color: "var(--upload-btn-bg)", width: "100%" }}>
                Download
              </button>
            </div>
          );
        })}
      </div>

      {error && <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "16px" }}>{error}</p>}

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px", justifyContent: "center" }}>
        <button onClick={downloadAll} disabled={zipping} style={{ ...saveBtn, opacity: zipping ? 0.7 : 1, cursor: zipping ? "not-allowed" : "pointer" }}>
          {zipping ? "Creating ZIP..." : "Save"}
        </button>
        <button onClick={handleSaveAs} disabled={zipping} style={{ ...saveAsBtn, opacity: zipping ? 0.7 : 1, cursor: zipping ? "not-allowed" : "pointer" }}>Save As...</button>
        {supportsFileShare && <button onClick={handleShare} disabled={zipping} style={{ ...shareBtn, opacity: zipping ? 0.7 : 1, cursor: zipping ? "not-allowed" : "pointer" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: iconSvgs['share'] }} /> Share</button>}
        <button onClick={function() { setImageUrl(null); setError(""); }} style={resetBtn}>Reset</button>
      </div>
      {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doSaveAs} onCancel={function() { setSaveAsName(null); }} />}
    </div>
  );
}
