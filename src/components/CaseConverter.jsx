import { useState } from "react";

const cases = [
  { label: "UPPERCASE", fn: function(t) { return t.toUpperCase(); } },
  { label: "lowercase", fn: function(t) { return t.toLowerCase(); } },
  { label: "Title Case", fn: function(t) { return t.replace(/\w\S*/g, function(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }); } },
  { label: "Sentence case", fn: function(t) { return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(); } },
  { label: "camelCase", fn: function(t) { return t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function(m, c) { return c.toUpperCase(); }); } },
  { label: "snake_case", fn: function(t) { return t.toLowerCase().replace(/\s+/g, "_"); } },
  { label: "kebab-case", fn: function(t) { return t.toLowerCase().replace(/\s+/g, "-"); } },
];

export default function CaseConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [active, setActive] = useState("");
  const [copied, setCopied] = useState(false);

  function convert(c) {
    setActive(c.label);
    setOutput(c.fn(input));
    setCopied(false);
  }

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(function() {
      setCopied(true);
      setTimeout(function() { setCopied(false); }, 2000);
    });
  }

  return (
    <div style={{ fontFamily: "inherit" }}>
      <textarea
        value={input}
        onChange={function(e) { setInput(e.target.value); setOutput(""); setActive(""); }}
        placeholder="Type or paste your text here..."
        style={{ width: "100%", minHeight: "140px", borderRadius: "14px", border: "1px solid #e8e8ed", padding: "16px", fontSize: "15px", fontFamily: "inherit", resize: "vertical", outline: "none", marginBottom: "16px", boxSizing: "border-box" }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px", marginBottom: "20px" }}>
        {cases.map(function(c) {
          return (
            <button key={c.label} onClick={function() { convert(c); }} style={{ padding: "12px 16px", borderRadius: "12px", border: "1px solid", borderColor: active === c.label ? "#0071e3" : "#e8e8ed", background: active === c.label ? "#0071e3" : "#f5f5f7", color: active === c.label ? "white" : "#1d1d1f", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
              {c.label}
            </button>
          );
        })}
      </div>
      {output && (
        <div style={{ background: "#f5f5f7", borderRadius: "14px", padding: "20px" }}>
          <p style={{ fontSize: "15px", lineHeight: "1.6", wordBreak: "break-word", marginBottom: "12px" }}>{output}</p>
          <button onClick={copy} style={{ background: copied ? "#16a34a" : "#0071e3", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
            {copied ? "Copied!" : "Copy result"}
          </button>
        </div>
      )}
    </div>
  );
}