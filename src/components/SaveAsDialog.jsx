import { useState } from "react";

export default function SaveAsDialog({ defaultName, onSave, onCancel }) {
  const [name, setName] = useState(defaultName);

  function sanitize(n) {
    return n.replace(/[<>:"/\\|?*\x00-\x1f]/g, "").trim() || defaultName;
  }

  function handleConfirm() {
    var clean = sanitize(name);
    if (clean) onSave(clean);
  }

  function handleKey(e) {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") onCancel();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={onCancel}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px 28px 24px", width: "100%", maxWidth: "420px", boxShadow: "0 8px 40px rgba(0,0,0,0.22)" }}
        onClick={function(e) { e.stopPropagation(); }}>
        <p style={{ fontSize: "17px", fontWeight: "700", marginBottom: "16px", color: "var(--text)" }}>Save As</p>
        <input
          type="text"
          value={name}
          onChange={function(e) { setName(e.target.value); }}
          onKeyDown={handleKey}
          aria-label="File name"
          autoFocus
          style={{ width: "100%", padding: "12px 14px", border: "1px solid var(--border)", borderRadius: "10px", fontSize: "15px", fontFamily: "inherit", background: "var(--surface-2)", color: "var(--text)", outline: "none", boxSizing: "border-box", marginBottom: "20px" }}
        />
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ background: "transparent", color: "var(--text-muted)", border: "1.5px solid var(--border)", borderRadius: "99px", padding: "10px 22px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={handleConfirm} style={{ background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "10px 22px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>Save</button>
        </div>
      </div>
    </div>
  );
}
