import { useRef, useState } from "react";
import SaveAsDialog from "./SaveAsDialog";
import { IconWand, IconShare } from '@tabler/icons-react';

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.jpg', { type: 'image/jpeg' })] }); }
  catch(e) { return false; }
})();

export default function BackgroundRemover() {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | processing | done | error
  const [loadingMsg, setLoadingMsg] = useState("");
  const [progressPct, setProgressPct] = useState(0);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [downloadName, setDownloadName] = useState("bg-removed.png");
  const [errorMsg, setErrorMsg] = useState("");
  const [saveAsName, setSaveAsName] = useState(null);

  const processFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 20MB. Pro version coming soon with higher limits.`);
      setStatus("error");
      return;
    }

    const base = file.name.replace(/\.[^/.]+$/, "");
    setDownloadName(base + "-bg-removed.png");
    setOriginalUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setErrorMsg("");
    setProgressPct(0);
    setStatus("loading");
    setLoadingMsg("Loading AI model… this takes a few seconds the first time.");

    try {
      const { removeBackground } = await import("@imgly/background-removal");

      let inferenceStarted = false;

      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          if (!inferenceStarted && total > 0) {
            const pct = Math.min(99, Math.round((current / total) * 100));
            setProgressPct(pct);
          }
          if (key.includes("inference") || key.includes("compute")) {
            if (!inferenceStarted) {
              inferenceStarted = true;
              setStatus("processing");
              setLoadingMsg("Removing background…");
              setProgressPct(0);
            }
          }
        },
        output: { format: "image/png", quality: 1 },
      });

      setResultUrl(URL.createObjectURL(blob));
      setStatus("done");
    } catch {
      setErrorMsg("Something went wrong. Please try a different image or check your connection.");
      setStatus("error");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const reset = () => {
    setStatus("idle");
    setOriginalUrl(null);
    setResultUrl(null);
    setProgressPct(0);
    setLoadingMsg("");
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  function handleSave() {
    var a = document.createElement("a");
    a.href = resultUrl;
    a.download = downloadName;
    a.click();
  }

  async function handleSaveAs() {
    if (!resultUrl) return;
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var blob = await fetch(resultUrl).then(function(r) { return r.blob(); });
        var handle = await window.showSaveFilePicker({ suggestedName: downloadName, types: [{ description: "PNG Image", accept: { "image/png": [".png"] } }] });
        var writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch(e) { if (e.name === "AbortError") return; }
    }
    setSaveAsName(downloadName);
  }

  function doSaveAs(filename) {
    var a = document.createElement("a");
    a.href = resultUrl;
    a.download = filename;
    a.click();
    setSaveAsName(null);
  }

  var saveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var shareBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var resetBtn = { background: "transparent", color: "var(--reset-btn-text)", border: "1.5px solid var(--reset-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };

  async function handleShare() {
    if (!resultUrl) return;
    var blob = await fetch(resultUrl).then(function(r) { return r.blob(); });
    var file = new File([blob], downloadName, { type: blob.type });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'PixMidas' }); }
      catch(err) { if (err.name !== 'AbortError') { handleSave(); } }
    } else { handleSave(); }
  }

  return (
    <div style={s.wrapper}>

      {status === "idle" && (
        <div
          style={{
            ...s.dropzone,
            borderColor: isDragging ? "var(--upload-btn-bg)" : "var(--border-light)",
            background: isDragging ? "var(--accent-light)" : "var(--surface-2)",
          }}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current.click()}
        >
          <div style={s.uploadIcon}><IconWand size={48} color="#E54D2E" stroke={2} /></div>
          <h2 style={s.dropTitle}>Drop your image here</h2>
          <p style={s.dropText}>JPG, PNG or WebP. AI removes the background in your browser.</p>
          <p style={{fontSize:12,color:"var(--text-muted)",marginBottom:16}}>Maximum file size: 20MB</p>
          <button style={s.btn} type="button">Choose Image</button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={(e) => processFile(e.target.files[0])}
          />
        </div>
      )}

      {(status === "loading" || status === "processing") && (
        <div style={s.loadingBox}>
          <div style={s.spinnerWrap}>
            <span style={s.spinnerEmoji}>⏳</span>
          </div>
          <p style={s.loadingTitle}>{loadingMsg}</p>
          {status === "loading" && (
            <div style={s.progressTrack}>
              <div style={{ ...s.progressFill, width: `${progressPct}%` }} />
            </div>
          )}
          {status === "loading" && progressPct > 0 && (
            <p style={s.progressText}>{progressPct}%</p>
          )}
          {status === "processing" && (
            <p style={s.loadingSub}>This may take 10–20 seconds.</p>
          )}
        </div>
      )}

      {(status === "done" || status === "error") && (
        <div style={s.toolArea}>
          {status === "error" ? (
            <div style={s.errorBox}>{errorMsg}</div>
          ) : (
            <div style={s.previewGrid}>
              <div style={s.previewCard}>
                <p style={s.previewLabel}>Original</p>
                <img src={originalUrl} alt="Original" style={s.previewImg} loading="lazy" />
              </div>
              <div style={s.previewCard}>
                <p style={s.previewLabel}>Background Removed</p>
                <div style={s.checkerWrap}>
                  <img src={resultUrl} alt="Background removed" style={s.previewImg} loading="lazy" />
                </div>
              </div>
            </div>
          )}

          <div style={s.actions}>
            {status === "done" && (
              <>
                <button onClick={handleSave} style={saveBtn} type="button">Save</button>
                <button onClick={handleSaveAs} style={saveAsBtn} type="button">Save As...</button>
                {supportsFileShare && <button onClick={handleShare} style={shareBtn} type="button"><IconShare size={16} stroke={2} /> Share</button>}
              </>
            )}
            <button onClick={reset} style={resetBtn} type="button">Reset</button>
          </div>
        </div>
      )}

      {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doSaveAs} onCancel={function() { setSaveAsName(null); }} />}
    </div>
  );
}

const s = {
  wrapper: {
    background: "var(--surface)",
    border: "1px solid var(--border-light)",
    borderRadius: 20,
    padding: 32,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  dropzone: {
    border: "2px dashed",
    borderRadius: 16,
    padding: "56px 24px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  dropTitle: {
    fontSize: 24,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    marginBottom: 8,
    color: "var(--text)",
  },
  dropText: {
    fontSize: 15,
    color: "var(--text-muted)",
    marginBottom: 24,
  },
  btn: {
    background: "var(--upload-btn-bg)",
    color: "var(--upload-btn-color)",
    border: "none",
    borderRadius: 999,
    padding: "14px 28px",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  loadingBox: {
    padding: "56px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  spinnerWrap: {
    fontSize: 36,
  },
  spinnerEmoji: {
    display: "inline-block",
    animation: "none",
  },
  loadingTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: "var(--text)",
    letterSpacing: "-0.01em",
    margin: 0,
  },
  loadingSub: {
    fontSize: 14,
    color: "var(--text-muted)",
    margin: 0,
  },
  progressTrack: {
    width: "100%",
    maxWidth: 320,
    height: 6,
    background: "var(--border-light)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "var(--upload-btn-bg)",
    borderRadius: 999,
    transition: "width 0.3s ease",
  },
  progressText: {
    fontSize: 13,
    color: "var(--text-muted)",
    margin: 0,
  },
  toolArea: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  previewCard: {
    border: "1px solid var(--border-light)",
    borderRadius: 14,
    padding: 16,
    background: "var(--surface-2)",
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text-muted)",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  previewImg: {
    width: "100%",
    height: 220,
    objectFit: "contain",
    borderRadius: 10,
    display: "block",
  },
  checkerWrap: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundImage:
      "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%)",
    backgroundSize: "20px 20px",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 12,
    padding: "16px 20px",
    color: "#991b1b",
    fontSize: 14,
    fontWeight: 500,
    textAlign: "center",
  },
  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  downloadBtn: {
    background: "#2563eb",
    color: "#fff",
    textDecoration: "none",
    padding: "14px 28px",
    borderRadius: 999,
    fontWeight: 700,
    fontSize: 15,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  resetBtn: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    padding: "14px 24px",
    borderRadius: 999,
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    fontFamily: "inherit",
    color: "var(--text-muted)",
  },
};
