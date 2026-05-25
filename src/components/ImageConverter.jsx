import { useRef, useState } from "react";
import SaveAsDialog from "./SaveAsDialog";

var supportsFileShare = (function() {
  try { return typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare && navigator.canShare({ files: [new File([], 't.jpg', { type: 'image/jpeg' })] }); }
  catch(e) { return false; }
})();

export default function ImageConverter() {
  const fileInputRef = useRef(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [convertedSize, setConvertedSize] = useState(null);
  const [mode, setMode] = useState("to-jpg");
  const [quality, setQuality] = useState(0.92);
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
    setConvertedUrl(null);
    setOriginalPreview(URL.createObjectURL(file));
  };

  const convert = async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    const bmp = await createImageBitmap(originalFile);
    const c = document.createElement("canvas");
    c.width = bmp.width;
    c.height = bmp.height;
    const ctx = c.getContext("2d");
    if (mode === "to-png") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, c.width, c.height);
    }
    ctx.drawImage(bmp, 0, 0);
    const mimeType = mode === "to-jpg" ? "image/jpeg" : "image/png";
    const q = mode === "to-jpg" ? quality : undefined;
    c.toBlob((blob) => {
      setConvertedUrl(URL.createObjectURL(blob));
      setConvertedSize(blob.size);
      setIsProcessing(false);
    }, mimeType, q);
  };

  const reset = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setConvertedUrl(null);
    setConvertedSize(null);
  };

  const ext = mode === "to-jpg" ? ".jpg" : ".png";
  const dlName = originalFile
    ? originalFile.name.replace(/\.[^/.]+$/, "") + "-converted" + ext
    : "converted" + ext;

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
    var a = document.createElement("a"); a.href = convertedUrl; a.download = filename; a.click();
    setSaveAsName(null);
  }

  var saveBtn = { background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var saveAsBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var shareBtn = { background: "transparent", color: "var(--outline-btn-color)", border: "1.5px solid var(--outline-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var resetBtn = { background: "transparent", color: "var(--reset-btn-text)", border: "1.5px solid var(--reset-btn-color)", borderRadius: "24px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  var btnRow = { display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px", justifyContent: "center" };

  async function handleShare() {
    if (!convertedUrl) return;
    var blob = await fetch(convertedUrl).then(function(r) { return r.blob(); });
    var file = new File([blob], dlName, { type: blob.type });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'PixMidas' }); }
      catch(err) { if (err.name !== 'AbortError') { var a=document.createElement('a'); a.href=convertedUrl; a.download=dlName; a.click(); } }
    } else { var a=document.createElement('a'); a.href=convertedUrl; a.download=dlName; a.click(); }
  }

  return (
    <div style={{background:"var(--surface)",border:"1px solid var(--border-light)",borderRadius:20,padding:32}}>
      <div style={{display:"flex",gap:8,marginBottom:24,background:"var(--surface-2)",borderRadius:12,padding:4}}>
        <button onClick={() => { setMode("to-jpg"); setConvertedUrl(null); }}
          style={{flex:1,padding:"10px 16px",borderRadius:10,border:"none",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",
          background:mode==="to-jpg"?"var(--surface)":"transparent",color:mode==="to-jpg"?"var(--text)":"var(--text-muted)",
          boxShadow:mode==="to-jpg"?"0 1px 3px rgba(0,0,0,0.1)":"none"}}>
          PNG / WebP → JPG
        </button>
        <button onClick={() => { setMode("to-png"); setConvertedUrl(null); }}
          style={{flex:1,padding:"10px 16px",borderRadius:10,border:"none",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",
          background:mode==="to-png"?"var(--surface)":"transparent",color:mode==="to-png"?"var(--text)":"var(--text-muted)",
          boxShadow:mode==="to-png"?"0 1px 3px rgba(0,0,0,0.1)":"none"}}>
          JPG / WebP → PNG
        </button>
      </div>

      {!originalFile ? (
        <div style={{border:"2px dashed var(--border)",borderRadius:16,padding:"56px 24px",textAlign:"center",cursor:"pointer",background:"var(--surface-2)"}}
          onClick={() => fileInputRef.current.click()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => e.preventDefault()}>
          <div style={{fontSize:48,marginBottom:16}}><i className="ti ti-arrows-exchange" style={{color:'#0090FF'}}></i></div>
          <h2 style={{fontSize:24,fontWeight:800,marginBottom:8,color:"var(--text)"}}>Drop your image here</h2>
          <p style={{fontSize:15,color:"var(--text-muted)",marginBottom:8}}>
            {mode === "to-jpg" ? "Upload a PNG or WebP to convert to JPG" : "Upload a JPG or WebP to convert to PNG"}
          </p>
          <p style={{fontSize:12,color:"var(--text-muted)",marginBottom:24}}>Maximum file size: 50MB</p>
          <button style={{background:"var(--upload-btn-bg)",color:"var(--upload-btn-color)",border:"none",borderRadius:999,padding:"14px 28px",fontWeight:600,fontSize:15,cursor:"pointer"}}>
            Choose Image
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={(e) => handleFile(e.target.files[0])} />
          {error && <p style={{color:"#dc2626",marginTop:"16px",fontSize:"14px"}}>{error}</p>}
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          {mode === "to-jpg" && (
            <div>
              <label style={{fontSize:13,fontWeight:600,color:"var(--text)",display:"block",marginBottom:8}}>
                JPG Quality: <strong>{Math.round(quality * 100)}%</strong>
              </label>
              <input type="range" min="0.5" max="1" step="0.05" value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                style={{width:"100%",accentColor:"#2563eb"}} />
            </div>
          )}
          <button onClick={convert} disabled={isProcessing}
            style={{background:"var(--upload-btn-bg)",color:"var(--upload-btn-color)",border:"none",borderRadius:999,padding:"14px 28px",fontWeight:600,fontSize:15,cursor:"pointer",alignSelf:"flex-start"}}>
            {isProcessing ? "Converting..." : `Convert to ${mode === "to-jpg" ? "JPG" : "PNG"}`}
          </button>
          {convertedUrl && (
            <>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))",gap:16}}>
                <div style={{border:"1px solid var(--border-light)",borderRadius:14,padding:16,background:"var(--surface-2)"}}>
                  <p style={{fontSize:13,fontWeight:600,color:"var(--text-muted)",marginBottom:10}}>ORIGINAL</p>
                  <img src={originalPreview} alt="Original" style={{width:"100%",height:220,objectFit:"contain",borderRadius:10,background:"var(--surface-3)"}} />
                  <p style={{marginTop:10,fontWeight:700,fontSize:14,color:"var(--text)"}}>{fmt(originalFile.size)}</p>
                </div>
                <div style={{border:"1px solid var(--border-light)",borderRadius:14,padding:16,background:"var(--surface-2)"}}>
                  <p style={{fontSize:13,fontWeight:600,color:"var(--text-muted)",marginBottom:10}}>CONVERTED</p>
                  <img src={convertedUrl} alt="Converted" style={{width:"100%",height:220,objectFit:"contain",borderRadius:10,background:"var(--surface-3)"}} />
                  <p style={{marginTop:10,fontWeight:700,fontSize:14,color:"var(--text)"}}>{fmt(convertedSize)}</p>
                </div>
              </div>
              <div style={btnRow}>
                <button onClick={() => { var a=document.createElement("a"); a.href=convertedUrl; a.download=dlName; a.click(); }} style={saveBtn}>Save</button>
                <button onClick={() => handleSaveAs(convertedUrl, dlName)} style={saveAsBtn}>Save As...</button>
                {supportsFileShare && <button onClick={handleShare} style={shareBtn}><i className="ti ti-share" /> Share</button>}
                <button onClick={reset} style={resetBtn}>Reset</button>
              </div>
            </>
          )}
          {!convertedUrl && (
            <button onClick={reset}
              style={{background:"var(--surface)",border:"1px solid var(--border-light)",padding:"14px 24px",borderRadius:999,fontWeight:600,fontSize:15,cursor:"pointer",color:"#374151",alignSelf:"flex-start"}}>
              Start again
            </button>
          )}
        </div>
      )}
      <div style={{marginTop:20,fontSize:13,textAlign:"center"}}>
        <a href="/report-bug" style={{color:"var(--text-muted)",textDecoration:"none"}}>🐞 Found an issue with this tool? Report a bug →</a>
      </div>
      {saveAsName !== null && <SaveAsDialog defaultName={saveAsName} onSave={doSaveAs} onCancel={function() { setSaveAsName(null); }} />}
    </div>
  );
}