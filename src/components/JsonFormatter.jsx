import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [valid, setValid] = useState(null); // null | true | false

  function parse(text) {
    try {
      return { ok: true, data: JSON.parse(text) };
    } catch (e) {
      return { ok: false, msg: e.message };
    }
  }

  function format() {
    if (!input.trim()) return;
    const result = parse(input);
    if (!result.ok) { setError(result.msg); setOutput(""); setValid(false); return; }
    setOutput(JSON.stringify(result.data, null, indent));
    setError("");
    setValid(true);
    setMode("format");
    setCopied(false);
  }

  function minify() {
    if (!input.trim()) return;
    const result = parse(input);
    if (!result.ok) { setError(result.msg); setOutput(""); setValid(false); return; }
    setOutput(JSON.stringify(result.data));
    setError("");
    setValid(true);
    setMode("minify");
    setCopied(false);
  }

  function validate() {
    if (!input.trim()) { setError("Nothing to validate. Paste some JSON first."); return; }
    const result = parse(input);
    if (result.ok) {
      setError("");
      setValid(true);
      setMode("validate");
    } else {
      setError(result.msg);
      setValid(false);
      setMode("validate");
    }
    setOutput("");
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
    setValid(null);
    setMode("");
    setCopied(false);
  }

  const lineCount = output ? output.split("\n").length : 0;
  const charCount = output ? output.length : 0;

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32, fontFamily: "inherit" }}>
      <style>{`.json-input-area::placeholder { opacity: 0.38; }`}</style>
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <label style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>JSON input</label>
          {input && (
            <button onClick={clear} style={{ fontSize: "13px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "4px 0" }}>
              Clear
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={function (e) { setInput(e.target.value); setOutput(""); setError(""); setValid(null); setMode(""); }}
          placeholder={'{\n  "name": "example",\n  "value": 42\n}'}
          className="json-input-area"
          spellCheck={false}
          style={{
            width: "100%",
            minHeight: "180px",
            borderRadius: "14px",
            border: error ? "1.5px solid #fca5a5" : "1px solid var(--border-light)",
            padding: "14px 16px",
            fontSize: "13px",
            fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            lineHeight: "1.65",
            background: "var(--surface-2)",
            color: "var(--text)",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-muted)" }}>Indent:</span>
        {[2, 4].map(function (n) {
          const active = indent === n;
          return (
            <button
              key={n}
              onClick={function () { setIndent(n); }}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: active ? "var(--upload-btn-bg)" : "var(--border-light)",
                background: active ? "var(--upload-btn-bg)" : "var(--surface-2)",
                color: active ? "white" : "var(--text)",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "inherit",
                minHeight: "36px",
              }}
            >
              {n} spaces
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        {[
          { label: "Format", fn: format, primary: true },
          { label: "Minify", fn: minify, primary: false },
          { label: "Validate", fn: validate, primary: false },
        ].map(function (btn) {
          return (
            <button
              key={btn.label}
              onClick={btn.fn}
              style={{
                background: btn.primary ? "var(--upload-btn-bg)" : "var(--surface-2)",
                color: btn.primary ? "var(--upload-btn-color)" : "var(--text)",
                border: btn.primary ? "none" : "1px solid var(--border-light)",
                borderRadius: "12px",
                padding: "14px 10px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "inherit",
                minHeight: "48px",
                transition: "background 0.15s",
              }}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div style={{ background: "#fff2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "12px 16px", marginBottom: "14px", color: "#dc2626", fontSize: "13px", fontWeight: "500", fontFamily: "ui-monospace, monospace" }}>
          ✗ {error}
        </div>
      )}

      {valid === true && mode === "validate" && !output && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "12px 16px", marginBottom: "14px", color: "#16a34a", fontSize: "14px", fontWeight: "700" }}>
          ✓ Valid JSON
        </div>
      )}

      {output && (
        <div style={{ background: "var(--surface-2)", borderRadius: "14px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>
                {mode === "minify" ? "Minified output" : "Formatted output"}
              </span>
              <span style={{ background: "#d1fae5", color: "#065f46", fontSize: "12px", fontWeight: "700", padding: "2px 8px", borderRadius: "999px" }}>
                ✓ Valid JSON
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {lineCount.toLocaleString()} lines · {charCount.toLocaleString()} chars
            </span>
          </div>
          <pre
            style={{
              fontSize: "13px",
              lineHeight: "1.65",
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
              fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace",
              color: "var(--text)",
              margin: 0,
              marginBottom: "14px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {output}
          </pre>
          <button
            onClick={copy}
            style={{
              background: copied ? "#16a34a" : "var(--upload-btn-bg)",
              color: "var(--upload-btn-color)",
              border: "none",
              borderRadius: "99px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "inherit",
              minHeight: "44px",
              transition: "background 0.15s",
            }}
          >
            {copied ? "Copied!" : "Copy output"}
          </button>
        </div>
      )}
    </div>
  );
}
