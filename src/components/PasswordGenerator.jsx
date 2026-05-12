import { useState } from "react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lower = "abcdefghijklmnopqrstuvwxyz";
    var numbers = "0123456789";
    var symbols = "!@#$%^&*()_+-=[]{}";
    var chars = "";
    if (includeUpper) chars += upper;
    if (includeLower) chars += lower;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
    if (!chars) { setPassword("Select at least one option"); return; }
    var result = "";
    for (var i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    setCopied(false);
  }

  function copy() {
    if (!password) return;
    navigator.clipboard.writeText(password).then(function() {
      setCopied(true);
      setTimeout(function() { setCopied(false); }, 2000);
    });
  }

  return (
    <div style={{ fontFamily: "inherit" }}>
      <div style={{ background: "#f5f5f7", borderRadius: "16px", padding: "20px", marginBottom: "20px", minHeight: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <span style={{ fontSize: "18px", fontWeight: "600", color: password ? "#1d1d1f" : "#86868b", wordBreak: "break-all", flex: "1" }}>
          {password || "Click Generate to create a password"}
        </span>
        <button onClick={copy} style={{ background: copied ? "#16a34a" : "#0071e3", color: "white", border: "none", borderRadius: "10px", padding: "10px 18px", fontSize: "14px", fontWeight: "600", cursor: "pointer", flexShrink: "0", whiteSpace: "nowrap" }}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div style={{ background: "#f5f5f7", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <label style={{ fontWeight: "600", fontSize: "15px" }}>Password length</label>
            <span style={{ fontWeight: "700", fontSize: "15px", color: "#0071e3" }}>{length}</span>
          </div>
          <input type="range" min="6" max="64" value={length} onChange={function(e) { setLength(Number(e.target.value)); }} style={{ width: "100%", accentColor: "#0071e3" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#86868b", marginTop: "4px" }}>
            <span>6</span><span>64</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { label: "Uppercase (A-Z)", value: includeUpper, set: setIncludeUpper },
            { label: "Lowercase (a-z)", value: includeLower, set: setIncludeLower },
            { label: "Numbers (0-9)", value: includeNumbers, set: setIncludeNumbers },
            { label: "Symbols (!@#...)", value: includeSymbols, set: setIncludeSymbols },
          ].map(function(opt) {
            return (
              <label key={opt.label} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", background: "white", borderRadius: "12px", padding: "14px", border: "1px solid #e8e8ed" }}>
                <input type="checkbox" checked={opt.value} onChange={function(e) { opt.set(e.target.checked); }} style={{ width: "18px", height: "18px", accentColor: "#0071e3", cursor: "pointer" }} />
                <span style={{ fontSize: "14px", fontWeight: "500" }}>{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>
      <button onClick={generate} style={{ width: "100%", background: "#0071e3", color: "white", border: "none", borderRadius: "14px", padding: "18px", fontSize: "17px", fontWeight: "700", cursor: "pointer" }}>
        Generate Password
      </button>
    </div>
  );
}