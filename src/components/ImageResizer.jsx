import { useRef, useState } from "react";
import SaveAsDialog from "./SaveAsDialog";

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.jpg', { type: 'image/jpeg' })] }); }
  catch(e) { return false; }
})();

export default function ImageResizer() {
  const fileInputRef = useRef(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [originalDims, setOriginalDims] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [keepAspect, setKeepAspect] = useState(true);
  const [resizedUrl, setResizedUrl] = useState(null);
  const [resizedSize, setResizedSize] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveAsName, setSaveAsName] = useState(null);
  const [error, setError] = useState("");

  const fmt = (b) => b < 1048576 ? (b/1024).toFixed(1)+" KB" : (b/1048576).toFixed(2)+" MB";

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 50 * 1024 * 1024) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 50MB. Pro version coming soon with higher limits.`);
      return;
    }
    setError("");
    setOriginalFile(file);
    setResizedUrl(null);
    const preview = URL.createObjectURL(file);
    setOriginalPreview(preview);
    const img = new Image();
    img.onload = () => {
      setOriginalDims({ w: img.width, h: img.height });
      setWidth(String(img.width));
      setHeight(String(img.height));
    };
    img.src = preview;
  };

  const handleW = (e) => {
    const v = e.target.value;
    setWidth(v);
    if (keepAspect && originalDims && v)
      setHeight(String(Math.round(v * originalDims.h / originalDims.w)));
  };

  const handleH = (e) => {
    const v = e.target.value;
    setHeight(v);
    if (keepAspect && originalDims && v)
      setWidth(String(Math.round(v * originalDims.w / originalDims.h)));
  };

  const resizeImage = async () => {
    if (!originalFile || !width || !height) return;
    setIsProcessing(true);
    const bmp = await createImageBitmap(originalFile);
    const c = document.createElement("canvas");
    c.width = Number(width);
    c.height = Number(height);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    c.toBlob((blob) => {
      setResizedUrl(URL.createObjectURL(blob));
      setResizedSize(blob.size);
      setIsProcessing(false);
    }, "image/jpeg", 0.92);
  };

  const reset = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setOriginalDims(null);
    setWidth("");
    setHeight("");
    setResizedUrl(null);
    setResizedSize(null);
  };

  const dlName = originalFile
    ? originalFile.name.replace(/\.[^/.]+$/, "") + "-" + width + "x" + height + ".jpg"
    : "resized.jpg";

  async function handleSaveAs(url, filename) {
    if (typeof window.showSaveFilePicker === "function") {
      try {
        var blob = await fetch(url).then(function(r) { return r.blob(); });
        var handle = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: "Image", accept: { [blob.type]: [] } }] });
        var writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch(e) { if (e.name === "AbortError") return; }
    }
    setSaveAsName(filename);
  }

  function doSaveAs(filename) {
    var a = document.createElement("a"); a.href = resizedUrl; a.download = filename; a.click();
    setSaveAsName(null);
  }

  var saveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var shareBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var resetBtn = { background: "transparent", color: "var(--reset-btn-text)", border: "1.5px solid var(--reset-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var btnRow = { display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px", justifyContent: "center" };

  async function handleShare() {
    if (!resizedUrl) return;
    var blob = await fetch(resizedUrl).then(function(r) { return r.blob(); });
    var file = new File([blob], dlName, { type: blob.type });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'PixMidas' }); }
      catch(err) { if (err.name !== 'AbortError') { var a=document.createElement('a'); a.href=resizedUrl; a.download=dlName; a.click(); } }
    } else { var a=document.createElement('a'); a.href=resizedUrl; a.download=dlName; a.click(); }
  }

  return (
    <div style={{background:"var(--surface)",border:"1px solid var(--border-light)",borderRadius:20,padding:32}}>
      {!originalFile ? (
        <div
          style={{border:"2px dashed var(--border)",borderRadius:16,padding:"56px 24px",textAlign:"center",cursor:"pointer",background:"var(--surface-2)"}}
          onClick={() => fileInputRef.current.click()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => e.preventDefault()}
        >
          <div style={{fontSize:48,marginBottom:16}}><i className="ti ti-resize" style={{color:'#0090FF'}}></i></div>
          <h2 style={{fontSize:24,fontWeight:800,marginBottom:8,color:"var(--text)"}}>Drop your image here</h2>
          <p style={{fontSize:15,color:"var(--text-muted)",marginBottom:8}}>JPG, PNG or WebP. Resize to any dimension.</p>
          <p style={{fontSize:12,color:"var(--text-muted)",marginBottom:24}}>Maximum file size: 50MB</p>
          {error && <p style={{color:"#dc2626",fontSize:"14px",marginBottom:"16px"}}>{error}</p>}
          <button style={{background:"var(--upload-btn-bg)",color:"var(--upload-btn-color)",border:"none",borderRadius:999,padding:"14px 28px",fontWeight:600,fontSize:15,cursor:"pointer"}}>Choose Image</button>
          <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          {originalDims && (
            <p style={{fontSize:14,color:"var(--text-muted)"}}>
              Original: <strong>{originalDims.w} x {originalDims.h}px</strong>
            </p>
          )}
          <div style={{display:"flex",alignItems:"flex-end",gap:16,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:6,flex:1,minWidth:120}}>
              <label style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>Width (px)</label>
              <input type="number" value={width} onChange={handleW} min="1"
                style={{border:"1px solid var(--border-light)",borderRadius:10,padding:"10px 14px",fontSize:16,fontWeight:600,outline:"none",width:"100%",background:"var(--surface-2)",color:"var(--text)"}} />
            </div>
            <div style={{paddingBottom:8,fontSize:22,cursor:"pointer",color:keepAspect?"#2563eb":"#9ca3af"}}
              onClick={() => setKeepAspect(!keepAspect)}>
              {keepAspect ? "🔒" : "🔓"}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,flex:1,minWidth:120}}>
              <label style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>Height (px)</label>
              <input type="number" value={height} onChange={handleH} min="1"
                style={{border:"1px solid var(--border-light)",borderRadius:10,padding:"10px 14px",fontSize:16,fontWeight:600,outline:"none",width:"100%",background:"var(--surface-2)",color:"var(--text)"}} />
            </div>
          </div>
          <button onClick={resizeImage} disabled={isProcessing}
            style={{background:"var(--upload-btn-bg)",color:"var(--upload-btn-color)",border:"none",borderRadius:999,padding:"14px 28px",fontWeight:600,fontSize:15,cursor:"pointer",alignSelf:"center"}}>
            {isProcessing ? "Resizing..." : "Resize Image"}
          </button>
          {resizedUrl && (
            <div style={btnRow}>
              <button onClick={() => { var a=document.createElement("a"); a.href=resizedUrl; a.download=dlName; a.click(); }} style={saveBtn}>Save</button>
              <button onClick={() => handleSaveAs(resizedUrl, dlName)} style={saveAsBtn}>Save As...</button>
              {supportsFileShare && <button onClick={handleShare} style={shareBtn}><i className="ti ti-share" /> Share</button>}
              <button onClick={reset} style={resetBtn}>Reset</button>
            </div>
          )}
          {!resizedUrl && (
            <button onClick={reset}
              style={{background:"transparent",border:"1.5px solid var(--reset-btn-color)",padding:"14px 24px",borderRadius:999,fontWeight:600,fontSize:15,cursor:"pointer",color:"var(--reset-btn-text)",alignSelf:"center"}}>
              Start again
            </button>
          )}
        </div>
      )}
      {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doSaveAs} onCancel={function() { setSaveAsName(null); }} />}
    </div>
  );
}