import { useRef, useState } from "react";

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

  const processFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;

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
    } catch (err) {
      console.error(err);
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

  return (
    <div style={s.wrapper}>

      {status === "idle" && (
        <div
          style={{
            ...s.dropzone,
            borderColor: isDragging ? "#2563eb" : "#d1d5db",
            background: isDragging ? "#eff6ff" : "#fafaf9",
          }}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current.click()}
        >
          <div style={s.uploadIcon}>✂️</div>
          <h2 style={s.dropTitle}>Drop your image here</h2>
          <p style={s.dropText}>JPG, PNG or WebP. AI removes the background in your browser.</p>
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
              <a href={resultUrl} download={downloadName} style={s.downloadBtn}>
                ⬇ Download PNG
              </a>
            )}
            <button onClick={reset} style={s.resetBtn} type="button">
              Try another image
            </button>
          </div>
        </div>
      )}

      <div style={s.privacyNote}>
        🔒 Your files never leave your device. Everything happens locally.
      </div>
    </div>
  );
}

const s = {
  wrapper: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
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
    color: "#111827",
  },
  dropText: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 24,
  },
  btn: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "14px 28px",
    fontWeight: 700,
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
    color: "#111827",
    letterSpacing: "-0.01em",
    margin: 0,
  },
  loadingSub: {
    fontSize: 14,
    color: "#6b7280",
    margin: 0,
  },
  progressTrack: {
    width: "100%",
    maxWidth: 320,
    height: 6,
    background: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#2563eb",
    borderRadius: 999,
    transition: "width 0.3s ease",
  },
  progressText: {
    fontSize: 13,
    color: "#6b7280",
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
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 16,
    background: "#fafaf9",
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#6b7280",
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
    color: "#374151",
  },
  privacyNote: {
    marginTop: 20,
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },
};
