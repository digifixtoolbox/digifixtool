import { useState, useRef, useEffect } from "react";
import SaveAsDialog from "./SaveAsDialog";

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.jpg', { type: 'image/jpeg' })] }); }
  catch(e) { return false; }
})();

export default function ImageCropper() {
  const [image, setImage] = useState(null);
  const [cropping, setCropping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [cropBox, setCropBox] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [croppedUrl, setCroppedUrl] = useState(null);
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [saveAsName, setSaveAsName] = useState(null);

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

  function doCrop() {
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
    setCroppedUrl(canvas.toDataURL("image/jpeg", 0.92));
  }

  function handleSave() {
    if (!croppedUrl) return;
    var a = document.createElement("a");
    a.href = croppedUrl;
    a.download = "cropped.jpg"; a.click();
  }

  async function handleSaveAs() {
    if (!croppedUrl) return;
    var filename = "cropped.jpg";
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var blob = await fetch(croppedUrl).then(function(r) { return r.blob(); });
        var handle = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: "JPEG Image", accept: { "image/jpeg": [".jpg"] } }] });
        var writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch(e) { if (e.name === "AbortError") return; }
    }
    setSaveAsName(filename);
  }

  function doSaveAs(filename) {
    var a = document.createElement("a"); a.href = croppedUrl; a.download = filename; a.click();
    setSaveAsName(null);
  }

  function reset() { setImage(null); setCropBox(null); setCroppedUrl(null); }

  var saveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var shareBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var resetBtn = { background: "transparent", color: "var(--reset-btn-text)", border: "1.5px solid var(--reset-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };

  async function handleShare() {
    if (!croppedUrl) return;
    var blob = await fetch(croppedUrl).then(function(r) { return r.blob(); });
    var file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'PixMidas' }); }
      catch(err) { if (err.name !== 'AbortError') { handleSave(); } }
    } else { handleSave(); }
  }

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32 }}>
      {!image ? (
        <div
          onDrop={handleDrop}
          onDragOver={function(e) { e.preventDefault(); }}
          style={{ border: "2px dashed var(--border)", borderRadius: "16px", padding: "48px 24px", textAlign: "center", cursor: "pointer", background: "var(--surface-2)" }}
          onClick={function() { document.getElementById("crop-input").click(); }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}><i className="ti ti-crop" style={{color:'#30A46C'}}></i></div>
          <p style={{ fontSize: "17px", fontWeight: "600", marginBottom: "8px", color: "var(--text)" }}>Drop an image here</p>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>or click to browse</p>
          <input id="crop-input" type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          <button style={{ background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "12px 24px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>Choose Image</button>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "12px", fontWeight: "500" }}>Draw a box on the image to select the crop area</p>
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
          <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={doCrop} disabled={!cropBox || cropBox.w < 5} style={{ ...saveBtn, opacity: (!cropBox || cropBox.w < 5) ? 0.5 : 1, cursor: (!cropBox || cropBox.w < 5) ? "not-allowed" : "pointer" }}>
              Crop
            </button>
            <button onClick={handleSave} disabled={!croppedUrl} style={{ ...saveBtn, opacity: croppedUrl ? 1 : 0.5, cursor: croppedUrl ? "pointer" : "not-allowed" }}>Save</button>
            <button onClick={handleSaveAs} disabled={!croppedUrl} style={{ ...saveAsBtn, opacity: croppedUrl ? 1 : 0.5, cursor: croppedUrl ? "pointer" : "not-allowed" }}>Save As...</button>
            {supportsFileShare && croppedUrl && <button onClick={handleShare} style={shareBtn}><i className="ti ti-share" /> Share</button>}
            <button onClick={reset} style={resetBtn}>Reset</button>
          </div>
        </div>
      )}
      {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doSaveAs} onCancel={function() { setSaveAsName(null); }} />}
    </div>
  );
}
