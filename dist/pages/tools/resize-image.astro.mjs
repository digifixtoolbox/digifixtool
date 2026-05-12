import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Dw9fQcLJ.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_Dj2wG1aG.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useRef, useState } from 'react';
/* empty css                                           */
export { renderers } from '../../renderers.mjs';

function ImageResizer() {
  const fileInputRef = useRef(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [originalDims, setOriginalDims] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [keepAspect, setKeepAspect] = useState(true);
  const [resizedUrl, setResizedUrl] = useState(null);
  const [resizedSize, setResizedSize] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setOriginalFile(file);
    setResizedUrl(null);
    const preview = URL.createObjectURL(file);
    setOriginalPreview(preview);
    const img = new Image();
    img.onload = () => {
      setOriginalDims({ w: img.width, h: img.height });
      setWidth(String(img.width));
      setHeight(String(img.height));
    };
    img.src = preview;
  };
  const handleW = (e) => {
    const v = e.target.value;
    setWidth(v);
    if (keepAspect && originalDims && v)
      setHeight(String(Math.round(v * originalDims.h / originalDims.w)));
  };
  const handleH = (e) => {
    const v = e.target.value;
    setHeight(v);
    if (keepAspect && originalDims && v)
      setWidth(String(Math.round(v * originalDims.w / originalDims.h)));
  };
  const resizeImage = async () => {
    if (!originalFile || !width || !height) return;
    setIsProcessing(true);
    const bmp = await createImageBitmap(originalFile);
    const c = document.createElement("canvas");
    c.width = Number(width);
    c.height = Number(height);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    c.toBlob((blob) => {
      setResizedUrl(URL.createObjectURL(blob));
      setResizedSize(blob.size);
      setIsProcessing(false);
    }, "image/jpeg", 0.92);
  };
  const reset = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setOriginalDims(null);
    setWidth("");
    setHeight("");
    setResizedUrl(null);
    setResizedSize(null);
  };
  const dlName = originalFile ? originalFile.name.replace(/\.[^/.]+$/, "") + "-" + width + "x" + height + ".jpg" : "resized.jpg";
  return /* @__PURE__ */ jsxs("div", { style: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: 32 }, children: [
    !originalFile ? /* @__PURE__ */ jsxs(
      "div",
      {
        style: { border: "2px dashed #d1d5db", borderRadius: 16, padding: "56px 24px", textAlign: "center", cursor: "pointer", background: "#fafaf9" },
        onClick: () => fileInputRef.current.click(),
        onDrop: (e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        },
        onDragOver: (e) => e.preventDefault(),
        children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 16 }, children: "📐" }),
          /* @__PURE__ */ jsx("h2", { style: { fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#111827" }, children: "Drop your image here" }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "#6b7280", marginBottom: 24 }, children: "JPG, PNG or WebP. Resize to any dimension." }),
          /* @__PURE__ */ jsx("button", { style: { background: "#111827", color: "#fff", border: "none", borderRadius: 999, padding: "14px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer" }, children: "Choose Image" }),
          /* @__PURE__ */ jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", style: { display: "none" }, onChange: (e) => handleFile(e.target.files[0]) })
        ]
      }
    ) : /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 20 }, children: [
      originalDims && /* @__PURE__ */ jsxs("p", { style: { fontSize: 14, color: "#6b7280" }, children: [
        "Original: ",
        /* @__PURE__ */ jsxs("strong", { children: [
          originalDims.w,
          " x ",
          originalDims.h,
          "px"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 120 }, children: [
          /* @__PURE__ */ jsx("label", { style: { fontSize: 13, fontWeight: 600, color: "#374151" }, children: "Width (px)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: width,
              onChange: handleW,
              min: "1",
              style: { border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 16, fontWeight: 600, outline: "none", width: "100%" }
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: { paddingBottom: 8, fontSize: 22, cursor: "pointer", color: keepAspect ? "#2563eb" : "#9ca3af" },
            onClick: () => setKeepAspect(!keepAspect),
            children: keepAspect ? "🔒" : "🔓"
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 120 }, children: [
          /* @__PURE__ */ jsx("label", { style: { fontSize: 13, fontWeight: 600, color: "#374151" }, children: "Height (px)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: height,
              onChange: handleH,
              min: "1",
              style: { border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 16, fontWeight: 600, outline: "none", width: "100%" }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: resizeImage,
          disabled: isProcessing,
          style: { background: "#2563eb", color: "#fff", border: "none", borderRadius: 999, padding: "14px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer", alignSelf: "flex-start" },
          children: isProcessing ? "Resizing..." : "Resize Image"
        }
      ),
      resizedUrl && /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: resizedUrl,
            download: dlName,
            style: { background: "#2563eb", color: "#fff", textDecoration: "none", padding: "14px 28px", borderRadius: 999, fontWeight: 700, fontSize: 15 },
            children: [
              "Download ",
              width,
              "x",
              height,
              "px"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: reset,
            style: { background: "#fff", border: "1px solid #e5e7eb", padding: "14px 24px", borderRadius: 999, fontWeight: 600, fontSize: 15, cursor: "pointer", color: "#374151" },
            children: "Start again"
          }
        )
      ] }),
      !resizedUrl && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: reset,
          style: { background: "#fff", border: "1px solid #e5e7eb", padding: "14px 24px", borderRadius: 999, fontWeight: 600, fontSize: 15, cursor: "pointer", color: "#374151", alignSelf: "flex-start" },
          children: "Start again"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { style: { marginTop: 20, fontSize: 13, color: "#6b7280", textAlign: "center" }, children: "🔒 Your files never leave your device." })
  ] });
}

const $$ResizeImage = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Resize Image Online Free", "description": "Resize any image to exact pixel dimensions online for free. No upload, no login, works 100% in your browser.", "data-astro-cid-gbjn7c4v": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="tool-page" data-astro-cid-gbjn7c4v> <div class="tool-header" data-astro-cid-gbjn7c4v> <a href="/" class="back-link" data-astro-cid-gbjn7c4v>← All tools</a> <h1 class="tool-title" data-astro-cid-gbjn7c4v>Image Resizer</h1> <p class="tool-subtitle" data-astro-cid-gbjn7c4v>Resize any image to exact pixel dimensions. Lock aspect ratio or set freely.</p> </div> <div class="ad-slot ad-slot-horizontal" data-astro-cid-gbjn7c4v>Advertisement</div> ${renderComponent($$result2, "ImageResizer", ImageResizer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/urbansound/Downloads/digifixtool/src/components/ImageResizer.jsx", "client:component-export": "default", "data-astro-cid-gbjn7c4v": true })} <div class="ad-slot ad-slot-horizontal" style="margin-top: 32px;" data-astro-cid-gbjn7c4v>Advertisement</div> <section class="seo-content" data-astro-cid-gbjn7c4v> <h2 data-astro-cid-gbjn7c4v>How to resize an image online</h2> <p data-astro-cid-gbjn7c4v>Upload your image, enter the width and height you need, and click Resize. Download instantly.</p> <h2 data-astro-cid-gbjn7c4v>Is it fe?</h2> <p data-astro-cid-gbjn7c4v>Your images never leave your device. Everything runs locally in your browser.</p> </section> </div> ` })} `;
}, "/Users/urbansound/Downloads/digifixtool/src/pages/tools/resize-image.astro", void 0);

const $$file = "/Users/urbansound/Downloads/digifixtool/src/pages/tools/resize-image.astro";
const $$url = "/tools/resize-image";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ResizeImage,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
