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
  const [stripped, setStripped] = useState(null);
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

  async function handleSaveAs() {
    if (!stripped) return;
    var ext = stripped.mime === "image/png" ? "png" : "jpg";
    var base = file.name.replace(/\.[^.]+$/, "");
    var filename = base + "-clean." + ext;
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var mime = stripped.mime;
        var handle = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: "File", accept: { [mime]: ["." + ext] } }] });
        var blob = await fetch(stripped.url).then(function(r) { return r.blob(); });
        var writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch(e) {
        if (e.name === "AbortError") return;
      }
    }
    download();
  }

  var saveBtn = { background: "#0071e3", color: "white", border: "none", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "#0071e3", border: "1.5px solid #0071e3", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };
  var resetBtn = { background: "var(--surface-2)", color: "var(--text-muted)", border: "none", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "600", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 }}>
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={function (e) { e.preventDefault(); setDragging(true); }}
          onDragLeave={function () { setDragging(false); }}
          onClick={function () { inputRef.current.click(); }}
          style={{
            border: "2px dashed",
            borderColor: dragging ? "#0071e3" : "var(--border)",
            background: dragging ? "#f0f7ff" : "var(--surface-2)",
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
          <div style={{ fontSize: "48px", marginBottom: "14px", lineHeight: 1 }}><i className="ti ti-shield-off" style={{color:'#30A46C'}}></i></div>
          <p style={{ fontSize: "18px", fontWeight: "700", marginBottom: "6px", color: "var(--text)" }}>
            Drop a photo here
          </p>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            or click to choose. JPG, PNG and WebP supported
          </p>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "130px 1fr",
              gap: "20px",
              background: "var(--surface-2)",
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
              <p style={{ fontWeight: "700", fontSize: "15px", marginBottom: "14px", wordBreak: "break-all", lineHeight: 1.4, color: "var(--text)" }}>
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
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        {pair[0]}
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: "500", color: "var(--text)" }}>{pair[1]}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {!stripped && (
            <div style={{ background: "#fff8e8", border: "1px solid #fde68a", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", color: "#92400e", lineHeight: 1.6 }}>
                <strong>What will be removed:</strong> GPS coordinates, device model &amp; serial number, capture date &amp; time, camera settings (aperture, shutter speed, ISO), software version, and all other embedded metadata.
              </p>
            </div>
          )}

          {stripped && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "14px 18px", marginBottom: "16px" }}>
              <p style={{ color: "#16a34a", fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>
                ✓ All EXIF metadata removed
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {formatSize(file.size)} → {formatSize(stripped.size)}
                {file.size - stripped.size > 0 && (
                  <span style={{ color: "#16a34a", fontWeight: "600" }}> (saved {formatSize(file.size - stripped.size)})</span>
                )}
              </p>
            </div>
          )}

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
                  borderRadius: "99px",
                  padding: "16px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  minHeight: "52px",
                  fontFamily: "inherit",
                }}
              >
                {loading ? "Processing…" : "Remove EXIF Data"}
              </button>
            ) : (
              <>
                <button onClick={download} style={saveBtn}>Save</button>
                <button onClick={handleSaveAs} style={saveAsBtn}>Save As...</button>
              </>
            )}
            <button onClick={reset} style={resetBtn}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}
