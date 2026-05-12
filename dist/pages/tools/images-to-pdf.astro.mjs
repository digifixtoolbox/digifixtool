import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Dw9fQcLJ.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_Dj2wG1aG.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
export { renderers } from '../../renderers.mjs';

function TextDiff() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const getDiff = () => {
    if (!text1 || !text2) return null;
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const result = [];
    const maxLen = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < maxLen; i++) {
      const l1 = lines1[i] ?? null;
      const l2 = lines2[i] ?? null;
      if (l1 === l2) {
        result.push({ type: "same", text: l1, line: i + 1 });
      } else if (l1 === null) {
        result.push({ type: "added", text: l2, line: i + 1 });
      } else if (l2 === null) {
        result.push({ type: "removed", text: l1, line: i + 1 });
      } else {
        result.push({ type: "removed", text: l1, line: i + 1 });
        result.push({ type: "added", text: l2, line: i + 1 });
      }
    }
    return result;
  };
  const diff = getDiff();
  const changes = diff ? diff.filter((d) => d.type !== "same").length : 0;
  return /* @__PURE__ */ jsxs("div", { style: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: 32 }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { style: { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }, children: "Original Text" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: text1,
            onChange: (e) => setText1(e.target.value),
            placeholder: "Paste your original text here...",
            style: { width: "100%", height: 220, border: "1px solid #d1d5db", borderRadius: 12, padding: "12px 16px", fontSize: 14, fontFamily: "monospace", color: "#111827", resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { style: { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }, children: "Modified Text" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: text2,
            onChange: (e) => setText2(e.target.value),
            placeholder: "Paste your modified text here...",
            style: { width: "100%", height: 220, border: "1px solid #d1d5db", borderRadius: 12, padding: "12px 16px", fontSize: 14, fontFamily: "monospace", color: "#111827", resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }
          }
        )
      ] })
    ] }),
    diff && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { background: "#dcfce7", border: "1px solid #86efac", borderRadius: 10, padding: "8px 16px", fontSize: 14, fontWeight: 600, color: "#166534" }, children: [
          "+ ",
          diff.filter((d) => d.type === "added").length,
          " added"
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 10, padding: "8px 16px", fontSize: 14, fontWeight: 600, color: "#991b1b" }, children: [
          "- ",
          diff.filter((d) => d.type === "removed").length,
          " removed"
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 16px", fontSize: 14, fontWeight: 600, color: "#374151" }, children: [
          diff.filter((d) => d.type === "same").length,
          " unchanged"
        ] })
      ] }),
      changes === 0 ? /* @__PURE__ */ jsx("div", { style: { background: "#dcfce7", border: "1px solid #86efac", borderRadius: 14, padding: 24, textAlign: "center" }, children: /* @__PURE__ */ jsx("p", { style: { fontSize: 16, fontWeight: 700, color: "#166534" }, children: "✓ No differences found. The texts are identical." }) }) : /* @__PURE__ */ jsx("div", { style: { border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", fontFamily: "monospace", fontSize: 13 }, children: diff.map((line, i) => /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        background: line.type === "added" ? "#f0fdf4" : line.type === "removed" ? "#fef2f2" : "#fff",
        borderBottom: "1px solid #f3f4f6"
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: 40,
          minWidth: 40,
          padding: "8px 12px",
          fontSize: 11,
          color: "#9ca3af",
          background: line.type === "added" ? "#dcfce7" : line.type === "removed" ? "#fee2e2" : "#f9fafb",
          textAlign: "center",
          userSelect: "none"
        }, children: line.line }),
        /* @__PURE__ */ jsx("div", { style: {
          width: 24,
          minWidth: 24,
          padding: "8px 4px",
          textAlign: "center",
          fontWeight: 700,
          color: line.type === "added" ? "#16a34a" : line.type === "removed" ? "#dc2626" : "#d1d5db"
        }, children: line.type === "added" ? "+" : line.type === "removed" ? "-" : " " }),
        /* @__PURE__ */ jsx("div", { style: { padding: "8px 12px", flex: 1, color: line.type === "added" ? "#166534" : line.type === "removed" ? "#991b1b" : "#374151", whiteSpace: "pre-wrap", wordBreak: "break-all" }, children: line.text })
      ] }, i)) })
    ] }),
    !text1 && !text2 && /* @__PURE__ */ jsx("div", { style: { background: "#f9fafb", border: "1px dashed #d1d5db", borderRadius: 14, padding: 32, textAlign: "center", color: "#9ca3af" }, children: /* @__PURE__ */ jsx("p", { style: { fontSize: 15 }, children: "Paste two texts above to compare them" }) }),
    /* @__PURE__ */ jsx("div", { style: { marginTop: 24, fontSize: 13, color: "#6b7280", textAlign: "center" }, children: "🔒 Your text never leaves your device." })
  ] });
}

const $$ImagesToPdf = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Images to PDF - PixMidas", "description": "Convert multiple images into one PDF file directly in your browser." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-slate-950 text-white px-6 py-12"> <section class="max-w-5xl mx-auto"> <a href="/" class="text-sm text-slate-400 hover:text-white">← Back to tools</a> <div class="mt-8 mb-10"> <p class="text-sm uppercase tracking-[0.25em] text-yellow-400 mb-3">PDF Tool</p> <h1 class="text-4xl md:text-5xl font-bold mb-4">Images to PDF</h1> <p class="text-slate-300 text-lg max-w-2xl">
Upload JPG, PNG or WebP images and convert them into a single PDF file. Everything runs inside your browser.
</p> </div> ${renderComponent($$result2, "ImagesToPDF", TextDiff, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/urbansound/Downloads/digifixtool/src/components/ImagesToPDF.jsx", "client:component-export": "default" })} </section> </main> ` })}`;
}, "/Users/urbansound/Downloads/digifixtool/src/pages/tools/images-to-pdf.astro", void 0);

const $$file = "/Users/urbansound/Downloads/digifixtool/src/pages/tools/images-to-pdf.astro";
const $$url = "/tools/images-to-pdf";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ImagesToPdf,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
