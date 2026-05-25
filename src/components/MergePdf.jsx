import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import SaveAsDialog from "./SaveAsDialog";

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.pdf', { type: 'application/pdf' })] }); }
  catch(e) { return false; }
})();

export default function MergePdf() {
  const [files, setFiles] = useState([]);
  const [merging, setMerging] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [saveAsName, setSaveAsName] = useState(null);

  function handleFiles(e) {
    var selected = Array.from(e.target.files).filter(function(f) { return f.type === "application/pdf"; });
    var existingTotal = files.reduce(function(sum, f) { return sum + f.size; }, 0);
    var newTotal = selected.reduce(function(sum, f) { return sum + f.size; }, 0);
    if (existingTotal + newTotal > 100 * 1024 * 1024) {
      setError("Total file size too large (" + ((existingTotal + newTotal) / 1024 / 1024).toFixed(1) + "MB). Maximum combined size is 100MB. Pro version coming soon with higher limits.");
      return;
    }
    setFiles(function(prev) { return prev.concat(selected); });
    setDone(false);
    setError("");
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    var dropped = Array.from(e.dataTransfer.files).filter(function(f) { return f.type === "application/pdf"; });
    if (!dropped.length) { setError("Please drop PDF files only."); return; }
    var existingTotal = files.reduce(function(sum, f) { return sum + f.size; }, 0);
    var newTotal = dropped.reduce(function(sum, f) { return sum + f.size; }, 0);
    if (existingTotal + newTotal > 100 * 1024 * 1024) {
      setError("Total file size too large (" + ((existingTotal + newTotal) / 1024 / 1024).toFixed(1) + "MB). Maximum combined size is 100MB. Pro version coming soon with higher limits.");
      return;
    }
    setFiles(function(prev) { return prev.concat(dropped); });
    setDone(false);
    setError("");
  }

  function removeFile(i) {
    setFiles(function(prev) { return prev.filter(function(_, idx) { return idx !== i; }); });
  }

  function moveUp(i) {
    if (i === 0) return;
    setFiles(function(prev) {
      var arr = prev.slice();
      var tmp = arr[i-1]; arr[i-1] = arr[i]; arr[i] = tmp;
      return arr;
    });
  }

  function moveDown(i) {
    setFiles(function(prev) {
      if (i === prev.length - 1) return prev;
      var arr = prev.slice();
      var tmp = arr[i+1]; arr[i+1] = arr[i]; arr[i] = tmp;
      return arr;
    });
  }

  function merge() {
    if (files.length < 2) { setError("Please add at least 2 PDF files."); return; }
    setMerging(true);
    setError("");
    var readers = files.map(function(f) {
      return new Promise(function(resolve) {
        var r = new FileReader();
        r.onload = function(ev) { resolve(ev.target.result); };
        r.readAsArrayBuffer(f);
      });
    });
    Promise.all(readers).then(function(buffers) {
      return PDFDocument.create().then(function(merged) {
        var chain = Promise.resolve();
        buffers.forEach(function(buf) {
          chain = chain.then(function() {
            return PDFDocument.load(buf).then(function(doc) {
              return merged.copyPages(doc, doc.getPageIndices()).then(function(pages) {
                pages.forEach(function(p) { merged.addPage(p); });
              });
            });
          });
        });
        return chain.then(function() { return merged.save(); });
      });
    }).then(function(bytes) {
      var blob = new Blob([bytes], { type: "application/pdf" });
      var url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setMerging(false);
      setDone(true);
    }).catch(function() {
      setError("Could not merge PDFs. Please check your files.");
      setMerging(false);
    });
  }

  function handleSave() {
    if (!pdfUrl) return;
    var a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "merged.pdf"; a.click();
  }

  async function handleSaveAs() {
    if (!pdfUrl) return;
    var filename = "merged.pdf";
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

  function reset() { setFiles([]); setDone(false); if (pdfUrl) URL.revokeObjectURL(pdfUrl); setPdfUrl(null); setError(""); }

  var saveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var shareBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var resetBtn = { background: "transparent", color: "var(--reset-btn-text)", border: "1.5px solid var(--reset-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };

  async function handleShare() {
    if (!pdfUrl) return;
    var blob = await fetch(pdfUrl).then(function(r) { return r.blob(); });
    var file = new File([blob], 'merged.pdf', { type: 'application/pdf' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'PixMidas' }); }
      catch(err) { if (err.name !== 'AbortError') { handleSave(); } }
    } else { handleSave(); }
  }

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 }}>
      <div
        onClick={function() { document.getElementById("merge-input").click(); }}
        onDragOver={function(e) { e.preventDefault(); setDragOver(true); }}
        onDragLeave={function() { setDragOver(false); }}
        onDrop={handleDrop}
        style={{ border: "2px dashed " + (dragOver ? "var(--upload-btn-bg)" : "var(--border)"), borderRadius: "16px", padding: "32px 24px", textAlign: "center", background: dragOver ? "var(--accent-light)" : "var(--surface-2)", marginBottom: "20px", cursor: "pointer", transition: "border-color 0.15s, background 0.15s" }}
      >
        <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>Drop PDFs here or click to browse</p>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "4px" }}>Add multiple files and reorder before merging.</p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Maximum combined size: 100MB</p>
        <input id="merge-input" type="file" accept="application/pdf" multiple onChange={handleFiles} style={{ display: "none" }} />
      </div>

      {files.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
          {files.map(function(f, i) {
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--surface-2)", borderRadius: "12px", padding: "12px 16px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", minWidth: "20px", fontWeight: "700" }}>{i+1}</span>
                <span style={{ flex: "1", fontSize: "14px", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)" }}>{f.name}</span>
                <button onClick={function() { moveUp(i); }} style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "4px 10px", fontSize: "13px", cursor: "pointer", color: "var(--text)" }}>up</button>
                <button onClick={function() { moveDown(i); }} style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "4px 10px", fontSize: "13px", cursor: "pointer", color: "var(--text)" }}>dn</button>
                <button onClick={function() { removeFile(i); }} style={{ background: "var(--surface)", border: "1px solid #fca5a5", borderRadius: "8px", padding: "4px 10px", fontSize: "13px", cursor: "pointer", color: "#dc2626" }}>rm</button>
              </div>
            );
          })}
        </div>
      )}

      {error && <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "16px" }}>{error}</p>}
      {done && pdfUrl && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px" }}>
          <p style={{ color: "#16a34a", fontWeight: "700", fontSize: "14px" }}>✓ PDF merged successfully.</p>
        </div>
      )}

      {!done && (
        <button onClick={merge} disabled={merging || files.length < 2} style={{ background: files.length >= 2 ? "var(--upload-btn-bg)" : "var(--surface-3)", color: files.length >= 2 ? "var(--upload-btn-color)" : "var(--text-muted)", border: "none", borderRadius: "99px", padding: "16px 28px", fontSize: "16px", fontWeight: "600", cursor: files.length >= 2 ? "pointer" : "not-allowed", width: "100%", marginBottom: "10px", minHeight: "44px", fontFamily: "inherit" }}>
          {merging ? "Merging..." : "Merge PDF"}
        </button>
      )}

      {done && pdfUrl && (
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "10px", justifyContent: "center" }}>
          <button onClick={handleSave} style={saveBtn}>Save</button>
          <button onClick={handleSaveAs} style={saveAsBtn}>Save As...</button>
          {supportsFileShare && <button onClick={handleShare} style={shareBtn}><i className="ti ti-share" /> Share</button>}
          <button onClick={reset} style={resetBtn}>Reset</button>
        </div>
      )}

      {files.length > 0 && !done && (
        <button onClick={function() { document.getElementById("merge-input").click(); }} style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border-light)", borderRadius: "99px", padding: "12px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", width: "100%", fontFamily: "inherit", minHeight: "44px" }}>
          Add More Files
        </button>
      )}
      {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doSaveAs} onCancel={function() { setSaveAsName(null); }} />}
    </div>
  );
}
