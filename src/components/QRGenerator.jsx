import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import SaveAsDialog from "./SaveAsDialog";

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.png', { type: 'image/png' })] }); }
  catch(e) { return false; }
})();

export default function QRGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [saveAsName, setSaveAsName] = useState(null);
  const canvasRef = useRef(null);
  const debounceRef = useRef(null);
  const hasQr = text.trim().length > 0;

  useEffect(() => {
    if (!text.trim()) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!canvasRef.current) return;
      QRCode.toCanvas(canvasRef.current, text.trim(), {
        width: size,
        margin: 2,
        color: { dark: fg, light: bg },
      });
    }, 300);
  }, [text, size, fg, bg]);

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "qrcode.png";
    a.click();
  };

  const handleSaveAs = async () => {
    if (!canvasRef.current) return;
    var filename = "qrcode.png";
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var blob = await fetch(canvasRef.current.toDataURL("image/png")).then(function(r) { return r.blob(); });
        var handle = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: "PNG Image", accept: { "image/png": [".png"] } }] });
        var writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch(e) { if (e.name === "AbortError") return; }
    }
    setSaveAsName(filename);
  };

  const doSaveAs = (filename) => {
    if (!canvasRef.current) return;
    var a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = filename;
    a.click();
    setSaveAsName(null);
  };

  const handleReset = () => {
    setText("");
    setSize(256);
    setFg("#000000");
    setBg("#ffffff");
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const blob = await fetch(dataUrl).then(r => r.blob());
    const file = new File([blob], "qrcode.png", { type: "image/png" });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: "PixMidas" }); }
      catch(err) { if (err.name !== "AbortError") { download(); } }
    } else { download(); }
  };

  var saveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var shareBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var resetBtn = { background: "transparent", color: "var(--reset-btn-text)", border: "1.5px solid var(--reset-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };

  const previewSize = Math.min(size, 256);

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>
              Text or URL
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter a URL, text, email, phone number..."
              style={{ width: "100%", height: 120, border: "1px solid var(--border-light)", borderRadius: 12, padding: "12px 16px", fontSize: 15, fontFamily: "inherit", color: "var(--text)", background: "var(--surface-2)", resize: "vertical", outline: "none", lineHeight: 1.5, boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>
              Size: <strong>{size}x{size}px</strong>
            </label>
            <input type="range" min="128" max="512" step="64" value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#0071e3" }} />
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>QR Color</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--border-light)", borderRadius: 10, padding: "8px 12px", background: "var(--surface-2)" }}>
                <input type="color" value={fg} onChange={(e) => setFg(e.target.value)}
                  style={{ width: 32, height: 32, border: "none", borderRadius: 6, cursor: "pointer", background: "none" }} />
                <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{fg}</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>Background</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--border-light)", borderRadius: 10, padding: "8px 12px", background: "var(--surface-2)" }}>
                <input type="color" value={bg} onChange={(e) => setBg(e.target.value)}
                  style={{ width: 32, height: 32, border: "none", borderRadius: 6, cursor: "pointer", background: "none" }} />
                <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{bg}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <canvas
            ref={canvasRef}
            style={{
              width: previewSize,
              height: previewSize,
              borderRadius: 12,
              border: "1px solid var(--border-light)",
              display: hasQr ? "block" : "none",
            }}
          />
          {!hasQr && (
            <div style={{ width: 200, height: 200, background: "var(--surface-2)", borderRadius: 12, border: "2px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: 14, color: "var(--text-muted)", textAlign: "center", padding: 20 }}>Your QR code will appear here</p>
            </div>
          )}
          {hasQr && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={download} style={saveBtn}>⬇ Save</button>
              <button onClick={handleSaveAs} style={saveAsBtn}>Save As...</button>
              {supportsFileShare && (
                <button onClick={handleShare} style={shareBtn}><i className="ti ti-share" /> Share</button>
              )}
              <button onClick={handleReset} style={resetBtn}>Reset</button>
            </div>
          )}
        </div>

      </div>
      <div style={{ marginTop: 24, fontSize: 13, textAlign: "center" }}>
        <a href="/report-bug" style={{color:"var(--text-muted)",textDecoration:"none"}}>🐞 Found an issue with this tool? Report a bug →</a>
      </div>
      {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doSaveAs} onCancel={function() { setSaveAsName(null); }} />}
    </div>
  );
}
