import { useState, useRef } from "react";

export default function ColorPalette() {
  const [palette, setPalette] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(null);
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
    var url = buildPaletteDataUrl();
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var handle = await window.showSaveFilePicker({ suggestedName: "color-palette.png", types: [{ description: "File", accept: { "image/png": [".png"] } }] });
        var blob = await fetch(url).then(function(r) { return r.blob(); });
        var writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch(e) {
        if (e.name === "AbortError") return;
      }
    }
    handleSave();
  }

  var saveBtn = { background: "#0071e3", color: "white", border: "none", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "#0071e3", border: "1.5px solid #0071e3", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };
  var resetBtn = { background: "var(--surface-2)", color: "var(--text-muted)", border: "none", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "600", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };

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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}><i className="ti ti-palette" style={{color:'#D6409F'}}></i></div>
          <p style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>Drop an image here or click to browse</p>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>Extracts up to 6 dominant colors</p>
          <input id="palette-input" type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          <span style={{ background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "12px 24px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>Choose Image</span>
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

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
            <button onClick={handleSave} style={saveBtn}>Save</button>
            <button onClick={handleSaveAs} style={saveAsBtn}>Save As...</button>
            <button onClick={function() { setImageUrl(null); setPalette([]); }} style={resetBtn}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}
