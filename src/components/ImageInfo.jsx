import { useRef, useState } from "react";
import { iconSvgs } from '../data/iconSvgs.js';

export default function ImageInfo() {
  const fileInputRef = useRef(null);
  const [info, setInfo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const fmt = (b) => b < 1048576 ? (b/1024).toFixed(1)+" KB" : (b/1048576).toFixed(2)+" MB";

  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

  const getAspectRatio = (w, h) => {
    const d = gcd(w, h);
    return `${w/d}:${h/d}`;
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 50 * 1024 * 1024) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 50MB. Pro version coming soon with higher limits.`);
      return;
    }
    setError("");
    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setInfo({
        name: file.name,
        format: file.type.replace("image/", "").toUpperCase(),
        size: fmt(file.size),
        width: img.width,
        height: img.height,
        aspectRatio: getAspectRatio(img.width, img.height),
        megapixels: ((img.width * img.height) / 1000000).toFixed(1),
        landscape: img.width > img.height ? "Landscape" : img.width < img.height ? "Portrait" : "Square",
      });
    };
    img.src = url;
  };

  const reset = () => {
    setInfo(null);
    setPreview(null);
  };

  const stats = info ? [
    { label: "Width", value: info.width + " px" },
    { label: "Height", value: info.height + " px" },
    { label: "File Size", value: info.size },
    { label: "Format", value: info.format },
    { label: "Aspect Ratio", value: info.aspectRatio },
    { label: "Megapixels", value: info.megapixels + " MP" },
    { label: "Orientation", value: info.landscape },
    { label: "File Name", value: info.name },
  ] : [];

  return (
    <div style={{background:"var(--surface)",border:"1px solid var(--border-light)",borderRadius:20,padding:32}}>
      {!info ? (
        <div
          style={{border:"2px dashed",borderColor:isDragging?"var(--upload-btn-bg)":"var(--border)",borderRadius:16,padding:"56px 24px",textAlign:"center",cursor:"pointer",background:isDragging?"var(--accent-light)":"var(--surface-2)",transition:"all 0.15s"}}
          onClick={() => fileInputRef.current.click()}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
        >
          <div style={{fontSize:48,marginBottom:16}}><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5B5BD6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: iconSvgs['info-circle'] }} /></div>
          <h2 style={{fontSize:24,fontWeight:800,marginBottom:8,color:"var(--text)"}}>Drop your image here</h2>
          <p style={{fontSize:15,color:"var(--text-muted)",marginBottom:8}}>Upload any image to see its dimensions and details.</p>
          <p style={{fontSize:12,color:"var(--text-muted)",marginBottom:24}}>Maximum file size: 50MB</p>
          <button style={{background:"var(--upload-btn-bg)",color:"var(--upload-btn-color)",border:"none",borderRadius:999,padding:"14px 28px",fontWeight:600,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>
            Choose Image
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={(e) => handleFile(e.target.files[0])} />
          {error && <p style={{color:"#dc2626",marginTop:"16px",fontSize:"14px"}}>{error}</p>}
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:24}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <img src={preview} alt="Preview" style={{width:"100%",maxHeight:280,objectFit:"contain",borderRadius:14,background:"var(--surface-3)",border:"1px solid var(--border-light)"}} />
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,alignContent:"start"}}>
              {stats.map((stat) => (
                <div key={stat.label} style={{background:"var(--surface-2)",border:"1px solid var(--border-light)",borderRadius:12,padding:"12px 16px"}}>
                  <p style={{fontSize:11,fontWeight:600,color:"var(--text-muted)",margin:0,textTransform:"uppercase",letterSpacing:"0.05em"}}>{stat.label}</p>
                  <p style={{fontSize:15,fontWeight:700,color:"var(--text)",margin:0,marginTop:4,wordBreak:"break-all"}}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={reset}
            style={{background:"var(--surface)",border:"1px solid var(--border-light)",padding:"12px 24px",borderRadius:999,fontWeight:600,fontSize:15,cursor:"pointer",color:"var(--text)",alignSelf:"flex-start",fontFamily:"inherit"}}>
            Check another image
          </button>
        </div>
      )}
    </div>
  );
}
