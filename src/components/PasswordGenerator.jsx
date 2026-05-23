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
    var array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (var i = 0; i < length; i++) {
      result += chars.charAt(array[i] % chars.length);
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
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32, fontFamily: "inherit" }}>
      <div style={{ background: "var(--surface-2)", borderRadius: "16px", padding: "20px", marginBottom: "20px", minHeight: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <span style={{ fontSize: "18px", fontWeight: "600", color: password ? "var(--text)" : "var(--text-muted)", wordBreak: "break-all", flex: "1" }}>
          {password || "Click Generate to create a password"}
        </span>
        <button onClick={copy} style={{ background: copied ? "#16a34a" : "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "10px 18px", fontSize: "14px", fontWeight: "600", cursor: "pointer", flexShrink: "0", whiteSpace: "nowrap", fontFamily: "inherit" }}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div style={{ background: "var(--surface-2)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <label style={{ fontWeight: "600", fontSize: "15px", color: "var(--text)" }}>Password length</label>
            <span style={{ fontWeight: "700", fontSize: "15px", color: "var(--upload-btn-bg)" }}>{length}</span>
          </div>
          <input type="range" min="6" max="64" value={length} onChange={function(e) { setLength(Number(e.target.value)); }} style={{ width: "100%", accentColor: "var(--upload-btn-bg)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
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
              <label key={opt.label} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", background: "var(--surface)", borderRadius: "12px", padding: "14px", border: "1px solid var(--border-light)" }}>
                <input type="checkbox" checked={opt.value} onChange={function(e) { opt.set(e.target.checked); }} style={{ width: "18px", height: "18px", accentColor: "var(--upload-btn-bg)", cursor: "pointer" }} />
                <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--text)" }}>{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>
      <button onClick={generate} style={{ width: "100%", background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "18px", fontSize: "17px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", minHeight: "56px" }}>
        Generate Password
      </button>
    </div>
  );
}
