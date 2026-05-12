import { useRef, useState } from "react";

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

  const fmt = (b) => b < 1048576 ? (b/1024).toFixed(1)+" KB" : (b/1048576).toFixed(2)+" MB";

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
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

  return (
    <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:20,padding:32}}>
      {!originalFile ? (
        <div
          style={{border:"2px dashed #d1d5db",borderRadius:16,padding:"56px 24px",textAlign:"center",cursor:"pointer",background:"#fafaf9"}}
          onClick={() => fileInputRef.current.click()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => e.preventDefault()}
        >
          <div style={{fontSize:48,marginBottom:16}}>📐</div>
          <h2 style={{fontSize:24,fontWeight:800,marginBottom:8,color:"#111827"}}>Drop your image here</h2>
          <p style={{fontSize:15,color:"#6b7280",marginBottom:24}}>JPG, PNG or WebP. Resize to any dimension.</p>
          <button style={{background:"#111827",color:"#fff",border:"none",borderRadius:999,padding:"14px 28px",fontWeight:700,fontSize:15,cursor:"pointer"}}>Choose Image</button>
          <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          {originalDims && (
            <p style={{fontSize:14,color:"#6b7280"}}>
              Original: <strong>{originalDims.w} x {originalDims.h}px</strong>
            </p>
          )}
          <div style={{display:"flex",alignItems:"flex-end",gap:16,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:6,flex:1,minWidth:120}}>
              <label style={{fontSize:13,fontWeight:600,color:"#374151"}}>Width (px)</label>
              <input type="number" value={width} onChange={handleW} min="1"
                style={{border:"1px solid #d1d5db",borderRadius:10,padding:"10px 14px",fontSize:16,fontWeight:600,outline:"none",width:"100%"}} />
            </div>
            <div style={{paddingBottom:8,fontSize:22,cursor:"pointer",color:keepAspect?"#2563eb":"#9ca3af"}}
              onClick={() => setKeepAspect(!keepAspect)}>
              {keepAspect ? "🔒" : "🔓"}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,flex:1,minWidth:120}}>
              <label style={{fontSize:13,fontWeight:600,color:"#374151"}}>Height (px)</label>
              <input type="number" value={height} onChange={handleH} min="1"
                style={{border:"1px solid #d1d5db",borderRadius:10,padding:"10px 14px",fontSize:16,fontWeight:600,outline:"none",width:"100%"}} />
            </div>
          </div>
          <button onClick={resizeImage} disabled={isProcessing}
            style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:999,padding:"14px 28px",fontWeight:700,fontSize:15,cursor:"pointer",alignSelf:"flex-start"}}>
            {isProcessing ? "Resizing..." : "Resize Image"}
          </button>
          {resizedUrl && (
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <a href={resizedUrl} download={dlName}
                style={{background:"#2563eb",color:"#fff",textDecoration:"none",padding:"14px 28px",borderRadius:999,fontWeight:700,fontSize:15}}>
                Download {width}x{height}px
              </a>
              <button onClick={reset}
                style={{background:"#fff",border:"1px solid #e5e7eb",padding:"14px 24px",borderRadius:999,fontWeight:600,fontSize:15,cursor:"pointer",color:"#374151"}}>
                Start again
              </button>
            </div>
          )}
          {!resizedUrl && (
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