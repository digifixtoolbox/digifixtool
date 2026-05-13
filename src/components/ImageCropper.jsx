import { useState, useRef, useEffect } from "react";

export default function ImageCropper() {
  const [image, setImage] = useState(null);
  const [cropping, setCropping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [cropBox, setCropBox] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  function handleFile(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) { setImage(ev.target.result); setCropBox(null); };
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) { setImage(ev.target.result); setCropBox(null); };
    reader.readAsDataURL(file);
  }

  function getPos(e, el) {
    var rect = el.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.max(0, Math.min(clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(clientY - rect.top, rect.height))
    };
  }

  function onMouseDown(e) {
    e.preventDefault();
    var pos = getPos(e, containerRef.current);
    setStartX(pos.x);
    setStartY(pos.y);
    setCropBox({ x: pos.x, y: pos.y, w: 0, h: 0 });
    setIsDragging(true);
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    var pos = getPos(e, containerRef.current);
    setCropBox({
      x: Math.min(pos.x, startX),
      y: Math.min(pos.y, startY),
      w: Math.abs(pos.x - startX),
      h: Math.abs(pos.y - startY)
    });
  }

  function onMouseUp() {
    setIsDragging(false);
  }

  function crop() {
    if (!cropBox || cropBox.w < 5 || cropBox.h < 5) return;
    var img = imgRef.current;
    var container = containerRef.current;
    var scaleX = img.naturalWidth / container.offsetWidth;
    var scaleY = img.naturalHeight / container.offsetHeight;
    var canvas = canvasRef.current;
    canvas.width = cropBox.w * scaleX;
    canvas.height = cropBox.h * scaleY;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, cropBox.x * scaleX, cropBox.y * scaleY, cropBox.w * scaleX, cropBox.h * scaleY, 0, 0, canvas.width, canvas.height);
    var link = document.createElement("a");
    link.download = "cropped.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }

  return (
    <div style={{ fontFamily: "inherit" }}>
      {!image ? (
        <div
          onDrop={handleDrop}
          onDragOver={function(e) { e.preventDefault(); }}
          style={{ border: "2px dashed #d2d2d7", borderRadius: "16px", padding: "48px 24px", textAlign: "center", cursor: "pointer", background: "#f5f5f7" }}
          onClick={function() { document.getElementById("crop-input").click(); }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✂️</div>
          <p style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px" }}>Drop an image here</p>
          <p style={{ fontSize: "14px", color: "#6e6e73", marginBottom: "20px" }}>or click to browse</p>
          <input id="crop-input" type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          <button style={{ background: "#0071e3", color: "white", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>Choose Image</button>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: "14px", color: "#6e6e73", marginBottom: "12px", fontWeight: "500" }}>Draw a box on the image to select the crop area</p>
          <div
            ref={containerRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onMouseDown}
            onTouchMove={onMouseMove}
            onTouchEnd={onMouseUp}
            style={{ position: "relative", display: "inline-block", cursor: "crosshair", userSelect: "none", width: "100%", borderRadius: "12px", overflow: "hidden" }}
          >
            <img ref={imgRef} src={image} alt="crop" style={{ width: "100%", display: "block" }} />
            {cropBox && cropBox.w > 0 && (
              <div style={{
                position: "absolute",
                left: cropBox.x + "px",
                top: cropBox.y + "px",
                width: cropBox.w + "px",
                height: cropBox.h + "px",
                border: "2px solid #0071e3",
                background: "rgba(0,113,227,0.1)",
                pointerEvents: "none"
              }} />
            )}
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
            <button onClick={crop} disabled={!cropBox || cropBox.w < 5} style={{ background: "#0071e3", color: "white", border: "none", borderRadius: "12px", padding: "14px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", flex: "1" }}>
              Download Cropped Image
            </button>
            <button onClick={function() { setImage(null); setCropBox(null); }} style={{ background: "#f5f5f7", color: "#1d1d1f", border: "1px solid #e8e8ed", borderRadius: "12px", padding: "14px 20px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
              New Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}