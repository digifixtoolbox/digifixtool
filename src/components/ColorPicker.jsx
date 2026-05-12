import { useState } from "react";

function hexToRgb(hex) {
  var r = parseInt(hex.slice(1,3),16);
  var g = parseInt(hex.slice(3,5),16);
  var b = parseInt(hex.slice(5,7),16);
  return { r: r, g: g, b: b };
}

function rgbToHsl(r,g,b) {
  r/=255; g/=255; b/=255;
  var max=Math.max(r,g,b), min=Math.min(r,g,b);
  var h,s,l=(max+min)/2;
  if(max===min){ h=0; s=0; }
  else {
    var d=max-min;
    s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){
      case r: h=(g-b)/d+(g<b?6:0); break;
      case g: h=(b-r)/d+2; break;
      default: h=(r-g)/d+4; break;
    }
    h/=6;
  }
  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
}

export default function ColorPicker() {
  const [hex, setHex] = useState("#0071e3");
  const [copied, setCopied] = useState("");

  var rgb = hexToRgb(hex);
  var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  var formats = [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")" },
    { label: "HSL", value: "hsl(" + hsl.h + ", " + hsl.s + "%, " + hsl.l + "%)" },
  ];

  function copy(val) {
    navigator.clipboard.writeText(val).then(function() {
      setCopied(val);
      setTimeout(function() { setCopied(""); }, 2000);
    });
  }

  return (
    <div style={{ fontFamily: "inherit" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
        <div style={{ width: "100%", height: "200px", borderRadius: "20px", background: hex, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "16px", background: "#f5f5f7", borderRadius: "14px", padding: "16px 20px", width: "100%", boxSizing: "border-box" }}>
          <input type="color" value={hex} onChange={function(e) { setHex(e.target.value); }} style={{ width: "56px", height: "56px", borderRadius: "12px", border: "none", cursor: "pointer", padding: "0" }} />
          <div>
            <p style={{ fontSize: "13px", color: "#6e6e73", marginBottom: "4px", fontWeight: "500" }}>Selected color</p>
            <p style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "0.05em" }}>{hex.toUpperCase()}</p>
          </div>
        </div>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
          {formats.map(function(f) {
            return (
              <div key={f.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f5f5f7", borderRadius: "12px", padding: "14px 16px", gap: "12px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#6e6e73", minWidth: "36px" }}>{f.label}</span>
                <span style={{ fontSize: "15px", fontWeight: "600", flex: "1" }}>{f.value}</span>
                <button onClick={function() { copy(f.value); }} style={{ background: copied === f.value ? "#16a34a" : "#0071e3", color: "white", border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer", flexShrink: "0" }}>
                  {copied === f.value ? "Copied!" : "Copy"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}