import { useRef, useState } from "react";
import SaveAsDialog from "./SaveAsDialog";

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.jpg', { type: 'image/jpeg' })] }); }
  catch(e) { return false; }
})();

export default function ImageCompressor() {
  const fileInputRef = useRef(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [quality, setQuality] = useState(0.7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState("quality"); // "quality" | "target"
  const [targetKb, setTargetKb] = useState("150");
  const [passCount, setPassCount] = useState(0);
  const [targetMessage, setTargetMessage] = useState("");
  const [targetMsgType, setTargetMsgType] = useState("info"); // "info" | "warning"
  const [showOverlay, setShowOverlay] = useState(false);
  const [targetAlreadyOk, setTargetAlreadyOk] = useState(false);
  const [saveAsName, setSaveAsName] = useState(null);

  const formatBytes = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const calculateSavings = () => {
    if (!originalFile || !compressedSize) return null;
    const saved = ((originalFile.size - compressedSize) / originalFile.size) * 100;
    return Math.round(saved);
  };

  // Draws the image onto a canvas (called once per operation)
  const drawCanvas = async (file) => {
    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    const maxWidth = 1920;
    const scale = Math.min(1, maxWidth / imageBitmap.width);
    canvas.width = imageBitmap.width * scale;
    canvas.height = imageBitmap.height * scale;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
    return canvas;
  };

  // Encodes canvas to JPEG blob at quality q
  const blobFromCanvas = (canvas, q) =>
    new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
        "image/jpeg",
        q
      );
    });

  const compressImage = async (file, q) => {
    setIsProcessing(true);
    setTargetMessage("");
    try {
      const canvas = await drawCanvas(file);
      const blob = await blobFromCanvas(canvas, q);
      const url = URL.createObjectURL(blob);
      setCompressedUrl(url);
      setCompressedSize(blob.size);
    } catch {
      // ignore
    } finally {
      setIsProcessing(false);
    }
  };

  const compressToTarget = async (file) => {
    const kb = parseFloat(targetKb);
    if (!kb || kb <= 0) return;
    const targetBytes = kb * 1024;
    setIsProcessing(true);
    setPassCount(0);
    setTargetMessage("");
    setTargetAlreadyOk(false);
    setCompressedUrl(null);
    setCompressedSize(null);
    try {
      const canvas = await drawCanvas(file);

      // Check at max quality: if already under target, serve original unchanged
      const maxBlob = await blobFromCanvas(canvas, 0.95);
      if (maxBlob.size <= targetBytes) {
        const url = URL.createObjectURL(file);
        setCompressedUrl(url);
        setCompressedSize(file.size);
        setTargetMsgType("success");
        setTargetAlreadyOk(true);
        setTargetMessage("Image is already within target size. No changes made.");
        return;
      }

      // Check at min quality: if still over 110% of target, can't reach it
      const minBlob = await blobFromCanvas(canvas, 0.1);
      if (minBlob.size > targetBytes * 1.1) {
        const url = URL.createObjectURL(minBlob);
        setCompressedUrl(url);
        setCompressedSize(minBlob.size);
        setTargetMsgType("warning");
        setTargetMessage(`Target too aggressive. Smallest possible result: ${formatBytes(minBlob.size)}.`);
        return;
      }

      // Binary search between quality 0.1 and 0.95
      let lo = 0.1, hi = 0.95;
      let bestBlob = minBlob;
      let bestDiff = Math.abs(minBlob.size - targetBytes);

      for (let pass = 1; pass <= 20; pass++) {
        setPassCount(pass);
        const mid = (lo + hi) / 2;
        const candidate = await blobFromCanvas(canvas, mid);
        const diff = Math.abs(candidate.size - targetBytes);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestBlob = candidate;
        }
        const ratio = candidate.size / targetBytes;
        if (ratio >= 0.9 && ratio <= 1.1) break;
        if (candidate.size > targetBytes) hi = mid;
        else lo = mid;
        if (hi - lo < 0.005) break;
      }

      const url = URL.createObjectURL(bestBlob);
      setCompressedUrl(url);
      setCompressedSize(bestBlob.size);
    } catch {
      // ignore
    } finally {
      setIsProcessing(false);
      setPassCount(0);
    }
  };

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setOriginalFile(file);
    setOriginalPreview(URL.createObjectURL(file));
    setTargetMessage("");
    setCompressedUrl(null);
    setCompressedSize(null);
    if (mode === "quality") await compressImage(file, quality);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleQualityChange = async (e) => {
    const val = Number(e.target.value);
    setQuality(val);
    if (originalFile) await compressImage(originalFile, val);
  };

  const handleModeSwitch = async (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setTargetMessage("");
    setTargetAlreadyOk(false);
    setCompressedUrl(null);
    setCompressedSize(null);
    if (originalFile && newMode === "quality") await compressImage(originalFile, quality);
  };

  const handleSave = () => {
    if (!compressedUrl) return;
    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = downloadName;
    a.click();
  };

  const handleSaveAs = async () => {
    if (!compressedUrl) return;
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var blob = await fetch(compressedUrl).then(function(r) { return r.blob(); });
        var handle = await window.showSaveFilePicker({ suggestedName: downloadName, types: [{ description: "Image", accept: { [blob.type]: [] } }] });
        var writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch(e) { if (e.name === "AbortError") return; }
    }
    setSaveAsName(downloadName);
  };

  const doSaveAs = (filename) => {
    const a = document.createElement("a"); a.href = compressedUrl; a.download = filename; a.click();
    setSaveAsName(null);
  };

  const reset = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setCompressedUrl(null);
    setCompressedSize(null);
    setTargetMessage("");
    setPassCount(0);
    setTargetAlreadyOk(false);
  };

  const isIOS =
    typeof navigator !== "undefined" &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

  const handleOpenToSave = () => {
    if (!compressedUrl) return;
    setShowOverlay(true);
  };

  const handleShare = async () => {
    if (!compressedUrl) return;
    const blob = await fetch(compressedUrl).then(r => r.blob());
    const file = new File([blob], downloadName, { type: blob.type });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'PixMidas' }); }
      catch(err) { if (err.name !== 'AbortError') { handleSave(); } }
    } else { handleSave(); }
  };

  const downloadName = originalFile
    ? originalFile.name.replace(/\.[^/.]+$/, "") + "-compressed.jpg"
    : "compressed.jpg";

  const savings = calculateSavings();

  return (
    <>
    {showOverlay && (
      <div style={s.overlay} onClick={() => setShowOverlay(false)}>
        <button
          onClick={() => setShowOverlay(false)}
          style={s.overlayClose}
          type="button"
        >
          ✕ Close
        </button>
        <img
          src={compressedUrl}
          alt="Compressed"
          style={s.overlayImg}
          onClick={(e) => e.stopPropagation()}
        />
        <p style={s.overlayHint}>
          Long-press the image and tap Save to Photos or Save to Files
        </p>
      </div>
    )}
    <div style={s.wrapper}>

      {!originalFile ? (
        <div
          style={{
            ...s.dropzone,
            borderColor: isDragging ? "#2563eb" : "#d1d5db",
            background: isDragging ? "#eff6ff" : "var(--surface-2)",
          }}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current.click()}
        >
          <div style={s.uploadIcon}><i className="ti ti-file-zip" style={{color:'#5B5BD6'}}></i></div>
          <h2 style={s.dropTitle}>Drop your image here</h2>
          <p style={s.dropText}>JPG, PNG or WebP. Runs entirely in your browser.</p>
          <button style={s.btn}>Choose Image</button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div style={s.toolArea}>

          <div style={s.modeToggle}>
            <button
              style={{ ...s.modeBtn, ...(mode === "quality" ? s.modeBtnActive : {}) }}
              onClick={() => handleModeSwitch("quality")}
              type="button"
            >
              Quality %
            </button>
            <button
              style={{ ...s.modeBtn, ...(mode === "target" ? s.modeBtnActive : {}) }}
              onClick={() => handleModeSwitch("target")}
              type="button"
            >
              Target KB
            </button>
          </div>

          {mode === "quality" ? (
            <div style={s.sliderRow}>
              <label style={s.sliderLabel}>
                Compression Quality: <strong>{Math.round(quality * 100)}%</strong>
              </label>
              <input
                type="range"
                min="0.1"
                max="0.95"
                step="0.05"
                value={quality}
                onChange={handleQualityChange}
                style={s.slider}
              />
              <div style={s.sliderHints}>
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>
          ) : (
            <div style={s.targetRow}>
              <label style={s.sliderLabel}>Target file size</label>
              <div style={s.targetInputRow}>
                <input
                  type="number"
                  min="10"
                  max="99999"
                  value={targetKb}
                  onChange={(e) => setTargetKb(e.target.value)}
                  style={s.targetInput}
                  placeholder="150"
                />
                <span style={s.targetUnit}>KB</span>
                <button
                  style={{
                    ...s.compressBtn,
                    opacity: isProcessing ? 0.6 : 1,
                    cursor: isProcessing ? "not-allowed" : "pointer",
                  }}
                  onClick={() => compressToTarget(originalFile)}
                  disabled={isProcessing || !targetKb}
                  type="button"
                >
                  {isProcessing && passCount > 0 ? `Pass ${passCount}…` : "Compress"}
                </button>
              </div>
            </div>
          )}

          {targetMessage && (
            <div
              style={{
                ...s.targetMsg,
                ...(targetMsgType === "warning" ? s.targetMsgWarning : targetMsgType === "success" ? s.targetMsgSuccess : s.targetMsgInfo),
              }}
            >
              {targetMessage}
            </div>
          )}

          {savings !== null && !targetAlreadyOk && (
            <div style={s.savingsBadge}>
              <span style={s.savingsPercent}>↓ {savings}% smaller</span>
              <span style={s.savingsDetail}>
                {formatBytes(originalFile.size)} → {formatBytes(compressedSize)}
              </span>
            </div>
          )}

          <div style={s.previewGrid}>
            <div style={s.previewCard}>
              <p style={s.previewLabel}>Original</p>
              <img src={originalPreview} alt="Original" style={s.previewImg} loading="lazy" />
              <p style={s.previewSize}>{formatBytes(originalFile.size)}</p>
            </div>

            <div style={s.previewCard}>
              <p style={s.previewLabel}>Compressed</p>
              {isProcessing ? (
                <div style={s.processingBox}>
                  <span style={s.spinner}>⏳</span>
                  <p style={{ color: "#6b7280", fontSize: 14 }}>
                    {mode === "target" && passCount > 0
                      ? `Compressing… pass ${passCount}`
                      : "Processing…"}
                  </p>
                </div>
              ) : (
                compressedUrl && (
                  <img src={compressedUrl} alt="Compressed" style={s.previewImg} loading="lazy" />
                )
              )}
              <p style={s.previewSize}>
                {compressedSize ? formatBytes(compressedSize) : "—"}
              </p>
            </div>
          </div>

          <div style={s.actions}>
            {compressedUrl && !isProcessing && (
              isIOS ? (
                <>
                  <button onClick={handleOpenToSave} style={s.downloadBtn} type="button">
                    ↗ Open to Save
                  </button>
                  {supportsFileShare && <button onClick={handleShare} style={s.saveAsBtn} type="button"><i className="ti ti-share" /> Share</button>}
                </>
              ) : (
                <>
                  <button onClick={handleSave} style={s.downloadBtn} type="button">
                    ⬇ Save
                  </button>
                  <button onClick={handleSaveAs} style={s.saveAsBtn} type="button">
                    ⬇ Save As…
                  </button>
                  {supportsFileShare && <button onClick={handleShare} style={s.saveAsBtn} type="button"><i className="ti ti-share" /> Share</button>}
                </>
              )
            )}
            <button onClick={reset} style={s.resetBtn}>
              Reset
            </button>
          </div>

        </div>
      )}

      <div style={s.privacyNote}>
        <a href="/report-bug" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>🐞 Found an issue with this tool? Report a bug →</a>
      </div>

    </div>
    {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doSaveAs} onCancel={function() { setSaveAsName(null); }} />}
    </>
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
    color: "#111827",
  },
  dropText: {
    fontSize: 15,
    color: "#6b7280",
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
  toolArea: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  modeToggle: {
    display: "inline-flex",
    gap: 4,
    background: "var(--surface-2)",
    borderRadius: 10,
    padding: 4,
    alignSelf: "flex-start",
  },
  modeBtn: {
    background: "none",
    border: "none",
    borderRadius: 8,
    padding: "8px 18px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    color: "#6b7280",
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  modeBtnActive: {
    background: "var(--surface)",
    color: "#111827",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  sliderRow: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  sliderLabel: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
  },
  slider: {
    width: "100%",
    accentColor: "#2563eb",
    height: 6,
  },
  sliderHints: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#9ca3af",
  },
  targetRow: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  targetInputRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  targetInput: {
    width: 90,
    padding: "10px 12px",
    fontSize: 16,
    fontWeight: 600,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontFamily: "inherit",
    textAlign: "right",
    color: "#111827",
    outline: "none",
  },
  targetUnit: {
    fontSize: 15,
    fontWeight: 600,
    color: "#6b7280",
    marginRight: 4,
  },
  compressBtn: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "10px 22px",
    fontWeight: 700,
    fontSize: 14,
    fontFamily: "inherit",
  },
  targetMsg: {
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.5,
  },
  targetMsgInfo: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1e40af",
  },
  targetMsgWarning: {
    background: "#fffbeb",
    border: "1px solid #fcd34d",
    color: "#92400e",
  },
  targetMsgSuccess: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#166534",
  },
  savingsBadge: {
    background: "#dcfce7",
    border: "1px solid #86efac",
    borderRadius: 12,
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  savingsPercent: {
    fontSize: 18,
    fontWeight: 800,
    color: "#166534",
  },
  savingsDetail: {
    fontSize: 14,
    color: "#166534",
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
    background: "var(--surface-3)",
  },
  processingBox: {
    width: "100%",
    height: 220,
    background: "var(--surface-3)",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  spinner: {
    fontSize: 28,
  },
  previewSize: {
    marginTop: 10,
    fontWeight: 700,
    fontSize: 14,
    color: "#111827",
  },
  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  downloadBtn: {
    background: "var(--upload-btn-bg)",
    color: "var(--upload-btn-color)",
    border: "none",
    padding: "9px 24px",
    borderRadius: 24,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  saveAsBtn: {
    background: "transparent",
    color: "var(--outline-btn-color)",
    border: "1.5px solid var(--outline-btn-color)",
    padding: "9px 24px",
    borderRadius: 24,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.92)",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 20px 32px",
    gap: 20,
    overflowY: "auto",
  },
  overlayClose: {
    alignSelf: "flex-start",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "#fff",
    borderRadius: 999,
    padding: "10px 22px",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    fontFamily: "inherit",
    flexShrink: 0,
  },
  overlayImg: {
    maxWidth: "100%",
    maxHeight: "70vh",
    objectFit: "contain",
    borderRadius: 14,
    display: "block",
  },
  overlayHint: {
    color: "#d1d5db",
    fontSize: 16,
    fontWeight: 500,
    textAlign: "center",
    lineHeight: 1.6,
    margin: 0,
    padding: "0 8px",
  },
  resetBtn: {
    background: "transparent",
    border: "1.5px solid var(--reset-btn-color)",
    padding: "9px 24px",
    borderRadius: 24,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
    color: "var(--reset-btn-text)",
  },
  privacyNote: {
    marginTop: 20,
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },
};
