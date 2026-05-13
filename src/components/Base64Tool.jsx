import { useState } from "react";

export default function Base64Tool() {
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function process(text, currentMode) {
    setError("");
    setCopied(false);
    if (!text) { setOutput(""); return; }
    if (currentMode === "encode") {
      try {
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } catch (e) {
        setError("Encoding failed. Check your input.");
        setOutput("");
      }
    } else {
      try {
        setOutput(decodeURIComponent(escape(atob(text.trim()))));
      } catch (e) {
        setError("Invalid Base64 input. Make sure the text is properly encoded.");
        setOutput("");
      }
    }
  }

  function handleInput(e) {
    const val = e.target.value;
    setInput(val);
    process(val, mode);
  }

  function switchMode(newMode) {
    setMode(newMode);
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  }

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(function () {
      setCopied(true);
      setTimeout(function () { setCopied(false); }, 2000);
    });
  }

  function clear() {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  }

  function pasteOutput() {
    const newMode = mode === "encode" ? "decode" : "encode";
    const text = output;
    setMode(newMode);
    setInput(text);
    setOutput("");
    setError("");
    setCopied(false);
    process(text, newMode);
  }

  return (
    <div style={{ fontFamily: "inherit" }}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["encode", "decode"].map(function (m) {
          const active = mode === m;
          return (
            <button
              key={m}
              onClick={function () { switchMode(m); }}
              style={{
                padding: "10px 24px",
                borderRadius: "999px",
                border: "1px solid",
                borderColor: active ? "#0071e3" : "#e8e8ed",
                background: active ? "#0071e3" : "#f5f5f7",
                color: active ? "white" : "#1d1d1f",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              {m === "encode" ? "Encode" : "Decode"}
            </button>
          );
        })}
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <label style={{ fontSize: "14px", fontWeight: "600", color: "#86868b" }}>
            {mode === "encode" ? "Plain text input" : "Base64 input"}
          </label>
          {input && (
            <button onClick={clear} style={{ fontSize: "13px", color: "#86868b", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "0" }}>
              Clear
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={handleInput}
          placeholder={mode === "encode" ? "Type or paste text to encode..." : "Paste Base64 string to decode..."}
          style={{
            width: "100%",
            minHeight: "140px",
            borderRadius: "14px",
            border: "1px solid #e8e8ed",
            padding: "16px",
            fontSize: "15px",
            fontFamily: mode === "decode" ? "monospace" : "inherit",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            lineHeight: "1.6",
          }}
        />
      </div>

      {error && (
        <div style={{ background: "#fff2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "14px 16px", marginBottom: "16px", color: "#dc2626", fontSize: "14px", fontWeight: "500" }}>
          {error}
        </div>
      )}

      {output && (
        <div style={{ background: "#f5f5f7", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#86868b" }}>
              {mode === "encode" ? "Base64 output" : "Decoded text"}
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={pasteOutput}
                style={{ fontSize: "13px", color: "#0071e3", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "0", fontWeight: "600" }}
              >
                {mode === "encode" ? "→ Decode this" : "→ Re-encode"}
              </button>
            </div>
          </div>
          <p style={{ fontSize: "15px", lineHeight: "1.65", wordBreak: "break-all", marginBottom: "14px", fontFamily: mode === "encode" ? "monospace" : "inherit", color: "#1d1d1f" }}>
            {output}
          </p>
          <button
            onClick={copy}
            style={{
              background: copied ? "#16a34a" : "#0071e3",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s",
            }}
          >
            {copied ? "Copied!" : "Copy result"}
          </button>
        </div>
      )}

      {input && !output && !error && (
        <div style={{ background: "#f5f5f7", borderRadius: "14px", padding: "20px", color: "#86868b", fontSize: "15px", textAlign: "center" }}>
          Processing…
        </div>
      )}
    </div>
  );
}
