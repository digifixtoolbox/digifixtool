import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Dw9fQcLJ.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_Dj2wG1aG.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useRef, useState } from 'react';
/* empty css                                         */
export { renderers } from '../../renderers.mjs';

function ImageInfo() {
  const fileInputRef = useRef(null);
  const [info, setInfo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fmt = (b) => b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(2) + " MB";
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const getAspectRatio = (w, h) => {
    const d = gcd(w, h);
    return `${w / d}:${h / d}`;
  };
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setInfo({
        name: file.name,
        format: file.type.replace("image/", "").toUpperCase(),
        size: fmt(file.size),
        width: img.width,
        height: img.height,
        aspectRatio: getAspectRatio(img.width, img.height),
        megapixels: (img.width * img.height / 1e6).toFixed(1),
        landscape: img.width > img.height ? "Landscape" : img.width < img.height ? "Portrait" : "Square"
      });
    };
    img.src = url;
  };
  const reset = () => {
    setInfo(null);
    setPreview(null);
  };
  const stats = info ? [
    { label: "Width", value: info.width + " px" },
    { label: "Height", value: info.height + " px" },
    { label: "File Size", value: info.size },
    { label: "Format", value: info.format },
    { label: "Aspect Ratio", value: info.aspectRatio },
    { label: "Megapixels", value: info.megapixels + " MP" },
    { label: "Orientation", value: info.landscape },
    { label: "File Name", value: info.name }
  ] : [];
  return /* @__PURE__ */ jsxs("div", { style: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: 32 }, children: [
    !info ? /* @__PURE__ */ jsxs(
      "div",
      {
        style: { border: "2px dashed", borderColor: isDragging ? "#2563eb" : "#d1d5db", borderRadius: 16, padding: "56px 24px", textAlign: "center", cursor: "pointer", background: isDragging ? "#eff6ff" : "#fafaf9", transition: "all 0.15s" },
        onClick: () => fileInputRef.current.click(),
        onDrop: (e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files[0]);
        },
        onDragOver: (e) => {
          e.preventDefault();
          setIsDragging(true);
        },
        onDragLeave: () => setIsDragging(false),
        children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 16 }, children: "🔍" }),
          /* @__PURE__ */ jsx("h2", { style: { fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#111827" }, children: "Drop your image here" }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "#6b7280", marginBottom: 24 }, children: "Upload any image to see its dimensions and details." }),
          /* @__PURE__ */ jsx("button", { style: { background: "#111827", color: "#fff", border: "none", borderRadius: 999, padding: "14px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer" }, children: "Choose Image" }),
          /* @__PURE__ */ jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", style: { display: "none" }, onChange: (e) => handleFile(e.target.files[0]) })
        ]
      }
    ) : /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 24 }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }, children: [
        /* @__PURE__ */ jsx("img", { src: preview, alt: "Preview", style: { width: "100%", maxHeight: 280, objectFit: "contain", borderRadius: 14, background: "#f3f4f6", border: "1px solid #e5e7eb" } }),
        /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignContent: "start" }, children: stats.map((stat) => /* @__PURE__ */ jsxs("div", { style: { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 16px" }, children: [
          /* @__PURE__ */ jsx("p", { style: { fontSize: 11, fontWeight: 600, color: "#9ca3af", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }, children: stat.label }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: 15, fontWeight: 700, color: "#111827", margin: 0, marginTop: 4, wordBreak: "break-all" }, children: stat.value })
        ] }, stat.label)) })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: reset,
          style: { background: "#fff", border: "1px solid #e5e7eb", padding: "12px 24px", borderRadius: 999, fontWeight: 600, fontSize: 15, cursor: "pointer", color: "#374151", alignSelf: "flex-start", fontFamily: "inherit" },
          children: "Check another image"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { style: { marginTop: 20, fontSize: 13, color: "#6b7280", textAlign: "center" }, children: "🔒 Your files never leave your device." })
  ] });
}

const $$ImageInfo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Image Size Checker - Find Image Dimensions Online Free", "description": "Upload any image to instantly find its pixel dimensions, file size, aspect ratio, format and more. Free, no upload, works in your browser.", "data-astro-cid-pe3gzicd": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="tool-page" data-astro-cid-pe3gzicd> <div class="tool-header" data-astro-cid-pe3gzicd> <a href="/" class="back-link" data-astro-cid-pe3gzicd>← All tools</a> <h1 class="tool-title" data-astro-cid-pe3gzicd>Image Info</h1> <p class="tool-subtitle" data-astro-cid-pe3gzicd>Upload any image to instantly see its dimensions, file size, format and aspect ratio.</p> </div> <div class="ad-slot ad-slot-horizontal" data-astro-cid-pe3gzicd>Advertisement</div> ${renderComponent($$result2, "ImageInfo", ImageInfo, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/urbansound/Downloads/digifixtool/src/components/ImageInfo.jsx", "client:component-export": "default", "data-astro-cid-pe3gzicd": true })} <div class="ad-slot ad-slot-horizontal" style="margin-top: 32px;" data-astro-cid-pe3gzicd>Advertisement</div> <section class="seo-content" data-astro-cid-pe3gzicd> <h2 data-astro-cid-pe3gzicd>How to find image dimensions</h2> <p data-astro-cid-pe3gzicd>Upload your image and all details appear instantly. Width, height, file size, format and aspect ratio in one click.</p> <h2 data-astro-cid-pe3gzicd>What information does it show?</h2> <p data-astro-cid-pe3gzicd>Width and height in pixels, file size, image format, aspect ratio, megapixels and orientation.</p> <h2 data-astro-cid-pe3gzicd>Is it safe?</h2> <p data-astro-cid-pe3gzicd>Your image never leaves your device. Everything runs locally in your browser.</p> </section> </div> ` })} `;
}, "/Users/urbansound/Downloads/digifixtool/src/pages/tools/image-info.astro", void 0);

const $$file = "/Users/urbansound/Downloads/digifixtool/src/pages/tools/image-info.astro";
const $$url = "/tools/image-info";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ImageInfo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
