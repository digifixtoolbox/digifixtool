import { useState } from "react";
import SaveAsDialog from "./SaveAsDialog";
import { iconSvgs } from '../data/iconSvgs.js';

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.png', { type: 'image/png' })] }); }
  catch(e) { return false; }
})();

export default function SvgToPng() {
  const [svgUrl, setSvgUrl] = useState(null);
  const [naturalW, setNaturalW] = useState(400);
  const [naturalH, setNaturalH] = useState(400);
  const [outputWidth, setOutputWidth] = useState(1024);
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [pngDataUrl, setPngDataUrl] = useState(null);
  const [saveAsName, setSaveAsName] = useState(null);

  function loadSvg(file) {
    if (!file) return;
    if (!file.type.includes("svg") && !file.name.toLowerCase().endsWith(".svg")) {
      setError("Please upload an SVG file."); return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 50MB. Pro version coming soon with higher limits.`); return;
    }
    setError("");
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function() {
      setNaturalW(img.naturalWidth || 400);
      setNaturalH(img.naturalHeight || 400);
      setSvgUrl(url);
    };
    img.onerror = function() { setError("Could not load this SVG. Make sure it is a valid SVG file."); };
    img.src = url;
  }

  function handleFile(e) { loadSvg(e.target.files[0]); }

  function handleDrop(e) {
    e.preventDefault(); setDragOver(false);
    loadSvg(e.dataTransfer.files[0]);
  }

  function convert() {
    if (!svgUrl) return;
    setConverting(true); setError("");
    var aspect = naturalH / (naturalW || 1);
    var h = Math.max(1, Math.round(outputWidth * aspect));
    var canvas = document.createElement("canvas");
    canvas.width = outputWidth; canvas.height = h;
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0, outputWidth, h);
      setPngDataUrl(canvas.toDataURL("image/png"));
      setConverting(false);
    };
    img.onerror = function() { setError("Conversion failed. The SVG may reference external resources."); setConverting(false); };
    img.src = svgUrl;
  }

  function handleSave() {
    if (!pngDataUrl) return;
    var a = document.createElement("a");
    a.href = pngDataUrl;
    a.download = "converted.png"; a.click();
  }

  async function handleSaveAs() {
    if (!pngDataUrl) return;
    var filename = "converted.png";
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var blob = await fetch(pngDataUrl).then(function(r) { return r.blob(); });
        var handle = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: "PNG Image", accept: { "image/png": [".png"] } }] });
        var writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch(e) { if (e.name === "AbortError") return; }
    }
    setSaveAsName(filename);
  }

  function doSaveAs(filename) {
    var a = document.createElement("a"); a.href = pngDataUrl; a.download = filename; a.click();
    setSaveAsName(null);
  }

  function reset() { setSvgUrl(null); setPngDataUrl(null); setError(""); }

  var saveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var shareBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var resetBtn = { background: "transparent", color: "var(--reset-btn-text)", border: "1.5px solid var(--reset-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };

  async function handleShare() {
    if (!pngDataUrl) return;
    var blob = await fetch(pngDataUrl).then(function(r) { return r.blob(); });
    var file = new File([blob], 'converted.png', { type: 'image/png' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'PixMidas' }); }
      catch(err) { if (err.name !== 'AbortError') { handleSave(); } }
    } else { handleSave(); }
  }

  var outputHeight = Math.max(1, Math.round(outputWidth * (naturalH / (naturalW || 1))));
  var cardStyle = { background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 };

  if (!svgUrl) return (
    <div style={cardStyle}>
      <div
        onClick={function() { document.getElementById("svg-input").click(); }}
        onDragOver={function(e) { e.preventDefault(); setDragOver(true); }}
        onDragLeave={function() { setDragOver(false); }}
        onDrop={handleDrop}
        style={{ border: "2px dashed " + (dragOver ? "var(--upload-btn-bg)" : "var(--border)"), borderRadius: "16px", padding: "48px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? "var(--accent-light)" : "var(--surface-2)", transition: "border-color 0.15s, background 0.15s" }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0090FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: iconSvgs['vector'] }} /></div>
        <p style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>Drop an SVG here or click to browse</p>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>Convert any SVG vector to a high-resolution PNG</p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "20px" }}>Maximum file size: 50MB</p>
        <input id="svg-input" type="file" accept="image/svg+xml,.svg" onChange={handleFile} style={{ display: "none" }} />
        <span style={{ background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "12px 24px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>Choose SVG</span>
        {error && <p style={{ color: "#dc2626", marginTop: "16px", fontSize: "14px" }}>{error}</p>}
      </div>
    </div>
  );

  return (
    <div style={cardStyle}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px", color: "var(--text)" }}>Output Width (px)</label>
            <input
              type="number"
              value={outputWidth}
              min="64"
              max="4096"
              onChange={function(e) {
                var v = parseInt(e.target.value, 10);
                if (v > 0 && v <= 4096) setOutputWidth(v);
              }}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-light)", borderRadius: "10px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", outline: "none", background: "var(--surface-2)", color: "var(--text)" }}
            />
          </div>
          <div style={{ background: "var(--surface-2)", borderRadius: "12px", padding: "16px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>Output dimensions</p>
            <p style={{ fontSize: "15px", fontWeight: "700", color: "var(--text)" }}>{outputWidth} × {outputHeight}px</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Aspect ratio maintained automatically</p>
          </div>
          {error && <p style={{ color: "#dc2626", fontSize: "14px" }}>{error}</p>}
        </div>

        <div>
          <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px", color: "var(--text)" }}>Preview</label>
          <img src={svgUrl} alt="SVG preview"
            style={{ maxWidth: "100%", maxHeight: "280px", borderRadius: "12px", border: "1px solid var(--border-light)", objectFit: "contain", background: "var(--surface-2)", display: "block" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button onClick={convert} disabled={converting}
          style={{ background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "14px 24px", fontSize: "16px", fontWeight: "600", cursor: converting ? "not-allowed" : "pointer", minHeight: "44px", fontFamily: "inherit", flex: "1", opacity: converting ? 0.7 : 1 }}>
          {converting ? "Converting..." : "Convert to PNG"}
        </button>
      </div>
      {pngDataUrl && (
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px", justifyContent: "center" }}>
          <button onClick={handleSave} style={saveBtn}>Save</button>
          <button onClick={handleSaveAs} style={saveAsBtn}>Save As...</button>
          {supportsFileShare && <button onClick={handleShare} style={shareBtn}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: iconSvgs['share'] }} /> Share</button>}
          <button onClick={reset} style={resetBtn}>Reset</button>
        </div>
      )}
      {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doSaveAs} onCancel={function() { setSaveAsName(null); }} />}
    </div>
  );
}
