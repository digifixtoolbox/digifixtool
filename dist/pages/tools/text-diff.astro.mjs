import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Dw9fQcLJ.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_Dj2wG1aG.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
/* empty css                                        */
export { renderers } from '../../renderers.mjs';

function TextDiff() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  const maxLines = Math.max(oldLines.length, newLines.length);
  return /* @__PURE__ */ jsxs("div", { className: "tool-box", children: [
    /* @__PURE__ */ jsxs("div", { className: "diff-grid", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { children: "Original Text" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: oldText,
            onChange: (e) => setOldText(e.target.value),
            placeholder: "Paste original text here..."
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { children: "New Text" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: newText,
            onChange: (e) => setNewText(e.target.value),
            placeholder: "Paste new text here..."
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "results", children: [
      /* @__PURE__ */ jsx("h3", { children: "Differences" }),
      Array.from({ length: maxLines }).map((_, index) => {
        const oldLine = oldLines[index] || "";
        const newLine = newLines[index] || "";
        const changed = oldLine !== newLine;
        return /* @__PURE__ */ jsxs("div", { className: changed ? "line changed" : "line", children: [
          /* @__PURE__ */ jsx("span", { className: "line-number", children: index + 1 }),
          /* @__PURE__ */ jsx("div", { children: changed ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("p", { className: "removed", children: [
              "- ",
              oldLine || "Empty line"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "added", children: [
              "+ ",
              newLine || "Empty line"
            ] })
          ] }) : /* @__PURE__ */ jsx("p", { children: oldLine }) })
        ] }, index);
      })
    ] })
  ] });
}

const $$TextDiff = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Text Difference Checker Online Free", "description": "Compare two texts and find the differences instantly. See added, removed and unchanged lines. Free, no login, works in your browser.", "data-astro-cid-ira24s7j": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="tool-page" data-astro-cid-ira24s7j> <div class="tool-header" data-astro-cid-ira24s7j> <a href="/" class="back-link" data-astro-cid-ira24s7j>← All tools</a> <h1 class="tool-title" data-astro-cid-ira24s7j>Text Difference Checker</h1> <p class="tool-subtitle" data-astro-cid-ira24s7j>Paste two texts and instantly see what changed. Added lines in green, removed in red.</p> </div> <div class="ad-slot ad-slot-horizontal" data-astro-cid-ira24s7j>Advertisement</div> ${renderComponent($$result2, "TextDiff", TextDiff, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/urbansound/Downloads/digifixtool/src/components/TextDiff.jsx", "client:component-export": "default", "data-astro-cid-ira24s7j": true })} <div class="ad-slot ad-slot-horizontal" style="margin-top: 32px;" data-astro-cid-ira24s7j>Advertisement</div> <section class="seo-content" data-astro-cid-ira24s7j> <h2 data-astro-cid-ira24s7j>How to compare two texts</h2> <p data-astro-cid-ira24s7j>Paste your original text on the left and the modified version on the right. Differences appear instantly.</p> <h2 data-astro-cid-ira24s7j>What does it show?</h2> <p data-astro-cid-ira24s7j>Added lines are highlighted in green, removed lines in red, and unchanged lines in white.</p> <h2 data-astro-cid-ira24s7j>Is it safe?</h2> <p data-astro-cid-ira24s7j>Your text never leaves your device. Everything runs locally in your browser.</p> </section> </div> ` })} `;
}, "/Users/urbansound/Downloads/digifixtool/src/pages/tools/text-diff.astro", void 0);

const $$file = "/Users/urbansound/Downloads/digifixtool/src/pages/tools/text-diff.astro";
const $$url = "/tools/text-diff";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TextDiff,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
