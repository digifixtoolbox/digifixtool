import { useState, useRef, useCallback } from "react";
import SaveAsDialog from "./SaveAsDialog";
import { IconFileMinus, IconShare } from '@tabler/icons-react';

var _pdfLibPromise = null;
function loadPdfLib() {
  if (!_pdfLibPromise) _pdfLibPromise = import("pdf-lib");
  return _pdfLibPromise;
}

var _pdfjsPromise = null;
function loadPdfJs() {
  if (typeof window !== "undefined" && window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (_pdfjsPromise) return _pdfjsPromise;
  _pdfjsPromise = new Promise(function(resolve, reject) {
    var script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = function() {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    script.onerror = function() { _pdfjsPromise = null; reject(new Error("Could not load PDF.js")); };
    document.head.appendChild(script);
  });
  return _pdfjsPromise;
}

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.pdf', { type: 'application/pdf' })] }); }
  catch(e) { return false; }
})();

export default function PdfCompressor() {
  var [file, setFile]               = useState(null);
  var [level, setLevel]             = useState("recommended");
  var [status, setStatus]           = useState("idle"); // idle | compressing | done
  var [progress, setProgress]       = useState(0);
  var [progressLabel, setProgressLabel] = useState("");
  var [result, setResult]           = useState(null); // { origSize, newSize, blob }
  var [error, setError]             = useState("");
  var [dragOver, setDragOver]       = useState(false);
  var [saveAsName, setSaveAsName]   = useState(null);
  var inputRef = useRef(null);

  function fmt(bytes) {
    if (bytes < 1024)           return bytes + " B";
    if (bytes < 1024 * 1024)   return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  }

  function pickFile(f) {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file (.pdf).");
      return;
    }
    if (f.size > 100 * 1024 * 1024) {
      setError(`File too large (${(f.size / 1024 / 1024).toFixed(1)}MB). Maximum is 100MB. Pro version coming soon with higher limits.`);
      return;
    }
    setFile(f);
    setError("");
    setResult(null);
    setStatus("idle");
  }

  var onDragOver = useCallback(function(e) {
    e.preventDefault();
    setDragOver(true);
  }, []);

  var onDragLeave = useCallback(function() {
    setDragOver(false);
  }, []);

  var onDrop = useCallback(function(e) {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer.files[0]);
  }, []);

  function onInputChange(e) {
    pickFile(e.target.files[0]);
  }

  async function compress() {
    if (!file) return;

    var pdfjsLib, PDFDocument;
    try {
      [pdfjsLib, { PDFDocument }] = await Promise.all([loadPdfJs(), loadPdfLib()]);
    } catch (e) {
      setError("Could not load PDF library. Please check your connection and try again.");
      return;
    }

    var scale   = level === "low" ? 0.78 : level === "recommended" ? 0.75 : 0.55;
    var quality = level === "low" ? 0.82 : level === "recommended" ? 0.68 : 0.50;

    setStatus("compressing");
    setProgress(0);
    setProgressLabel("Loading PDF…");
    setError("");
    setResult(null);

    try {
      var arrayBuffer = await file.arrayBuffer();
      var uint8 = new Uint8Array(arrayBuffer);

      var pdfJsDoc = await pdfjsLib.getDocument({ data: uint8 }).promise;
      var numPages = pdfJsDoc.numPages;
      var newPdf   = await PDFDocument.create();

      for (var i = 1; i <= numPages; i++) {
        setProgressLabel("Compressing page " + i + " of " + numPages + "…");
        setProgress(Math.round(((i - 1) / numPages) * 90));

        var page     = await pdfJsDoc.getPage(i);
        var viewport = page.getViewport({ scale: scale });

        var canvas   = document.createElement("canvas");
        canvas.width  = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        var ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;

        var dataUrl   = canvas.toDataURL("image/jpeg", quality);
        var b64       = dataUrl.split(",")[1];
        var jpegBytes = Uint8Array.from(atob(b64), function(c) { return c.charCodeAt(0); });

        var img     = await newPdf.embedJpg(jpegBytes);
        var newPage = newPdf.addPage([canvas.width, canvas.height]);
        newPage.drawImage(img, { x: 0, y: 0, width: canvas.width, height: canvas.height });
      }

      setProgressLabel("Finalising PDF…");
      setProgress(97);

      var compressedBytes = await newPdf.save({ useObjectStreams: true });
      setProgress(100);

      var blob = new Blob([compressedBytes], { type: "application/pdf" });
      setResult({ origSize: file.size, newSize: compressedBytes.byteLength, blob: blob });
      setStatus("done");

    } catch (err) {
      console.error("Compression error:", err);
      setError(
        "Compression failed. The PDF may be password-protected, corrupted, " +
        "or use features not supported in this browser."
      );
      setStatus("idle");
    }
  }

  function handleSave() {
    if (!result) return;
    var url = URL.createObjectURL(result.blob);
    var a   = document.createElement("a");
    a.href     = url;
    a.download = "compressed_" + file.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSaveAs() {
    if (!result) return;
    var filename = "compressed_" + file.name;
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: "PDF Document", accept: { "application/pdf": [".pdf"] } }],
        });
        var writable = await handle.createWritable();
        await writable.write(result.blob);
        await writable.close();
        return;
      } catch(e) {
        if (e.name === "AbortError") return;
      }
    }
    setSaveAsName(filename);
  }

  function doSaveAs(filename) {
    var url = URL.createObjectURL(result.blob);
    var a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    setSaveAsName(null);
  }

  var saveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var shareBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var resetBtn = { background: "transparent", color: "var(--pdf-reset-color)", border: "1.5px solid var(--pdf-reset-border)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };

  async function handleShare() {
    if (!result) return;
    var filename = "compressed_" + file.name;
    var shareFile = new File([result.blob], filename, { type: 'application/pdf' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [shareFile] })) {
      try { await navigator.share({ files: [shareFile], title: 'PixMidas' }); }
      catch(err) { if (err.name !== 'AbortError') { handleSave(); } }
    } else { handleSave(); }
  }

  function reset() {
    setFile(null);
    setStatus("idle");
    setResult(null);
    setError("");
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  }

  var cardStyle = { background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 };

  var primaryBtn = {
    display: "block", width: "100%",
    padding: "17px 24px", borderRadius: "99px",
    background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none",
    fontSize: "17px", fontWeight: "600", cursor: "pointer",
    fontFamily: "inherit", transition: "background 0.15s",
  };
  var secondaryBtn = {
    display: "block", width: "100%",
    padding: "15px 24px", borderRadius: "99px",
    background: "var(--surface-2)", color: "var(--text)",
    border: "1px solid var(--border-light)",
    fontSize: "15px", fontWeight: "600", cursor: "pointer",
    fontFamily: "inherit",
  };

  if (status === "idle") {
    return (
      <div style={cardStyle}>
        <div
          role="button"
          tabIndex={0}
          style={{
            border: "2px dashed " + (dragOver ? "#0071e3" : "var(--border)"),
            borderRadius: "20px",
            padding: "56px 24px",
            textAlign: "center",
            background: dragOver ? "#f0f7ff" : "var(--surface-2)",
            cursor: "pointer",
            transition: "border-color 0.18s, background 0.18s",
          }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={function() { inputRef.current && inputRef.current.click(); }}
          onKeyDown={function(e) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current && inputRef.current.click();
            }
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            style={{ display: "none" }}
            onChange={onInputChange}
          />

          <div style={{ fontSize: "40px", marginBottom: "12px" }}><IconFileMinus size={40} color="#E54D2E" stroke={2} /></div>

          {file ? (
            <div>
              <p style={{ fontSize: "16px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}>
                📄 {file.name}
              </p>
              <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>{fmt(file.size)}</p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "8px" }}>Click to change file</p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "17px", fontWeight: "600", color: "var(--text)", marginBottom: "6px" }}>
                Drop your PDF here or{" "}
                <span style={{ color: "var(--upload-btn-bg)" }}>browse</span>
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "4px" }}>
                Supports .pdf files
              </p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>Maximum file size: 100MB</p>
            </div>
          )}
        </div>

        {error && (
          <p style={{ color: "#dc2626", fontSize: "14px", fontWeight: "500", marginTop: "12px" }}>
            ⚠️ {error}
          </p>
        )}

        {file && (
          <div style={{ marginTop: "20px" }}>
            <label style={{ display: "block", fontSize: "15px", fontWeight: "600", marginBottom: "10px", color: "var(--text)" }}>
              Compression Level
            </label>
            <select
              value={level}
              onChange={function(e) { setLevel(e.target.value); }}
              style={{
                width: "100%", padding: "10px 12px", marginBottom: "16px",
                border: "1px solid var(--border)", borderRadius: "10px",
                fontSize: "14px", fontFamily: "inherit", cursor: "pointer",
                background: "var(--surface)", color: "var(--text)", outline: "none",
              }}
            >
              <option value="low">Low Compression — Soft compression, minimal quality loss</option>
              <option value="recommended">Recommended — Balanced quality and file size</option>
              <option value="high">High Compression — Aggressive compression, noticeable quality loss</option>
            </select>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px", lineHeight: "1.5" }}>
              Pages are re-rendered as high-quality images. Works best on scanned documents and image-heavy PDFs. Text-only PDFs may not compress much.
            </p>
            <button onClick={compress} style={primaryBtn}>
              Compress PDF
            </button>
          </div>
        )}
      </div>
    );
  }

  if (status === "compressing") {
    return (
      <div style={cardStyle}>
        <div style={{
          background: "var(--surface-2)", borderRadius: "20px",
          padding: "48px 32px", textAlign: "center",
        }}>
          <p style={{ fontSize: "17px", fontWeight: "600", color: "var(--text)", marginBottom: "16px" }}>
            {progressLabel || "Processing…"}
          </p>
          <div style={{
            height: "8px", background: "var(--border-light)", borderRadius: "99px",
            overflow: "hidden", maxWidth: "380px", margin: "0 auto 10px",
          }}>
            <div style={{
              height: "100%", background: "#0071e3", borderRadius: "99px",
              width: progress + "%", transition: "width 0.35s ease",
            }} />
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>{progress}%</p>
        </div>
      </div>
    );
  }

  if (status === "done" && result) {
    var saved          = result.origSize - result.newSize;
    var pct            = ((saved / result.origSize) * 100).toFixed(1);
    var alreadyOptimal = (saved / result.origSize) < 0.05;

    return (
      <div style={cardStyle}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "24px", flexWrap: "wrap",
          background: "var(--surface-2)", borderRadius: "16px",
          padding: "24px", marginBottom: "16px",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Original</div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--text)" }}>{fmt(result.origSize)}</div>
          </div>
          <div style={{ fontSize: "24px", color: "var(--text-muted)" }}>→</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Compressed</div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--text)" }}>{fmt(result.newSize)}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: "800", color: saved > 0 ? "#16a34a" : "#dc2626" }}>
              {saved > 0 ? "−" + pct + "%" : "+" + Math.abs(parseFloat(pct)) + "%"}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
              {saved > 0 ? "saved" : "larger"}
            </div>
          </div>
        </div>

        {alreadyOptimal && (
          <div style={{
            background: "#fffbeb", border: "1px solid #fde68a",
            borderRadius: "12px", padding: "14px 18px",
            marginBottom: "16px", fontSize: "14px",
            color: "#92400e", lineHeight: "1.55",
          }}>
            This PDF is already well optimized. Less than 5% was saved. It may be text-only or previously compressed. Download anyway?
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginBottom: "10px" }}>
          <button onClick={handleSave} style={saveBtn}>Save</button>
          <button onClick={handleSaveAs} style={saveAsBtn}>Save As...</button>
          {supportsFileShare && <button onClick={handleShare} style={shareBtn}><IconShare size={16} stroke={2} /> Share</button>}
          <button onClick={reset} style={resetBtn}>Reset</button>
        </div>
        {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doSaveAs} onCancel={function() { setSaveAsName(null); }} />}
      </div>
    );
  }

  return null;
}
