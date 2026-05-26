import { useState } from "react";
import { IconScan } from '@tabler/icons-react';

var _tesseractPromise = null;
function loadTesseract() {
  if (!_tesseractPromise) {
    _tesseractPromise = new Promise(function(resolve, reject) {
      if (typeof window.Tesseract !== "undefined") { resolve(window.Tesseract); return; }
      var script = document.createElement("script");
      script.src = "https://unpkg.com/tesseract.js@5/dist/tesseract.min.js";
      script.onload = function() { resolve(window.Tesseract); };
      script.onerror = function() { _tesseractPromise = null; reject(new Error("Could not load OCR library")); };
      document.head.appendChild(script);
    });
  }
  return _tesseractPromise;
}

export default function ImageToText() {
  const [status, setStatus] = useState("idle");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [progLabel, setProgLabel] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);

  function processFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please upload an image file."); return; }
    if (file.size > 20 * 1024 * 1024) { setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 20MB. Pro version coming soon with higher limits.`); return; }
    setError(""); setText(""); setStatus("loading"); setProgress(0); setProgLabel("Loading OCR engine...");
    loadTesseract().then(function(Tesseract) {
    setProgLabel("Starting...");
    Tesseract.recognize(file, "eng", {
      logger: function(m) {
        if (m.status === "recognizing text") {
          setProgress(Math.round(m.progress * 100)); setProgLabel("Recognizing text...");
        } else if (m.status === "loading tesseract core") {
          setProgLabel("Loading engine...");
        } else if (m.status === "initializing tesseract") {
          setProgLabel("Initializing...");
        } else if (m.status === "loading language traineddata") {
          setProgLabel("Loading language data...");
        } else {
          setProgLabel(m.status || "Processing...");
        }
      }
    }).then(function(result) {
      setText(result.data.text.trim());
      setStatus("done");
    }).catch(function() {
      setError("OCR failed. Please try a clearer image with visible text.");
      setStatus("idle");
    });
    }).catch(function() {
      setError("OCR library failed to load. Please check your connection and try again.");
      setStatus("idle");
    });
  }

  function handleFile(e) { processFile(e.target.files[0]); }

  function handleDrop(e) {
    e.preventDefault(); setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }

  function copyText() {
    if (!text) return;
    navigator.clipboard.writeText(text).then(function() {
      setCopied(true); setTimeout(function() { setCopied(false); }, 2000);
    });
  }

  function reset() { setStatus("idle"); setText(""); setError(""); setProgress(0); }

  var cardStyle = { background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 };

  if (status === "idle") return (
    <div style={cardStyle}>
      <div
        onClick={function() { document.getElementById("ocr-input").click(); }}
        onDragOver={function(e) { e.preventDefault(); setDragOver(true); }}
        onDragLeave={function() { setDragOver(false); }}
        onDrop={handleDrop}
        style={{ border: "2px dashed " + (dragOver ? "var(--upload-btn-bg)" : "var(--border)"), borderRadius: "16px", padding: "48px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? "var(--accent-light)" : "var(--surface-2)", transition: "border-color 0.15s, background 0.15s" }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}><IconScan size={48} color="#E54D2E" stroke={2} /></div>
        <p style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>Drop an image here or click to browse</p>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>Supports JPG, PNG, WebP, GIF, BMP</p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "20px" }}>Maximum file size: 20MB</p>
        <input id="ocr-input" type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
        <span style={{ background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "12px 24px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>Choose Image</span>
        {error && <p style={{ color: "#dc2626", marginTop: "16px", fontSize: "14px" }}>{error}</p>}
      </div>
    </div>
  );

  if (status === "loading") return (
    <div style={cardStyle}>
      <div style={{ background: "var(--surface-2)", borderRadius: "16px", padding: "40px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>Reading text from image...</p>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>{progLabel}</p>
        <div style={{ background: "var(--border-light)", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
          <div style={{ background: "var(--upload-btn-bg)", borderRadius: "999px", height: "8px", width: progress + "%", transition: "width 0.3s ease" }} />
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "10px" }}>{progress}%</p>
      </div>
    </div>
  );

  return (
    <div style={cardStyle}>
      <div style={{ background: "var(--surface-2)", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
          <p style={{ fontSize: "15px", fontWeight: "600", margin: 0, color: "var(--text)" }}>Extracted Text</p>
          <button onClick={copyText} style={{ background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "8px 18px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
            {copied ? "Copied!" : "Copy Text"}
          </button>
        </div>
        <textarea
          readOnly
          value={text || "(No text found in image)"}
          style={{ width: "100%", minHeight: "200px", border: "1px solid var(--border-light)", borderRadius: "10px", padding: "12px", fontSize: "14px", fontFamily: "inherit", lineHeight: "1.6", background: "var(--surface)", color: "var(--text)", resize: "vertical", boxSizing: "border-box", outline: "none" }}
        />
      </div>
      <button onClick={reset} style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border-light)", borderRadius: "99px", padding: "14px 28px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", minHeight: "44px" }}>Try Another Image</button>
    </div>
  );
}
