import { useState, useRef, useCallback } from "react";
import SaveAsDialog from "./SaveAsDialog";
import { PDFDocument } from "pdf-lib";

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.pdf', { type: 'application/pdf' })] }); }
  catch(e) { return false; }
})();

export default function ImagesToPDF() {
  const [images, setImages] = useState([]);
  const [converting, setConverting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [saveAsName, setSaveAsName] = useState(null);
  const inputRef = useRef(null);
  const nextId = useRef(0);

  function fmt(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  }

  function addFiles(fileList) {
    const valid = Array.from(fileList).filter(
      f => f.type === "image/jpeg" || f.type === "image/png" || f.type === "image/webp"
    );
    if (!valid.length) {
      setError("Please select JPG, PNG, or WebP images.");
      return;
    }
    const oversized = valid.filter(f => f.size > 50 * 1024 * 1024);
    if (oversized.length) {
      setError(`${oversized[0].name} is too large (${(oversized[0].size / 1024 / 1024).toFixed(1)}MB). Maximum per image is 50MB. Pro version coming soon with higher limits.`);
      return;
    }
    setError("");
    setDone(false);
    const newItems = valid.map(f => ({
      file: f,
      url: URL.createObjectURL(f),
      id: nextId.current++,
    }));
    setImages(prev => [...prev, ...newItems]);
  }

  const onDragOver = useCallback(e => { e.preventDefault(); setDragOver(true); }, []);
  const onDragLeave = useCallback(() => setDragOver(false), []);
  const onDrop = useCallback(e => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, []);

  function removeImage(id) {
    setImages(prev => {
      const item = prev.find(i => i.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter(i => i.id !== id);
    });
  }

  function moveUp(idx) {
    if (idx === 0) return;
    setImages(prev => {
      const arr = prev.slice();
      const tmp = arr[idx - 1]; arr[idx - 1] = arr[idx]; arr[idx] = tmp;
      return arr;
    });
  }

  function moveDown(idx) {
    setImages(prev => {
      if (idx === prev.length - 1) return prev;
      const arr = prev.slice();
      const tmp = arr[idx + 1]; arr[idx + 1] = arr[idx]; arr[idx] = tmp;
      return arr;
    });
  }

  async function convert() {
    if (!images.length) return;
    setConverting(true);
    setError("");
    setDone(false);
    try {
      const pdf = await PDFDocument.create();
      for (const item of images) {
        const buf = await item.file.arrayBuffer();
        let pdfImage;
        if (item.file.type === "image/png") {
          pdfImage = await pdf.embedPng(buf);
        } else if (item.file.type === "image/webp") {
          const bitmap = await createImageBitmap(item.file);
          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          canvas.getContext("2d").drawImage(bitmap, 0, 0);
          const jpegBuf = await new Promise(resolve =>
            canvas.toBlob(b => b.arrayBuffer().then(resolve), "image/jpeg", 0.92)
          );
          pdfImage = await pdf.embedJpg(jpegBuf);
        } else {
          pdfImage = await pdf.embedJpg(buf);
        }
        const page = pdf.addPage([pdfImage.width, pdfImage.height]);
        page.drawImage(pdfImage, { x: 0, y: 0, width: pdfImage.width, height: pdfImage.height });
      }
      const bytes = await pdf.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to create PDF. Please check your images and try again.");
    } finally {
      setConverting(false);
    }
  }

  function reset() {
    images.forEach(i => URL.revokeObjectURL(i.url));
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setImages([]);
    setDone(false);
    setPdfUrl(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleSave() {
    if (!pdfUrl) return;
    var a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "images.pdf"; a.click();
  }

  async function handleSaveAs() {
    if (!pdfUrl) return;
    var filename = "images.pdf";
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var blob = await fetch(pdfUrl).then(function(r) { return r.blob(); });
        var handle = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: "PDF Document", accept: { "application/pdf": [".pdf"] } }] });
        var writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch(e) { if (e.name === "AbortError") return; }
    }
    setSaveAsName(filename);
  }

  function doSaveAs(filename) {
    var a = document.createElement("a"); a.href = pdfUrl; a.download = filename; a.click();
    setSaveAsName(null);
  }

  var saveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var shareBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var resetBtn = { background: "transparent", color: "var(--reset-btn-text)", border: "1.5px solid var(--reset-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };

  async function handleShare() {
    if (!pdfUrl) return;
    var blob = await fetch(pdfUrl).then(function(r) { return r.blob(); });
    var file = new File([blob], 'images.pdf', { type: 'application/pdf' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'PixMidas' }); }
      catch(err) { if (err.name !== 'AbortError') { handleSave(); } }
    } else { handleSave(); }
  }

  var primaryBtn = {
    display: "block", width: "100%",
    padding: "17px 24px", borderRadius: "99px",
    background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none",
    fontSize: "17px", fontWeight: "600", cursor: "pointer",
    fontFamily: "inherit", transition: "opacity 0.15s",
  };
  var secondaryBtn = {
    display: "block", width: "100%",
    padding: "15px 24px", borderRadius: "99px",
    background: "var(--surface-2)", color: "var(--text)",
    border: "1px solid var(--border-light)",
    fontSize: "15px", fontWeight: "600", cursor: "pointer",
    fontFamily: "inherit", marginTop: "10px",
  };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 }}>
      <div
        role="button"
        tabIndex={0}
        style={{
          border: "2px dashed " + (dragOver ? "var(--upload-btn-bg)" : "var(--border)"),
          borderRadius: "20px",
          padding: images.length ? "20px 24px" : "56px 24px",
          textAlign: "center",
          background: dragOver ? "var(--accent-light)" : "var(--surface-2)",
          cursor: "pointer",
          transition: "border-color 0.18s, background 0.18s",
          marginBottom: "20px",
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current && inputRef.current.click()}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current && inputRef.current.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          style={{ display: "none" }}
          onChange={e => addFiles(e.target.files)}
        />
        {images.length === 0 ? (
          <div>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}><i className="ti ti-file-import" style={{color:'#E54D2E'}}></i></div>
            <p style={{ fontSize: "17px", fontWeight: "600", color: "#1d1d1f", marginBottom: "6px" }}>
              Drop images here or <span style={{ color: "var(--upload-btn-bg)" }}>browse</span>
            </p>
            <p style={{ fontSize: "13px", color: "#6e6e73", marginBottom: "8px" }}>
              JPG, PNG, WebP. Select multiple files at once
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>Maximum per image: 50MB</p>
          </div>
        ) : (
          <p style={{ fontSize: "14px", color: "var(--upload-btn-bg)", fontWeight: "600" }}>+ Add more images</p>
        )}
      </div>

      {error && (
        <p style={{ color: "#dc2626", fontSize: "14px", fontWeight: "500", marginBottom: "12px" }}>
          ⚠️ {error}
        </p>
      )}

      {images.length > 0 && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
            {images.map((item, idx) => (
              <div key={item.id} style={{
                display: "flex", alignItems: "center", gap: "10px",
                background: "var(--surface-2)", borderRadius: "12px", padding: "10px 14px",
              }}>
                <span style={{ fontSize: "13px", color: "#6e6e73", minWidth: "20px", fontWeight: "700", textAlign: "center" }}>{idx + 1}</span>
                <img
                  src={item.url}
                  alt={item.file.name}
                  style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }}
                />
                <span style={{ flex: 1, fontSize: "13px", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.file.name}
                </span>
                <span style={{ fontSize: "12px", color: "#6e6e73", flexShrink: 0 }}>{fmt(item.file.size)}</span>
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "4px 10px", fontSize: "13px", cursor: idx === 0 ? "default" : "pointer", opacity: idx === 0 ? 0.4 : 1 }}
                >↑</button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx === images.length - 1}
                  style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "4px 10px", fontSize: "13px", cursor: idx === images.length - 1 ? "default" : "pointer", opacity: idx === images.length - 1 ? 0.4 : 1 }}
                >↓</button>
                <button
                  onClick={() => removeImage(item.id)}
                  style={{ background: "var(--surface)", border: "1px solid #fca5a5", borderRadius: "8px", padding: "4px 10px", fontSize: "13px", cursor: "pointer", color: "#dc2626" }}
                >✕</button>
              </div>
            ))}
          </div>

          {done && pdfUrl && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px" }}>
              <p style={{ color: "#16a34a", fontWeight: "700", fontSize: "14px" }}>✓ PDF created successfully!</p>
            </div>
          )}

          <button
            onClick={convert}
            disabled={converting}
            style={{ ...primaryBtn, opacity: converting ? 0.7 : 1, cursor: converting ? "not-allowed" : "pointer" }}
          >
            {converting
              ? "Creating PDF…"
              : "Convert " + images.length + " Image" + (images.length !== 1 ? "s" : "") + " to PDF"}
          </button>
          {done && pdfUrl && (
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "10px", justifyContent: "center" }}>
              <button onClick={handleSave} style={saveBtn}>Save</button>
              <button onClick={handleSaveAs} style={saveAsBtn}>Save As...</button>
              {supportsFileShare && <button onClick={handleShare} style={shareBtn}><i className="ti ti-share" /> Share</button>}
              <button onClick={reset} style={resetBtn}>Reset</button>
            </div>
          )}
          {!done && <button onClick={reset} style={secondaryBtn}>Clear All</button>}
        </div>
      )}
      {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doSaveAs} onCancel={function() { setSaveAsName(null); }} />}
    </div>
  );
}
