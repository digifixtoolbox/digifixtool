import { useState, useRef } from "react";
import SaveAsDialog from "./SaveAsDialog";

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.gif', { type: 'image/gif' })] }); }
  catch(e) { return false; }
})();

export default function GifMaker() {
  const [frames, setFrames] = useState([]);
  const [delay, setDelay] = useState(500);
  const [width, setWidth] = useState(480);
  const [making, setMaking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [saveAsName, setSaveAsName] = useState(null);
  const idRef = useRef(0);

  function addFiles(fileList) {
    var valid = Array.from(fileList).filter(function(f) { return f.type.startsWith("image/"); });
    if (!valid.length) { setError("Please add image files (JPG, PNG, WebP)."); return; }
    var existingTotal = frames.reduce(function(sum, fr) { return sum + fr.file.size; }, 0);
    var newTotal = valid.reduce(function(sum, f) { return sum + f.size; }, 0);
    if (existingTotal + newTotal > 40 * 1024 * 1024) {
      setError(`Total file size too large (${((existingTotal + newTotal) / 1024 / 1024).toFixed(1)}MB). Maximum combined size is 40MB. Pro version coming soon with higher limits.`); return;
    }
    setError("");
    var newFrames = valid.map(function(f) {
      var id = idRef.current++;
      return { id: id, file: f, url: URL.createObjectURL(f), name: f.name };
    });
    setFrames(function(prev) { return prev.concat(newFrames); });
    setResultUrl(null);
  }

  function handleFiles(e) { addFiles(e.target.files); }

  function handleDrop(e) {
    e.preventDefault(); setDragOver(false);
    addFiles(e.dataTransfer.files);
  }

  function removeFrame(id) {
    setFrames(function(prev) { return prev.filter(function(f) { return f.id !== id; }); });
  }

  function moveUp(i) {
    if (i === 0) return;
    setFrames(function(prev) {
      var a = prev.slice(); var t = a[i-1]; a[i-1] = a[i]; a[i] = t; return a;
    });
  }

  function moveDown(i) {
    setFrames(function(prev) {
      if (i >= prev.length - 1) return prev;
      var a = prev.slice(); var t = a[i+1]; a[i+1] = a[i]; a[i] = t; return a;
    });
  }

  function makeGif() {
    if (frames.length < 2) { setError("Please add at least 2 images."); return; }
    if (typeof window.GIF === "undefined") { setError("GIF library not loaded. Please refresh the page."); return; }
    setMaking(true); setError(""); setProgress(0); setResultUrl(null);

    var targetWidth = width;
    var loadedImages = frames.map(function(frame) {
      return new Promise(function(resolve, reject) {
        var img = new Image();
        img.onload = function() { resolve(img); };
        img.onerror = reject;
        img.src = frame.url;
      });
    });

    Promise.all(loadedImages).then(function(imgs) {
      var firstImg = imgs[0];
      var aspectRatio = firstImg.naturalHeight / (firstImg.naturalWidth || 1);
      var targetHeight = Math.max(1, Math.round(targetWidth * aspectRatio));

      var gif = new window.GIF({
        workers: 2,
        quality: 10,
        width: targetWidth,
        height: targetHeight,
        workerScript: "/gif.worker.js"
      });

      var canvas = document.createElement("canvas");
      canvas.width = targetWidth; canvas.height = targetHeight;
      var ctx = canvas.getContext("2d");

      imgs.forEach(function(img) {
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        gif.addFrame(canvas, { delay: delay, copy: true });
      });

      gif.on("progress", function(p) { setProgress(Math.round(p * 100)); });

      gif.on("finished", function(blob) {
        var url = URL.createObjectURL(blob);
        setResultUrl(url);
        setMaking(false);
      });

      gif.render();
    }).catch(function() {
      setError("Could not create GIF. Please check your images and try again.");
      setMaking(false);
    });
  }

  function handleSave() {
    if (!resultUrl) return;
    var a = document.createElement("a"); a.href = resultUrl; a.download = "animated.gif"; a.click();
  }

  async function handleSaveAs() {
    if (!resultUrl) return;
    var filename = "animated.gif";
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var blob = await fetch(resultUrl).then(function(r) { return r.blob(); });
        var handle = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: "GIF Image", accept: { "image/gif": [".gif"] } }] });
        var writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch(e) { if (e.name === "AbortError") return; }
    }
    setSaveAsName(filename);
  }

  function doSaveAs(filename) {
    var a = document.createElement("a"); a.href = resultUrl; a.download = filename; a.click();
    setSaveAsName(null);
  }

  function reset() {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFrames([]); setResultUrl(null); setError("");
  }

  var saveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var shareBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var resetBtn = { background: "transparent", color: "var(--reset-btn-text)", border: "1.5px solid var(--reset-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };

  async function handleShare() {
    if (!resultUrl) return;
    var blob = await fetch(resultUrl).then(function(r) { return r.blob(); });
    var file = new File([blob], 'animated.gif', { type: 'image/gif' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'PixMidas' }); }
      catch(err) { if (err.name !== 'AbortError') { handleSave(); } }
    } else { handleSave(); }
  }

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 }}>
      <div
        onClick={function() { document.getElementById("gif-input").click(); }}
        onDragOver={function(e) { e.preventDefault(); setDragOver(true); }}
        onDragLeave={function() { setDragOver(false); }}
        onDrop={handleDrop}
        style={{ border: "2px dashed " + (dragOver ? "var(--upload-btn-bg)" : "var(--border)"), borderRadius: "16px", padding: "32px 24px", textAlign: "center", background: dragOver ? "var(--accent-light)" : "var(--surface-2)", marginBottom: "20px", cursor: "pointer", transition: "border-color 0.15s, background 0.15s" }}
      >
        <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>Drop images here or click to browse</p>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "4px" }}>Add multiple images in order. Each becomes one frame.</p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Maximum combined size: 40MB</p>
        <input id="gif-input" type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: "none" }} />
      </div>

      {frames.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
          {frames.map(function(frame, i) {
            return (
              <div key={frame.id} style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--surface-2)", borderRadius: "12px", padding: "10px 14px" }}>
                <img src={frame.url} alt="" style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
                <span style={{ flex: "1", fontSize: "13px", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)" }}>{frame.name}</span>
                <button onClick={function() { moveUp(i); }} style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "4px 10px", fontSize: "14px", cursor: "pointer", color: "var(--text)" }}>↑</button>
                <button onClick={function() { moveDown(i); }} style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "4px 10px", fontSize: "14px", cursor: "pointer", color: "var(--text)" }}>↓</button>
                <button onClick={function() { removeFrame(frame.id); }} style={{ background: "var(--surface)", border: "1px solid #fca5a5", borderRadius: "8px", padding: "4px 10px", fontSize: "14px", cursor: "pointer", color: "#dc2626" }}>✕</button>
              </div>
            );
          })}
        </div>
      )}

      {frames.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", display: "block", marginBottom: "8px" }}>
              Frame delay: <strong>{delay}ms</strong>
            </label>
            <input type="range" min="100" max="2000" step="100" value={delay}
              onChange={function(e) { setDelay(Number(e.target.value)); }}
              style={{ width: "100%", accentColor: "var(--upload-btn-bg)" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", display: "block", marginBottom: "8px" }}>
              Output width
            </label>
            <select value={width} onChange={function(e) { setWidth(Number(e.target.value)); }}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "10px", fontSize: "14px", background: "var(--surface-2)", color: "var(--text)", fontFamily: "inherit" }}>
              <option value={320}>320px</option>
              <option value={480}>480px</option>
              <option value={640}>640px</option>
            </select>
          </div>
        </div>
      )}

      {error && <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "16px" }}>{error}</p>}

      {making && (
        <div style={{ background: "var(--surface-2)", borderRadius: "12px", padding: "20px", marginBottom: "16px", textAlign: "center" }}>
          <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "10px", color: "var(--text)" }}>Creating GIF... {progress}%</p>
          <div style={{ background: "var(--border-light)", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
            <div style={{ background: "var(--upload-btn-bg)", borderRadius: "999px", height: "8px", width: progress + "%", transition: "width 0.3s" }} />
          </div>
        </div>
      )}

      {resultUrl && !making && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <img src={resultUrl} alt="GIF preview" style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "12px", border: "1px solid var(--border-light)", marginBottom: "12px" }} />
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "12px" }}>
            <button onClick={handleSave} style={saveBtn}>Save</button>
            <button onClick={handleSaveAs} style={saveAsBtn}>Save As...</button>
            {supportsFileShare && <button onClick={handleShare} style={shareBtn}><i className="ti ti-share" /> Share</button>}
            <button onClick={reset} style={resetBtn}>Reset</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {frames.length >= 2 && !making && (
          <button onClick={makeGif} style={{ background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "14px 24px", fontSize: "16px", fontWeight: "600", cursor: "pointer", minHeight: "44px", fontFamily: "inherit", flex: "1" }}>
            Create GIF
          </button>
        )}
        {frames.length > 0 && (
          <button onClick={function() { document.getElementById("gif-input").click(); }} style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border-light)", borderRadius: "99px", padding: "12px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", minHeight: "44px" }}>
            Add More Images
          </button>
        )}
      </div>
      {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doSaveAs} onCancel={function() { setSaveAsName(null); }} />}
    </div>
  );
}
