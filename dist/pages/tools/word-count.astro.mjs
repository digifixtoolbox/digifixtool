import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Dw9fQcLJ.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_Dj2wG1aG.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
/* empty css                                         */
export { renderers } from '../../renderers.mjs';

function WordCounter() {
  const [text, setText] = useState("");
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = text.trim() === "" ? 0 : text.split(/\n+/).filter((p) => p.trim().length > 0).length;
  const readTime = Math.max(1, Math.ceil(words / 200));
  const clear = () => setText("");
  return /* @__PURE__ */ jsxs("div", { style: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: 32 }, children: [
    /* @__PURE__ */ jsx(
      "textarea",
      {
        value: text,
        onChange: (e) => setText(e.target.value),
        placeholder: "Start typing or paste your text here...",
        style: { width: "100%", minHeight: 280, border: "1px solid #d1d5db", borderRadius: 14, padding: 20, fontSize: 16, fontFamily: "inherit", color: "#111827", resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }
      }
    ),
    /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginTop: 20 }, children: [
      { label: "Words", value: words },
      { label: "Characters", value: chars },
      { label: "No Spaces", value: charsNoSpaces },
      { label: "Sentences", value: sentences },
      { label: "Paragraphs", value: paragraphs },
      { label: "Read Time", value: readTime + " min" }
    ].map((stat) => /* @__PURE__ */ jsxs("div", { style: { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontSize: 28, fontWeight: 800, color: "#111827", margin: 0 }, children: stat.value }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "#6b7280", margin: 0, marginTop: 4 }, children: stat.label })
    ] }, stat.label)) }),
    text && /* @__PURE__ */ jsx(
      "button",
      {
        onClick: clear,
        style: { marginTop: 20, background: "#fff", border: "1px solid #e5e7eb", padding: "12px 24px", borderRadius: 999, fontWeight: 600, fontSize: 14, cursor: "pointer", color: "#374151", fontFamily: "inherit" },
        children: "Clear text"
      }
    )
  ] });
}

const $$WordCount = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Word Counter Online Free", "description": "Count words, characters, sentences and paragraphs instantly. Free online word counter. No login, no upload needed.", "data-astro-cid-4w7q2hdo": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="tool-page" data-astro-cid-4w7q2hdo> <div class="tool-header" data-astro-cid-4w7q2hdo> <a href="/" class="back-link" data-astro-cid-4w7q2hdo>← All tools</a> <h1 class="tool-title" data-astro-cid-4w7q2hdo>Word Counter</h1> <p class="tool-subtitle" data-astro-cid-4w7q2hdo>Count words, characters, sentences and paragraphs instantly as you type.</p> </div> <div class="ad-slot ad-slot-horizontal" data-astro-cid-4w7q2hdo>Advertisement</div> ${renderComponent($$result2, "WordCounter", WordCounter, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/urbansound/Downloads/digifixtool/src/components/WordCounter.jsx", "client:component-export": "default", "data-astro-cid-4w7q2hdo": true })} <div class="ad-slot ad-slot-horizontal" style="margin-top: 32px;" data-astro-cid-4w7q2hdo>Advertisement</div> <section class="seo-content" data-astro-cid-4w7q2hdo> <h2 data-astro-cid-4w7q2hdo>How to count words online</h2> <p data-astro-cid-4w7q2hdo>Just paste or type your text in the box above. Word count, character count and all stats update instantly.</p> <h2 data-astro-cid-4w7q2hdo>What is read time?</h2> <p data-astro-cid-4w7q2hdo>Read time is calculated based on an average reading speed of 200 words per minute.</p> <h2 data-astro-cid-4w7q2hdo>Is my text saved?</h2> <p data-astro-cid-4w7q2hdo>No. Everything stays in your browser. Nothing is sent to any server.</p> </section> </div> ` })} `;
}, "/Users/urbansound/Downloads/digifixtool/src/pages/tools/word-count.astro", void 0);

const $$file = "/Users/urbansound/Downloads/digifixtool/src/pages/tools/word-count.astro";
const $$url = "/tools/word-count";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$WordCount,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
