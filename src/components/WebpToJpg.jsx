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

  return (
    <div style={{ fontFamily: "inherit" }}>
      {!images.length ? (
        <div
          onDrop={handleDrop}
          onDragOver={function(e) { e.preventDefault(); }}
          onClick={function() { document.getElementById("webp-input").click(); }}
          style={{ border: "2px dashed #d2d2d7", borderRadius: "16px", padding: "48px 24px", textAlign: "center", cursor: "pointer", background: "#f5f5f7" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🖼️</div>
          <p style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px" }}>Drop WebP images here</p>
          <p style={{ fontSize: "14px", color: "#6e6e73", marginBottom: "20px" }}>or click to browse. Multiple files supported.</p>
          <input id="webp-input" type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: "none" }} />
          <button style={{ background: "#0071e3", color: "white", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>Choose Images</button>
        </div>
  ) : (
        <div>
          <div style={{ background: "#f5f5f7", borderRadius: "14px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>{images.length} image{images.length > 1 ? "s" : ""} selected</p>
            <p style={{ fontSize: "13px", color: "#6e6e73" }}>{images.map(function(f) { return f.name; }).join(", ")}</p>
          </div>
          {!converted.length ? (
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={convert} disabled={converting} style={{ background: "#0071e3", color: "white", border: "none", borderRadius: "12px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", flex: "1" }}>
                {converting ? "Converting..." : "Convert to JPG"}
              </button>
              <button onClick={function() { setImages([]); }} style={{ background: "#f5f5f7", color: "#1d1d1f", border: "1px solid #e8e8ed", borderRadius: "12px", padding: "14px 20px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                Clear
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                {converted.map(function(item, i) {
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f5f5f7", borderRadius: "12px", padding: "14px 16px", gap: "12px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "500", flex: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                      <button onClick={function() { download(item); }} style={{ background: "#0071e3", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer", flexShrink: "0" }}>Download</button>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {converted.length > 1 && (
                  <button onClick={downloadAll} style={{ background: "#0071e3", color: "white", border: "none", borderRadius: "12px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", flex: "1" }}>
                    Download All
                  </button>
                )}
                <button onClick={function() { setImages([]); setConverted([]); }} style={{ background: "#f5f5f7", color: "#1d1d1f", border: "1px solid #e8e8ed", borderRadius: "12px", padding: "14px 20px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                  Convert More
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}