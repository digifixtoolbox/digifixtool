import { useRef, useState } from "react";

export default function ImageConverter() {
  const fileInputRef = useRef(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [convertedSize, setConvertedSize] = useState(null);
  const [mode, setMode] = useState("to-jpg");
  const [quality, setQuality] = useState(0.92);
  const [isProcessing, setIsProcessing] = useState(false);

  const fmt = (b) => b < 1048576 ? (b/1024).toFixed(1)+" KB" : (b/1048576).toFixed(2)+" MB";

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
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

  return (
    <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:20,padding:32}}>
      <div style={{display:"flex",gap:8,marginBottom:24,background:"#f3f4f6",borderRadius:12,padding:4}}>
        <button onClick={() => { setMode("to-jpg"); setConvertedUrl(null); }}
          style={{flex:1,padding:"10px 16px",borderRadius:10,border:"none",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",
          background:mode==="to-jpg"?"#fff":"transparent",color:mode==="to-jpg"?"#111827":"#6b7280",
          boxShadow:mode==="to-jpg"?"0 1px 3px rgba(0,0,0,0.1)":"none"}}>
          PNG / WebP → JPG
        </button>
        <button onClick={() => { setMode("to-png"); setConvertedUrl(null); }}
          style={{flex:1,padding:"10px 16px",borderRadius:10,border:"none",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",
          background:mode==="to-png"?"#fff":"transparent",color:mode==="to-png"?"#111827":"#6b7280",
          boxShadow:mode==="to-png"?"0 1px 3px rgba(0,0,0,0.1)":"none"}}>
          JPG / WebP → PNG
        </button>
      </div>

      {!originalFile ? (
        <div style={{border:"2px dashed #d1d5db",borderRadius:16,padding:"56px 24px",textAlign:"center",cursor:"pointer",background:"#fafaf9"}}
          onClick={() => fileInputRef.current.click()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => e.preventDefault()}>
          <div style={{fontSize:48,marginBottom:16}}>🔄</div>
          <h2 style={{fontSize:24,fontWeight:800,marginBottom:8,color:"#111827"}}>Drop your image here</h2>
          <p style={{fontSize:15,color:"#6b7280",marginBottom:24}}>
            {mode === "to-jpg" ? "Upload a PNG or WebP to convert to JPG" : "Upload a JPG or WebP to convert to PNG"}
          </p>
          <button style={{background:"#111827",color:"#fff",border:"none",borderRadius:999,padding:"14px 28px",fontWeight:700,fontSize:15,cursor:"pointer"}}>
            Choose Image
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          {mode === "to-jpg" && (
            <div>
              <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:8}}>
                JPG Quality: <strong>{Math.round(quality * 100)}%</strong>
              </label>
              <input type="range" min="0.5" max="1" step="0.05" value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                style={{width:"100%",accentColor:"#2563eb"}} />
            </div>
          )}
          <button onClick={convert} disabled={isProcessing}
            style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:999,padding:"14px 28px",fontWeight:700,fontSize:15,cursor:"pointer",alignSelf:"flex-start"}}>
            {isProcessing ? "Converting..." : `Convert to ${mode === "to-jpg" ? "JPG" : "PNG"}`}
          </button>
          {convertedUrl && (
            <>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))",gap:16}}>
                <div style={{border:"1px solid #e5e7eb",borderRadius:14,padding:16,background:"#fafaf9"}}>
                  <p style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:10}}>ORIGINAL</p>
                  <img src={originalPreview} alt="Original" style={{width:"100%",height:220,objectFit:"contain",borderRadius:10,background:"#f3f4f6"}} />
                  <p style={{marginTop:10,fontWeight:700,fontSize:14}}>{fmt(originalFile.size)}</p>
                </div>
                <div style={{border:"1px solid #e5e7eb",borderRadius:14,padding:16,background:"#fafaf9"}}>
                  <p style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:10}}>CONVERTED</p>
                  <img src={convertedUrl} alt="Converted" style={{width:"100%",height:220,objectFit:"contain",borderRadius:10,background:"#f3f4f6"}} />
                  <p style={{marginTop:10,fontWeight:700,fontSize:14}}>{fmt(convertedSize)}</p>
                </div>
              </div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                <a href={convertedUrl} download={dlName}
                  style={{background:"#2563eb",color:"#fff",textDecoration:"none",padding:"14px 28px",borderRadius:999,fontWeight:700,fontSize:15}}>
                  ⬇ Download {mode === "to-jpg" ? "JPG" : "PNG"}
                </a>
                <button onClick={reset}
                  style={{background:"#fff",border:"1px solid #e5e7eb",padding:"14px 24px",borderRadius:999,fontWeight:600,fontSize:15,cursor:"pointer",color:"#374151"}}>
                  Start again
                </button>
              </div>
            </>
          )}
          {!convertedUrl && (
            <button onClick={reset}
              style={{background:"#fff",border:"1px solid #e5e7eb",padding:"14px 24px",borderRadius:999,fontWeight:600,fontSize:15,cursor:"pointer",color:"#374151",alignSelf:"flex-start"}}>
              Start again
            </button>
          )}
        </div>
      )}
      <div style={{marginTop:20,fontSize:13,color:"#6b7280",textAlign:"center"}}>
        🔒 Your files never leave your device.
      </div>
    </div>
  );
}