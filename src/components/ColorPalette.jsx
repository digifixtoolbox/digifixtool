import { useState, useRef } from "react";
import SaveAsDialog from "./SaveAsDialog";
import { IconPalette, IconShare } from '@tabler/icons-react';

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.png', { type: 'image/png' })] }); }
  catch(e) { return false; }
})();

export default function ColorPalette() {
  const [palette, setPalette] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(null);
  const [saveAsName, setSaveAsName] = useState(null);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(function(v) { return v.toString(16).padStart(2, "0"); }).join("");
  }

  function extractColors(file) {
    var url = URL.createObjectURL(file);
    setImageUrl(url);
    var img = new Image();
    img.onload = function() {
      var canvas = canvasRef.current;
      if (!canvas) return;
      var SIZE = 150;
      canvas.width = SIZE; canvas.height = SIZE;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      var data = ctx.getImageData(0, 0, SIZE, SIZE).data;

      var colorMap = {};
      for (var i = 0; i < data.length; i += 16) {
        if (data[i + 3] < 128) continue;
        var r = Math.floor(data[i] / 32) * 32;
        var g = Math.floor(data[i + 1] / 32) * 32;
        var b = Math.floor(data[i + 2] / 32) * 32;
        var key = r + "," + g + "," + b;
        colorMap[key] = (colorMap[key] || 0) + 1;
      }

      var sorted = Object.keys(colorMap).sort(function(a, b) { return colorMap[b] - colorMap[a]; });
      var result = [];
      var picked = [];

      for (var j = 0; j < sorted.length && result.length < 6; j++) {
        var parts = sorted[j].split(",").map(Number);
        var tooClose = picked.some(function(k) {
          var kp = k.split(",").map(Number);
          return Math.abs(kp[0] - parts[0]) < 48 && Math.abs(kp[1] - parts[1]) < 48 && Math.abs(kp[2] - parts[2]) < 48;
        });
        if (!tooClose) {
          picked.push(sorted[j]);
          result.push({ r: parts[0], g: parts[1], b: parts[2], hex: rgbToHex(parts[0], parts[1], parts[2]) });
        }
      }

      setPalette(result);
    };
    img.src = url;
  }

  function processFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 50 * 1024 * 1024) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 50MB. Pro version coming soon with higher limits.`);
      return;
    }
    setError("");
    extractColors(file);
  }

  function handleFile(e) { processFile(e.target.files[0]); }

  function handleDrop(e) {
    e.preventDefault(); setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }

  function copyColor(text, key) {
    navigator.clipboard.writeText(text).then(function() {
      setCopied(key); setTimeout(function() { setCopied(null); }, 1500);
    });
  }

  function buildPaletteDataUrl() {
    var swatchSize = 160;
    var padding = 16;
    var labelHeight = 44;
    var totalW = palette.length * (swatchSize + padding) + padding;
    var totalH = swatchSize + labelHeight + padding * 2;
    var canvas = document.createElement("canvas");
    canvas.width = totalW; canvas.height = totalH;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f5f5f7"; ctx.fillRect(0, 0, totalW, totalH);
    palette.forEach(function(c, i) {
      var x = padding + i * (swatchSize + padding);
      ctx.fillStyle = c.hex;
      ctx.fillRect(x, padding, swatchSize, swatchSize);
      ctx.fillStyle = "#1d1d1f";
      ctx.font = "bold 15px Inter, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(c.hex.toUpperCase(), x + swatchSize / 2, padding + swatchSize + 26);
    });
    return canvas.toDataURL("image/png");
  }

  function handleSave() {
    if (!palette.length) return;
    var a = document.createElement("a");
    a.href = buildPaletteDataUrl();
    a.download = "color-palette.png"; a.click();
  }

  async function handleSaveAs() {
    if (!palette.length) return;
    var filename = "color-palette.png";
    var url = buildPaletteDataUrl();
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var blob = await fetch(url).then(function(r) { return r.blob(); });
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
    var a = document.createElement("a");
    a.href = buildPaletteDataUrl();
    a.download = filename; a.click();
    setSaveAsName(null);
  }

  async function handleShare() {
    if (!palette.length) return;
    var url = buildPaletteDataUrl();
    var blob = await fetch(url).then(function(r) { return r.blob(); });
    var file = new File([blob], "color-palette.png", { type: "image/png" });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: "PixMidas" }); }
      catch(err) { if (err.name !== "AbortError") { handleSave(); } }
    } else { handleSave(); }
  }

  var saveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var shareBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var resetBtn = { background: "transparent", color: "var(--reset-btn-text)", border: "1.5px solid var(--reset-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {!imageUrl ? (
        <div
          onClick={function() { document.getElementById("palette-input").click(); }}
          onDragOver={function(e) { e.preventDefault(); setDragOver(true); }}
          onDragLeave={function() { setDragOver(false); }}
          onDrop={handleDrop}
          style={{ border: "2px dashed " + (dragOver ? "#0071e3" : "var(--border)"), borderRadius: "16px", padding: "48px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? "#f0f7ff" : "var(--surface-2)", transition: "border-color 0.15s, background 0.15s" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}><IconPalette size={48} color="#D6409F" stroke={2} /></div>
          <p style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>Drop an image here or click to browse</p>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>Extracts up to 6 dominant colors</p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "20px" }}>Maximum file size: 50MB</p>
          <input id="palette-input" type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          <span style={{ background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "12px 24px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>Choose Image</span>
          {error && <p style={{ color: "#dc2626", marginTop: "16px", fontSize: "14px" }}>{error}</p>}
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", gap: "20px", marginBottom: "24px", alignItems: "flex-start" }}>
            <img src={imageUrl} alt="Source" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "12px", border: "1px solid var(--border-light)", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px", color: "var(--text)" }}>Dominant Colors</p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Click any swatch to copy the HEX code.</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "12px", marginBottom: "24px" }}>
            {palette.map(function(c, i) {
              var key = c.hex + i;
              var isCopied = copied === key;
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
                  <button
                    onClick={function() { copyColor(c.hex.toUpperCase(), key); }}
                    title={"Click to copy " + c.hex.toUpperCase()}
                    style={{ width: "100%", aspectRatio: "1", background: c.hex, border: "1px solid rgba(0,0,0,0.12)", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}
                  >
                    {isCopied ? "✓" : ""}
                  </button>
                  <p style={{ fontSize: "11px", fontWeight: "700", textAlign: "center", fontFamily: "monospace", margin: 0, color: "var(--text)" }}>{c.hex.toUpperCase()}</p>
                  <p style={{ fontSize: "10px", color: "var(--text-muted)", textAlign: "center", margin: 0 }}>{"rgb(" + c.r + "," + c.g + "," + c.b + ")"}</p>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px", justifyContent: "center" }}>
            <button onClick={handleSave} style={saveBtn}>Save</button>
            <button onClick={handleSaveAs} style={saveAsBtn}>Save As...</button>
            {supportsFileShare && <button onClick={handleShare} style={shareBtn}><IconShare size={16} stroke={2} /> Share</button>}
            <button onClick={function() { setImageUrl(null); setPalette([]); }} style={resetBtn}>Reset</button>
          </div>
        </div>
      )}
      {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doSaveAs} onCancel={function() { setSaveAsName(null); }} />}
    </div>
  );
}
