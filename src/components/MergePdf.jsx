import { useState } from "react";

export default function MergePdf() {
  const [files, setFiles] = useState([]);
  const [merging, setMerging] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(e) {
    var selected = Array.from(e.target.files).filter(function(f) { return f.type === "application/pdf"; });
    setFiles(function(prev) { return prev.concat(selected); });
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
    if (typeof window.PDFLib === "undefined") {
      setError("PDF library not loaded. Please refresh.");
      setMerging(false);
      return;
    }
    var PDFLib = window.PDFLib;
    var readers = files.map(function(f) {
      return new Promise(function(resolve) {
        var r = new FileReader();
        r.onload = function(ev) { resolve(ev.target.result); };
        r.readAsArrayBuffer(f);
      });
    });
    Promise.all(readers).then(function(buffers) {
      return PDFLib.PDFDocument.create().then(function(merged) {
        var chain = Promise.resolve();
        buffers.forEach(function(buf) {
          chain = chain.then(function() {
            return PDFLib.PDFDocument.load(buf).then(function(doc) {
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
      var a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setMerging(false);
      setDone(true);
    }).catch(function() {
      setError("Could not merge PDFs. Please check your files.");
      setMerging(false);
    });
  }

  return (
    <div style={{ fontFamily: "inherit" }}>
      <div onClick={function() { document.getElementById("merge-input").click(); }} style={{ border: "2px dashed #d2d2d7", borderRadius: "16px", padding: "32px 24px", textAlign: "center", background: "#f5f5f7", marginBottom: "20px", cursor: "pointer" }}>
        <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>Click to add PDF files</p>
        <p style={{ fontSize: "13px", color: "#6e6e73" }}>Add multiple files and reorder before merging.</p>
        <input id="merge-input" type="file" accept="application/pdf" multiple onChange={handleFiles} style={{ display: "none" }} />
      </div>

      {files.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
          {files.map(function(f, i) {
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f5f5f7", borderRadius: "12px", padding: "12px 16px" }}>
                <span style={{ fontSize: "13px", color: "#6e6e73", minWidth: "20px", fontWeight: "700" }}>{i+1}</span>
                <span style={{ flex: "1", fontSize: "14px", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                <button onClick={function() { moveUp(i); }} style={{ background: "white", border: "1px solid #e8e8ed", borderRadius: "8px", padding: "4px 10px", fontSize: "13px", cursor: "pointer" }}>up</button>
                <button onClick={function() { moveDown(i); }} style={{ background: "white", border: "1px solid #e8e8ed", borderRadius: "8px", padding: "4px 10px", fontSize: "13px", cursor: "pointer" }}>dn</button>
                <button onClick={function() { removeFile(i); }} style={{ background: "white", border: "1px solid #fca5a5", borderRadius: "8px", padding: "4px 10px", fontSize: "13px", cursor: "pointer", color: "#dc2626" }}>rm</button>
              </div>
            );
          })}
        </div>
      )}

      {error && <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "16px" }}>{error}</p>}
      {done && <p style={{ color: "#16a34a", fontSize: "15px", fontWeight: "600", marginBottom: "16px" }}>Merged PDF downloaded successfully.</p>}

      <button onClick={merge} disabled={merging || files.length < 2} style={{ background: files.length >= 2 ? "#0071e3" : "#d2d2d7", color: "white", border: "none", borderRadius: "12px", padding: "16px 28px", fontSize: "16px", fontWeight: "700", cursor: files.length >= 2 ? "pointer" : "not-allowed", width: "100%", marginBottom: "10px" }}>
        {merging ? "Merging..." : "Merge and Download PDF"}
      </button>

      {files.length > 0 && (
        <button onClick={function() { document.getElementById("merge-input").click(); }} style={{ background: "#f5f5f7", color: "#1d1d1f", border: "1px solid #e8e8ed", borderRadius: "12px", padding: "12px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", width: "100%" }}>
          Add More Files
        </button>
      )}
    </div>
  );
}