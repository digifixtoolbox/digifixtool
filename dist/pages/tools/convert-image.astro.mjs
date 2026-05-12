import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Dw9fQcLJ.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_Dj2wG1aG.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useRef, useState } from 'react';
/* empty css                                            */
export { renderers } from '../../renderers.mjs';

function ImageConverter() {
  const fileInputRef = useRef(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [convertedSize, setConvertedSize] = useState(null);
  const [mode, setMode] = useState("to-jpg");
  const [quality, setQuality] = useState(0.92);
  const [isProcessing, setIsProcessing] = useState(false);
  const fmt = (b) => b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(2) + " MB";
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setOriginalFile(file);
    setConvertedUrl(null);
    setOriginalPreview(URL.createObjectURL(file));
  };
  const convert = async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    const bmp = await createImageBitmap(originalFile);
    const c = document.createElement("canvas");
    c.width = bmp.width;
    c.height = bmp.height;
    const ctx = c.getContext("2d");
    if (mode === "to-png") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, c.width, c.height);
    }
    ctx.drawImage(bmp, 0, 0);
    const mimeType = mode === "to-jpg" ? "image/jpeg" : "image/png";
    const q = mode === "to-jpg" ? quality : void 0;
    c.toBlob((blob) => {
      setConvertedUrl(URL.createObjectURL(blob));
      setConvertedSize(blob.size);
      setIsProcessing(false);
    }, mimeType, q);
  };
  const reset = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setConvertedUrl(null);
    setConvertedSize(null);
  };
  const ext = mode === "to-jpg" ? ".jpg" : ".png";
  const dlName = originalFile ? originalFile.name.replace(/\.[^/.]+$/, "") + "-converted" + ext : "converted" + ext;
  return /* @__PURE__ */ jsxs("div", { style: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: 32 }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, marginBottom: 24, background: "#f3f4f6", borderRadius: 12, padding: 4 }, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setMode("to-jpg");
            setConvertedUrl(null);
          },
          style: {
            flex: 1,
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
            background: mode === "to-jpg" ? "#fff" : "transparent",
            color: mode === "to-jpg" ? "#111827" : "#6b7280",
            boxShadow: mode === "to-jpg" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
          },
          children: "PNG / WebP → JPG"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setMode("to-png");
            setConvertedUrl(null);
          },
          style: {
            flex: 1,
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
            background: mode === "to-png" ? "#fff" : "transparent",
            color: mode === "to-png" ? "#111827" : "#6b7280",
            boxShadow: mode === "to-png" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
          },
          children: "JPG / WebP → PNG"
        }
      )
    ] }),
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
          /* @__PURE__ */ jsx("div", { style: { fontSize: 48, marginBottom: 16 }, children: "🔄" }),
          /* @__PURE__ */ jsx("h2", { style: { fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#111827" }, children: "Drop your image here" }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "#6b7280", marginBottom: 24 }, children: mode === "to-jpg" ? "Upload a PNG or WebP to convert to JPG" : "Upload a JPG or WebP to convert to PNG" }),
          /* @__PURE__ */ jsx("button", { style: { background: "#111827", color: "#fff", border: "none", borderRadius: 999, padding: "14px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer" }, children: "Choose Image" }),
          /* @__PURE__ */ jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", style: { display: "none" }, onChange: (e) => handleFile(e.target.files[0]) })
        ]
      }
    ) : /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 20 }, children: [
      mode === "to-jpg" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { style: { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }, children: [
          "JPG Quality: ",
          /* @__PURE__ */ jsxs("strong", { children: [
            Math.round(quality * 100),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "range",
            min: "0.5",
            max: "1",
            step: "0.05",
            value: quality,
            onChange: (e) => setQuality(Number(e.target.value)),
            style: { width: "100%", accentColor: "#2563eb" }
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: convert,
          disabled: isProcessing,
          style: { background: "#2563eb", color: "#fff", border: "none", borderRadius: 999, padding: "14px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer", alignSelf: "flex-start" },
          children: isProcessing ? "Converting..." : `Convert to ${mode === "to-jpg" ? "JPG" : "PNG"}`
        }
      ),
      convertedUrl && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { border: "1px solid #e5e7eb", borderRadius: 14, padding: 16, background: "#fafaf9" }, children: [
            /* @__PURE__ */ jsx("p", { style: { fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 10 }, children: "ORIGINAL" }),
            /* @__PURE__ */ jsx("img", { src: originalPreview, alt: "Original", style: { width: "100%", height: 220, objectFit: "contain", borderRadius: 10, background: "#f3f4f6" } }),
            /* @__PURE__ */ jsx("p", { style: { marginTop: 10, fontWeight: 700, fontSize: 14 }, children: fmt(originalFile.size) })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { border: "1px solid #e5e7eb", borderRadius: 14, padding: 16, background: "#fafaf9" }, children: [
            /* @__PURE__ */ jsx("p", { style: { fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 10 }, children: "CONVERTED" }),
            /* @__PURE__ */ jsx("img", { src: convertedUrl, alt: "Converted", style: { width: "100%", height: 220, objectFit: "contain", borderRadius: 10, background: "#f3f4f6" } }),
            /* @__PURE__ */ jsx("p", { style: { marginTop: 10, fontWeight: 700, fontSize: 14 }, children: fmt(convertedSize) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: convertedUrl,
              download: dlName,
              style: { background: "#2563eb", color: "#fff", textDecoration: "none", padding: "14px 28px", borderRadius: 999, fontWeight: 700, fontSize: 15 },
              children: [
                "⬇ Download ",
                mode === "to-jpg" ? "JPG" : "PNG"
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
        ] })
      ] }),
      !convertedUrl && /* @__PURE__ */ jsx(
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

const $$ConvertImage = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Convert Image Online Free - PNG to JPG, JPG to PNG", "description": "Convert PNG to JPG or JPG to PNG online for free. No upload, no login, works 100% in your browser.", "data-astro-cid-o2bq75jn": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="tool-page" data-astro-cid-o2bq75jn> <div class="tool-header" data-astro-cid-o2bq75jn> <a href="/" class="back-link" data-astro-cid-o2bq75jn>← All tools</a> <h1 class="tool-title" data-astro-cid-o2bq75jn>Image Converter</h1> <p class="tool-subtitle" data-astro-cid-o2bq75jn>Convert PNG to JPG, JPG to PNG, or WebP to either format. Free, instant, private.</p> </div> <div class="ad-slot ad-slot-horizontal" data-astro-cid-o2bq75jn>Advertisement</div> ${renderComponent($$result2, "ImageConverter", ImageConverter, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/urbansound/Downloads/digifixtool/src/components/ImageConverter.jsx", "client:component-export": "default", "data-astro-cid-o2bq75jn": true })} <div class="ad-slot ad-slot-horizontal" style="margin-top: 32px;" data-astro-cid-o2bq75jn>Advertisement</div> <section class="seo-content" data-astro-cid-o2bq75jn> <h2 data-astro-cid-o2bq75jn>How to convert an image format</h2> <p data-astro-cid-o2bq75jn>Select your conversion direction, upload your image, and click Convert. Download instantly. No account needed.</p> <h2 data-astro-cid-o2bq75jn>PNG to JPG vs JPG to PNG</h2> <p data-astro-cid-o2bq75jn>JPG is smaller and better for photos. PNG supports transparency and is better for logos and graphics.</p> <h2 data-astro-cid-o2bq75jn>Is it safe?</h2> <p data-astro-cid-o2bq75jn>Your images never leave your device. Everything runs locally in your browser.</p> </section> </div> ` })} `;
}, "/Users/urbansound/Downloads/digifixtool/src/pages/tools/convert-image.astro", void 0);

const $$file = "/Users/urbansound/Downloads/digifixtool/src/pages/tools/convert-image.astro";
const $$url = "/tools/convert-image";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ConvertImage,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
