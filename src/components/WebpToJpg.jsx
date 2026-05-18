import { useState, useRef } from "react";

export default function WebpToJpg() {
  const [images, setImages] = useState([]);
  const [converted, setConverted] = useState([]);
  const [converting, setConverting] = useState(false);
  const canvasRef = useRef(null);

  function handleFiles(e) {
    var files = Array.from(e.target.files);
    setImages(files);
    setConverted([]);
  }

  function handleDrop(e) {
    e.preventDefault();
    var files = Array.from(e.dataTransfer.files).filter(function(f) { return f.type.startsWith("image/"); });
    setImages(files);
    setConverted([]);
  }

  function convert() {
    if (!images.length) return;
    setConverting(true);
    var results = [];
    var remaining = images.length;
    images.forEach(function(file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          var jpgUrl = canvas.toDataURL("image/jpeg", 0.92);
          var name = file.name.replace(/\.webp$/i, "").replace(/\.[^.]+$/, "") + ".jpg";
          results.push({ name: name, url: jpgUrl });
          remaining--;
          if (remaining === 0) {
            setConverted(results);
            setConverting(false);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function download(item) {
    var link = document.createElement("a");
    link.href = item.url;
    link.download = item.name;
    link.click();
  }

  function downloadAll() {
    converted.forEach(function(item) { download(item); });
  }

  async function handleItemSaveAs(item) {
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var handle = await window.showSaveFilePicker({ suggestedName: item.name, types: [{ description: "File", accept: { "image/jpeg": [".jpg"] } }] });
        var blob = await fetch(item.url).then(function(r) { return r.blob(); });
        var writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch(e) {
        if (e.name === "AbortError") return;
      }
    }
    download(item);
  }

  function reset() { setImages([]); setConverted([]); }

  var saveBtn = { background: "#0071e3", color: "white", border: "none", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "#0071e3", border: "1.5px solid #0071e3", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };
  var resetBtn = { background: "var(--surface-2)", color: "var(--text-muted)", border: "none", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "600", cursor: "pointer", minHeight: "44px", fontFamily: "inherit" };
  var itemSaveBtn = { background: "#0071e3", color: "white", border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer", flexShrink: "0" };
  var itemSaveAsBtn = { background: "transparent", color: "#0071e3", border: "1px solid #0071e3", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer", flexShrink: "0" };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 }}>
      {!images.length ? (
        <div
          onDrop={handleDrop}
          onDragOver={function(e) { e.preventDefault(); }}
          onClick={function() { document.getElementById("webp-input").click(); }}
          style={{ border: "2px dashed var(--border)", borderRadius: "16px", padding: "48px 24px", textAlign: "center", cursor: "pointer", background: "var(--surface-2)" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}><i className="ti ti-photo" style={{color:'#0090FF'}}></i></div>
          <p style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>Drop WebP images here</p>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>or click to browse. Multiple files supported.</p>
          <input id="webp-input" type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: "none" }} />
          <button style={{ background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "12px 24px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>Choose Images</button>
        </div>
      ) : (
        <div>
          <div style={{ background: "var(--surface-2)", borderRadius: "14px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px", color: "var(--text)" }}>{images.length} image{images.length > 1 ? "s" : ""} selected</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{images.map(function(f) { return f.name; }).join(", ")}</p>
          </div>
          {!converted.length ? (
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={convert} disabled={converting} style={{ background: "#0071e3", color: "white", border: "none", borderRadius: "99px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", flex: "1", minHeight: "44px", fontFamily: "inherit" }}>
                {converting ? "Converting..." : "Convert to JPG"}
              </button>
              <button onClick={function() { setImages([]); }} style={{ background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border-light)", borderRadius: "99px", padding: "14px 20px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", minHeight: "44px" }}>
                Clear
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                {converted.map(function(item, i) {
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-2)", borderRadius: "12px", padding: "14px 16px", gap: "12px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "500", flex: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)" }}>{item.name}</span>
                      <button onClick={function() { download(item); }} style={itemSaveBtn}>Save</button>
                      <button onClick={function() { handleItemSaveAs(item); }} style={itemSaveAsBtn}>Save As...</button>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button onClick={downloadAll} style={saveBtn}>Save All</button>
                <button onClick={reset} style={resetBtn}>Reset</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
