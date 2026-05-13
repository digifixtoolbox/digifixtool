import { useState, useRef } from "react";

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function ExifRemover() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [imgDims, setImgDims] = useState(null);
  const [stripped, setStripped] = useState(null); // { url, size, mime }
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  function loadFile(f) {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setStripped(null);
    setLoading(false);
    const reader = new FileReader();
    reader.onload = function (e) {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      const img = new window.Image();
      img.onload = function () {
        setImgDims({ w: img.naturalWidth, h: img.naturalHeight });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    loadFile(e.dataTransfer.files[0]);
  }

  function removeExif() {
    if (!preview) return;
    setLoading(true);
    const img = new window.Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const mimeOut = file.type === "image/png" ? "image/png" : "image/jpeg";
      const quality = mimeOut === "image/jpeg" ? 0.95 : undefined;
      canvas.toBlob(
        function (blob) {
          const url = URL.createObjectURL(blob);
          setStripped({ url: url, size: blob.size, mime: mimeOut });
          setLoading(false);
        },
        mimeOut,
        quality
      );
    };
    img.src = preview;
  }

  function download() {
    if (!stripped) return;
    const a = document.createElement("a");
    a.href = stripped.url;
    const ext = stripped.mime === "image/png" ? "png" : "jpg";
    const base = file.name.replace(/\.[^.]+$/, "");
    a.download = base + "-clean." + ext;
    a.click();
  }

  function reset() {
    if (stripped) URL.revokeObjectURL(stripped.url);
    setFile(null);
    setPreview("");
    setImgDims(null);
    setStripped(null);
    setLoading(false);
  }

  if (!file) {
    return (
      <div
        onDrop={handleDrop}
        onDragOver={function (e) { e.preventDefault(); setDragging(true); }}
        onDragLeave={function () { setDragging(false); }}
        onClick={function () { inputRef.current.click(); }}
        style={{
          border: "2px dashed",
          borderColor: dragging ? "#0071e3" : "#d2d2d7",
          background: dragging ? "#f0f7ff" : "transparent",
          borderRadius: "18px",
          padding: "56px 24px",
          textAlign: "center",
          cursor: "pointer",
          transition: "border-color 0.15s, background 0.15s",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/tiff,image/heic"
          style={{ display: "none" }}
          onChange={function (e) { loadFile(e.target.files[0]); }}
        />
        <div style={{ fontSize: "48px", marginBottom: "14px", lineHeight: 1 }}>🛡️</div>
        <p style={{ fontSize: "18px", fontWeight: "700", marginBottom: "6px", color: "#1d1d1f" }}>
          Drop a photo here
        </p>
        <p style={{ fontSize: "14px", color: "#86868b" }}>
          or click to choose — JPG, PNG, WebP supported
        </p>
      </div>
    );
  }

  const sizeDelta = stripped ? file.size - stripped.size : 0;

  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* Image preview + file details */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "130px 1fr",
          gap: "20px",
          background: "#f5f5f7",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "16px",
          alignItems: "start",
        }}
      >
        <img
          src={preview}
          alt="Preview"
          loading="lazy"
          style={{ width: "130px", height: "130px", objectFit: "cover", borderRadius: "10px", display: "block" }}
        />
        <div>
          <p style={{ fontWeight: "700", fontSize: "15px", marginBottom: "14px", wordBreak: "break-all", lineHeight: 1.4 }}>
            {file.name}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              ["Format", file.type.replace("image/", "").toUpperCase()],
              ["Dimensions", imgDims ? imgDims.w + " × " + imgDims.h : "…"],
              ["Original size", formatSize(file.size)],
              ["EXIF status", stripped ? "✓ Stripped" : "⚠️ Unverified"],
            ].map(function (pair) {
              return (
                <div key={pair[0]}>
                  <p style={{ fontSize: "11px", color: "#86868b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                    {pair[0]}
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: "500", color: "#1d1d1f" }}>{pair[1]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* What gets removed info box */}
      {!stripped && (
        <div style={{ background: "#fff8e8", border: "1px solid #fde68a", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px" }}>
          <p style={{ fontSize: "13px", color: "#92400e", lineHeight: 1.6 }}>
            <strong>What will be removed:</strong> GPS coordinates, device model &amp; serial number, capture date &amp; time, camera settings (aperture, shutter speed, ISO), software version, and all other embedded metadata.
          </p>
        </div>
      )}

      {/* Success state */}
      {stripped && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "14px 18px", marginBottom: "16px" }}>
          <p style={{ color: "#16a34a", fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>
            ✓ All EXIF metadata removed
          </p>
          <p style={{ fontSize: "13px", color: "#6e6e73" }}>
            {formatSize(file.size)} → {formatSize(stripped.size)}
            {sizeDelta > 0 && (
              <span style={{ color: "#16a34a", fontWeight: "600" }}> (saved {formatSize(sizeDelta)})</span>
            )}
            {sizeDelta < 0 && (
              <span style={{ color: "#6e6e73" }}> (+{formatSize(Math.abs(sizeDelta))} recompression)</span>
            )}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {!stripped ? (
          <button
            onClick={removeExif}
            disabled={loading}
            style={{
              flex: "1",
              minWidth: "180px",
              background: "#0071e3",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              minHeight: "52px",
              fontFamily: "inherit",
              transition: "background 0.15s",
            }}
          >
            {loading ? "Processing…" : "Remove EXIF Data"}
          </button>
        ) : (
          <button
            onClick={download}
            style={{
              flex: "1",
              minWidth: "180px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              minHeight: "52px",
              fontFamily: "inherit",
            }}
          >
            Download Clean Image
          </button>
        )}
        <button
          onClick={reset}
          style={{
            background: "#f5f5f7",
            color: "#1d1d1f",
            border: "1px solid #e8e8ed",
            borderRadius: "12px",
            padding: "16px 22px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            minHeight: "52px",
            fontFamily: "inherit",
          }}
        >
          New image
        </button>
      </div>
    </div>
  );
}
