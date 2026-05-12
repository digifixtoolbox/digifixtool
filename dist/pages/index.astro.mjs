import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_Dw9fQcLJ.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_Dj2wG1aG.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const banners = [
  { icon: "🗜️", text: "Need a smaller image file?", cta: "Try Image Compressor", href: "/tools/compress-image/", bg: "#e8f4fd", color: "#0071e3" },
  { icon: "📐", text: "Need to resize a photo?", cta: "Try Image Resizer", href: "/tools/resize-image/", bg: "#e8f4fd", color: "#0071e3" },
  { icon: "🔄", text: "Need to convert PNG to JPG?", cta: "Try Image Converter", href: "/tools/convert-image/", bg: "#e8f4fd", color: "#0071e3" },
  { icon: "🔍", text: "Need to check image dimensions?", cta: "Try Image Info", href: "/tools/image-info/", bg: "#e8f4fd", color: "#0071e3" },
  { icon: "📄", text: "Need to send photos as PDF?", cta: "Try Images to PDF", href: "/tools/images-to-pdf/", bg: "#fef3e8", color: "#f56300" },
  { icon: "📱", text: "What size is an Instagram post?", cta: "Check Social Media Sizes", href: "/tools/social-sizes/", bg: "#f0e8fd", color: "#7c3aed" },
  { icon: "📝", text: "Need to count words in text?", cta: "Try Word Counter", href: "/tools/word-count/", bg: "#e8fdf0", color: "#16a34a" },
  { icon: "🔎", text: "Need to compare two texts?", cta: "Try Text Diff Checker", href: "/tools/text-diff/", bg: "#e8fdf0", color: "#16a34a" },
  { icon: "🔳", text: "Need a QR code for your link?", cta: "Try QR Generator", href: "/tools/qr-code/", bg: "#fdf0e8", color: "#d97706" }
];
function PromoBanner() {
  const [idx, setIdx] = useState(0);
  useEffect(function() {
    setIdx(Math.floor(Math.random() * banners.length));
  }, []);
  var b = banners[idx];
  return /* @__PURE__ */ jsxs("a", { href: b.href, style: { display: "flex", flexDirection: "row", alignItems: "center", gap: "14px", background: b.bg, borderRadius: "14px", padding: "14px 20px", textDecoration: "none", width: "100%" }, children: [
    /* @__PURE__ */ jsx("span", { style: { fontSize: "40px", lineHeight: "1", flexShrink: "0" }, children: b.icon }),
    /* @__PURE__ */ jsxs("span", { style: { display: "flex", flexDirection: "column", gap: "2px" }, children: [
      /* @__PURE__ */ jsx("span", { style: { fontSize: "15px", fontWeight: "600", color: "#1d1d1f", lineHeight: "1.2", display: "block" }, children: b.text }),
      /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: "700", color: b.color, lineHeight: "1.2", display: "block" }, children: b.cta })
    ] })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const tools = [
    { slug: "compress-image", name: "Image Compressor", description: "Make image files smaller in seconds.", icon: "\u{1F5DC}\uFE0F", bg: "#e8f4fd", category: "Image", popular: true },
    { slug: "resize-image", name: "Image Resizer", description: "Resize photos to exact dimensions.", icon: "\u{1F4D0}", bg: "#e8f4fd", category: "Image", popular: true },
    { slug: "convert-image", name: "Image Converter", description: "Convert PNG, JPG and WebP files.", icon: "\u{1F504}", bg: "#e8f4fd", category: "Image", popular: false },
    { slug: "image-info", name: "Image Info", description: "Check size, format and dimensions.", icon: "\u{1F50D}", bg: "#e8f4fd", category: "Image", popular: false },
    { slug: "images-to-pdf", name: "Images to PDF", description: "Turn photos into one PDF file.", icon: "\u{1F4C4}", bg: "#fef3e8", category: "PDF", popular: false },
    { slug: "social-sizes", name: "Social Media Sizes", description: "Find correct sizes for social posts.", icon: "\u{1F4F1}", bg: "#f0e8fd", category: "Social", popular: false },
    { slug: "word-count", name: "Word Counter", description: "Count words and characters instantly.", icon: "\u{1F4DD}", bg: "#e8fdf0", category: "Text", popular: false },
    { slug: "text-diff", name: "Text Difference Checker", description: "Compare two texts and spot changes.", icon: "\u{1F50E}", bg: "#e8fdf0", category: "Text", popular: false },
    { slug: "qr-code", name: "QR Code Generator", description: "Create QR codes for links or text.", icon: "\u{1F533}", bg: "#fdf0e8", category: "Utility", popular: false }
  ];
  const categories = ["All", "Image", "PDF", "Text", "Social", "Utility"];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "PixMidas | Free Online Tools", "description": "Fast, free browser-based tools for images, text, PDFs and everyday files. No login needed. Many tools run privately in your browser.", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="hero" data-astro-cid-j7pv25f6> <p class="eyebrow" data-astro-cid-j7pv25f6>PixMidas Tools</p> <h1 class="hero-title" data-astro-cid-j7pv25f6>Simple tools<br data-astro-cid-j7pv25f6>that just work.</h1> <p class="hero-sub" data-astro-cid-j7pv25f6>
Compress, resize, convert and fix everyday files.
      No login. No confusion.
</p> <div class="quick-links" data-astro-cid-j7pv25f6> <a href="/tools/compress-image/" data-astro-cid-j7pv25f6>Compress Image</a> <span data-astro-cid-j7pv25f6>•</span> <a href="/tools/resize-image/" data-astro-cid-j7pv25f6>Resize Image</a> <span data-astro-cid-j7pv25f6>•</span> <a href="/tools/convert-image/" data-astro-cid-j7pv25f6>Convert Image</a> </div> <a href="#all-tools" class="hero-btn" data-astro-cid-j7pv25f6>See all tools ↓</a> </section> <div class="promo-wrap" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "PromoBanner", PromoBanner, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/urbansound/Downloads/digifixtool/src/components/PromoBanner.jsx", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </div> <section id="all-tools" class="tools-section" data-astro-cid-j7pv25f6> <div class="section-head" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>All tools</h2> <p data-astro-cid-j7pv25f6>Fast browser tools for small digital problems.</p> </div> <div class="filter-bar" data-astro-cid-j7pv25f6> ${categories.map((cat) => renderTemplate`<button class="filter-btn"${addAttribute(cat, "data-category")}${addAttribute(cat === "All" ? "true" : "false", "aria-pressed")} data-astro-cid-j7pv25f6> ${cat} </button>`)} </div> <div class="tools-grid" data-astro-cid-j7pv25f6> ${tools.map((tool) => renderTemplate`<a class="tool-card"${addAttribute(tool.category, "data-category")}${addAttribute(tool.slug, "data-slug")} data-astro-cid-j7pv25f6> <div class="tool-icon-wrap"${addAttribute(tool.bg, "data-bg")} data-astro-cid-j7pv25f6> <span class="tool-icon" data-astro-cid-j7pv25f6>${tool.icon}</span> </div> <div class="tool-body" data-astro-cid-j7pv25f6> <div class="tool-name-row" data-astro-cid-j7pv25f6> <h3 class="tool-name" data-astro-cid-j7pv25f6>${tool.name}</h3> ${tool.popular && renderTemplate`<span class="badge" data-astro-cid-j7pv25f6>Popular</span>`} </div> <p class="tool-desc" data-astro-cid-j7pv25f6>${tool.description}</p> </div> <span class="tool-arrow" data-astro-cid-j7pv25f6>→</span> </a>`)} </div> <p class="no-results" id="no-results" style="display:none" data-astro-cid-j7pv25f6>
No tools in this category yet. Check back soon.
</p> </section> <div class="promo-wrap" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "PromoBanner", PromoBanner, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/urbansound/Downloads/digifixtool/src/components/PromoBanner.jsx", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </div> <section class="trust-section" data-astro-cid-j7pv25f6> <div class="trust-grid" data-astro-cid-j7pv25f6> <div class="trust-item" data-astro-cid-j7pv25f6> <span class="trust-icon" data-astro-cid-j7pv25f6>🔒</span> <div data-astro-cid-j7pv25f6> <strong data-astro-cid-j7pv25f6>Private by design</strong> <p data-astro-cid-j7pv25f6>Many tools run locally in your browser.</p> </div> </div> <div class="trust-item" data-astro-cid-j7pv25f6> <span class="trust-icon" data-astro-cid-j7pv25f6>⚡</span> <div data-astro-cid-j7pv25f6> <strong data-astro-cid-j7pv25f6>Fast and simple</strong> <p data-astro-cid-j7pv25f6>No heavy software or confusing steps.</p> </div> </div> <div class="trust-item" data-astro-cid-j7pv25f6> <span class="trust-icon" data-astro-cid-j7pv25f6>🆓</span> <div data-astro-cid-j7pv25f6> <strong data-astro-cid-j7pv25f6>Free to use</strong> <p data-astro-cid-j7pv25f6>No account needed for basic tools.</p> </div> </div> </div> </section> <section class="seo-content" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>Free Online Tools for Images, Text and More</h2> <p data-astro-cid-j7pv25f6>
PixMidas is a growing collection of free online tools designed to work directly inside your browser.
      Compress images, resize photos, convert image files, generate QR codes, compare text differences,
      count words and more without complicated software or account creation.
</p> <p data-astro-cid-j7pv25f6>
Unlike many traditional online utilities, PixMidas focuses on lightweight, fast and privacy-friendly browser tools.
      Many tools process files locally on your device instead of uploading them to external servers.
</p> <h3 data-astro-cid-j7pv25f6>Popular tools</h3> <ul class="seo-list" data-astro-cid-j7pv25f6> <li data-astro-cid-j7pv25f6>Free Image Compressor</li> <li data-astro-cid-j7pv25f6>Online Image Resizer</li> <li data-astro-cid-j7pv25f6>PNG to JPG Converter</li> <li data-astro-cid-j7pv25f6>QR Code Generator</li> <li data-astro-cid-j7pv25f6>Word Counter Tool</li> <li data-astro-cid-j7pv25f6>Image Information Viewer</li> <li data-astro-cid-j7pv25f6>Text Difference Checker</li> <li data-astro-cid-j7pv25f6>Images to PDF Converter</li> <li data-astro-cid-j7pv25f6>Social Media Sizes Guide</li> </ul> </section> <section class="legal-section" data-astro-cid-j7pv25f6> <div class="legal-grid" data-astro-cid-j7pv25f6> <div class="legal-item" data-astro-cid-j7pv25f6> <strong data-astro-cid-j7pv25f6>PixMidas Beta</strong> <p data-astro-cid-j7pv25f6>Some tools may still be under construction or experience occasional issues.</p> </div> <div class="legal-item" data-astro-cid-j7pv25f6> <strong data-astro-cid-j7pv25f6>Privacy & Local Processing</strong> <p data-astro-cid-j7pv25f6>When possible, files are processed locally in your browser.</p> </div> <div class="legal-item" data-astro-cid-j7pv25f6> <strong data-astro-cid-j7pv25f6>Responsible Use</strong> <p data-astro-cid-j7pv25f6>Do not use PixMidas to process illegal or unauthorized material.</p> </div> </div> </section> ` })}  `;
}, "/Users/urbansound/Downloads/digifixtool/src/pages/index.astro", void 0);

const $$file = "/Users/urbansound/Downloads/digifixtool/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
