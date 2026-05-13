import { useRef, useState } from "react";

export default function ImageCompressor() {
  const fileInputRef = useRef(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [quality, setQuality] = useState(0.7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  const compressImage = async (file, compressionQuality) => {
    setIsProcessing(true);
    try {
      const imageBitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      const maxWidth = 1920;
      const scale = Math.min(1, maxWidth / imageBitmap.width);
      canvas.width = imageBitmap.width * scale;
      canvas.height = imageBitmap.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          setCompressedUrl(url);
          setCompressedSize(blob.size);
          setIsProcessing(false);
        },
        "image/jpeg",
        compressionQuality
      );
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setOriginalFile(file);
    setOriginalPreview(URL.createObjectURL(file));
    await compressImage(file, quality);
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

  const reset = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setCompressedUrl(null);
    setCompressedSize(null);
  };

  const downloadName = originalFile
    ? originalFile.name.replace(/\.[^/.]+$/, "") + "-compressed.jpg"
    : "compressed.jpg";

  const savings = calculateSavings();

  return (
    <div style={s.wrapper}>

      {!originalFile ? (
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
          <div style={s.uploadIcon}>🗜️</div>
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

          {savings !== null && (
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
                  <p style={{ color: "#6b7280", fontSize: 14 }}>Processing...</p>
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
              <a href={compressedUrl} download={downloadName} style={s.downloadBtn}>
                ⬇ Download compressed image
              </a>
            )}
            <button onClick={reset} style={s.resetBtn}>
              Start again
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
  toolArea: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
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
    background: "#f3f4f6",
  },
  processingBox: {
    width: "100%",
    height: 220,
    background: "#f3f4f6",
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
