import { useState, useEffect, useRef } from "react";

export default function QRGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [qrUrl, setQrUrl] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!text.trim()) { setQrUrl(""); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const encoded = encodeURIComponent(text.trim());
      const fgClean = fg.replace("#", "");
      const bgClean = bg.replace("#", "");
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&color=${fgClean}&bgcolor=${bgClean}&qzone=2`);
    }, 400);
  }, [text, size, fg, bg]);

  const download = () => {
    const a = document.createElement("a");
    a.href = qrUrl + "&format=png";
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:20,padding:32}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32}}>

        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          <div>
            <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:8}}>
              Text or URL
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter a URL, text, email, phone number..."
              style={{width:"100%",height:120,border:"1px solid #d1d5db",borderRadius:12,padding:"12px 16px",fontSize:15,fontFamily:"inherit",color:"#111827",resize:"vertical",outline:"none",lineHeight:1.5,boxSizing:"border-box"}}
            />
          </div>

          <div>
            <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:8}}>
              Size: <strong>{size}x{size}px</strong>
            </label>
            <input type="range" min="128" max="512" step="64" value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              style={{width:"100%",accentColor:"#2563eb"}} />
          </div>

          <div style={{display:"flex",gap:16}}>
            <div style={{flex:1}}>
              <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:8}}>QR Color</label>
              <div style={{display:"flex",alignItems:"center",gap:10,border:"1px solid #d1d5db",borderRadius:10,padding:"8px 12px"}}>
                <input type="color" value={fg} onChange={(e) => setFg(e.target.value)}
                  style={{width:32,height:32,border:"none",borderRadius:6,cursor:"pointer",background:"none"}} />
                <span style={{fontSize:14,color:"#374151",fontWeight:500}}>{fg}</span>
              </div>
            </div>
            <div style={{flex:1}}>
              <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:8}}>Background</label>
              <div style={{display:"flex",alignItems:"center",gap:10,border:"1px solid #d1d5db",borderRadius:10,padding:"8px 12px"}}>
                <input type="color" value={bg} onChange={(e) => setBg(e.target.value)}
                  style={{width:32,height:32,border:"none",borderRadius:6,cursor:"pointer",background:"none"}} />
                <span style={{fontSize:14,color:"#374151",fontWeight:500}}>{bg}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}>
          {qrUrl ? (
            <>
              <img src={qrUrl} alt="QR Code" style={{width:size > 256 ? 256 : size,height:size > 256 ? 256 : size,borderRadius:12,border:"1px solid #e5e7eb"}} />
              <button onClick={download}
                style={{background:"#2563eb",color:"#fff",border:"none",borderRadius:999,padding:"14px 28px",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>
                ⬇ Download QR Code
              </button>
            </>
          ) : (
            <div style={{width:200,height:200,background:"#f3f4f6",borderRadius:12,border:"2px dashed #d1d5db",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <p style={{fontSize:14,color:"#9ca3af",textAlign:"center",padding:20}}>Your QR code will appear here</p>
            </div>
          )}
        </div>

      </div>
      <div style={{marginTop:24,fontSize:13,color:"#6b7280",textAlign:"center"}}>
        🔒 Your data is never stored. QR codes are generated instantly.
      </div>
    </div>
  );
}