import { useState, useRef, useEffect } from "react";

export default function ImageWatermark() {
  const [imageUrl, setImageUrl] = useState(null);
  const [watermarkText, setWatermarkText] = useState("© Copyright");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(70);
  const [color, setColor] = useState("#ffffff");
  const [position, setPosition] = useState("bottom-right");
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef(null);

  var posKeys = ["top-left", "top-center", "top-right", "middle-left", "center", "middle-right", "bottom-left", "bottom-center", "bottom-right"];
  var posIcons = { "top-left": "↖", "top-center": "↑", "top-right": "↗", "middle-left": "←", "center": "·", "middle-right": "→", "bottom-left": "↙", "bottom-center": "↓", "bottom-right": "↘" };

  useEffect(function() {
    if (!imageUrl || !canvasRef.current) return;
    var canvas = canvasRef.current;
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.onload = function() {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      if (!watermarkText) return;
      var pad = Math.max(24, Math.round(img.naturalWidth * 0.02));
      ctx.font = "bold " + fontSize + "px Inter, Arial, sans-serif";
      ctx.textBaseline = "middle";
      var tw = ctx.measureText(watermarkText).width;
      var th = fontSize * 1.2;

      var x, y;
      if (position.includes("left")) x = pad;
      else if (position.includes("right")) x = canvas.width - tw - pad;
      else x = (canvas.width - tw) / 2;

      if (position.includes("top")) y = pad + th / 2;
      else if (position.includes("bottom")) y = canvas.height - pad - th / 2;
      else y = canvas.height / 2;

      var hex = color;
      var r = parseInt(hex.slice(1, 3), 16);
      var g = parseInt(hex.slice(3, 5), 16);
      var b = parseInt(hex.slice(5, 7), 16);
      ctx.globalAlpha = opacity / 100;
      ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ",1)";
      ctx.fillText(watermarkText, x, y);
      ctx.globalAlpha = 1;
    };
    img.src = imageUrl;
  }, [imageUrl, watermarkText, fontSize, opacity, color, position]);

  function processFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setImageUrl(URL.createObjectURL(file));
  }

  function handleFile(e) { processFile(e.target.files[0]); }

  function handleDrop(e) {
    e.preventDefault(); setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }

  function handleSave() {
    if (!canvasRef.current) return;
    var a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/jpeg", 0.92);
    a.download = "watermarked.jpg"; a.click();
  }

  async function handleSaveAs() {
    if (!canvasRef.current) return;
    var url = canvasRef.current.toDataURL("image/jpeg", 0.92);
    var filename = "watermarked.jpg";
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var handle = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: "File", accept: { "image/jpeg": [".jpg"] } }] });
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

  function resetAll() { setImageUrl(null); }

  var saveBtn = { background: "#0071e3", color: "white", border: "none", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "#0071e3", border: "1.5px solid #0071e3", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };
  var resetBtn = { background: "var(--surface-2)", color: "var(--text-muted)", border: "none", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "600", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };

  var cardStyle = { background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 };

  if (!imageUrl) return (
    <div style={cardStyle}>
      <div
        onClick={function() { document.getElementById("wm-input").click(); }}
        onDragOver={function(e) { e.preventDefault(); setDragOver(true); }}
        onDragLeave={function() { setDragOver(false); }}
        onDrop={handleDrop}
        style={{ border: "2px dashed " + (dragOver ? "#0071e3" : "var(--border)"), borderRadius: "16px", padding: "48px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? "#f0f7ff" : "var(--surface-2)", transition: "border-color 0.15s, background 0.15s" }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}><i className="ti ti-writing" style={{color:'#5B5BD6'}}></i></div>
        <p style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>Drop an image here or click to browse</p>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>Supports JPG, PNG, WebP</p>
        <input id="wm-input" type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
        <span style={{ background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "12px 24px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>Choose Image</span>
      </div>
    </div>
  );

  return (
    <div style={cardStyle}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px", color: "var(--text)" }}>Watermark Text</label>
            <input type="text" value={watermarkText} onChange={function(e) { setWatermarkText(e.target.value); }}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border-light)", borderRadius: "10px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", outline: "none", background: "var(--surface-2)", color: "var(--text)" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px", color: "var(--text)" }}>
              Font Size: <strong>{fontSize}px</strong>
            </label>
            <input type="range" min="12" max="120" step="4" value={fontSize}
              onChange={function(e) { setFontSize(Number(e.target.value)); }}
              style={{ width: "100%", accentColor: "#0071e3" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px", color: "var(--text)" }}>
              Opacity: <strong>{opacity}%</strong>
            </label>
            <input type="range" min="10" max="100" step="5" value={opacity}
              onChange={function(e) { setOpacity(Number(e.target.value)); }}
              style={{ width: "100%", accentColor: "#0071e3" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px", color: "var(--text)" }}>Text Color</label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", border: "1px solid var(--border-light)", borderRadius: "10px", padding: "8px 12px", background: "var(--surface-2)" }}>
              <input type="color" value={color} onChange={function(e) { setColor(e.target.value); }}
                style={{ width: "32px", height: "32px", border: "none", borderRadius: "6px", cursor: "pointer", background: "none" }} />
              <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--text)" }}>{color}</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px", color: "var(--text)" }}>Position</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px" }}>
              {posKeys.map(function(pos) {
                return (
                  <button key={pos} onClick={function() { setPosition(pos); }}
                    style={{ padding: "10px", border: position === pos ? "2px solid #0071e3" : "1px solid var(--border-light)", borderRadius: "8px", background: position === pos ? "var(--accent-light)" : "var(--surface-2)", cursor: "pointer", fontSize: "18px" }}>
                    {posIcons[pos]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)" }}>Preview</label>
          <canvas ref={canvasRef} style={{ width: "100%", borderRadius: "12px", border: "1px solid var(--border-light)", display: "block" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
        <button onClick={handleSave} style={saveBtn}>Save</button>
        <button onClick={handleSaveAs} style={saveAsBtn}>Save As...</button>
        <button onClick={resetAll} style={resetBtn}>Reset</button>
      </div>
    </div>
  );
}
