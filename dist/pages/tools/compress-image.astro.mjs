import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Dw9fQcLJ.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_Dj2wG1aG.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useRef, useState } from 'react';
/* empty css                                             */
export { renderers } from '../../renderers.mjs';

function ImageCompressor() {
  const fileInputRef = useRef(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [quality, setQuality] = useState(0.7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const formatBytes = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };
  const calculateSavings = () => {
    if (!originalFile || !compressedSize) return null;
    const saved = (originalFile.size - compressedSize) / originalFile.size * 100;
    return Math.round(saved);
  };
  const compressImage = async (file, compressionQuality) => {
    setIsProcessing(true);
    try {
      const imageBitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      const maxWidth = 1920;
      const scale = Math.min(1, maxWidth / imageBitmap.width);
      canvas.width = imageBitmap.width * scale;
      canvas.height = imageBitmap.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          setCompressedUrl(url);
          setCompressedSize(blob.size);
          setIsProcessing(false);
        },
        "image/jpeg",
        compressionQuality
      );
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };
  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setOriginalFile(file);
    setOriginalPreview(URL.createObjectURL(file));
    await compressImage(file, quality);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };
  const handleQualityChange = async (e) => {
    const val = Number(e.target.value);
    setQuality(val);
    if (originalFile) await compressImage(originalFile, val);
  };
  const reset = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setCompressedUrl(null);
    setCompressedSize(null);
  };
  const downloadName = originalFile ? originalFile.name.replace(/\.[^/.]+$/, "") + "-compressed.jpg" : "compressed.jpg";
  const savings = calculateSavings();
  return /* @__PURE__ */ jsxs("div", { style: s.wrapper, children: [
    !originalFile ? /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          ...s.dropzone,
          borderColor: isDragging ? "#2563eb" : "#d1d5db",
          background: isDragging ? "#eff6ff" : "#fafaf9"
        },
        onDrop: handleDrop,
        onDragOver: (e) => {
          e.preventDefault();
          setIsDragging(true);
        },
        onDragLeave: () => setIsDragging(false),
        onClick: () => fileInputRef.current.click(),
        children: [
          /* @__PURE__ */ jsx("div", { style: s.uploadIcon, children: "🗜️" }),
          /* @__PURE__ */ jsx("h2", { style: s.dropTitle, children: "Drop your image here" }),
          /* @__PURE__ */ jsx("p", { style: s.dropText, children: "JPG, PNG or WebP. Runs entirely in your browser." }),
          /* @__PURE__ */ jsx("button", { style: s.btn, children: "Choose Image" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: "image/*",
              style: { display: "none" },
              onChange: (e) => handleFile(e.target.files[0])
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxs("div", { style: s.toolArea, children: [
      /* @__PURE__ */ jsxs("div", { style: s.sliderRow, children: [
        /* @__PURE__ */ jsxs("label", { style: s.sliderLabel, children: [
          "Compression Quality: ",
          /* @__PURE__ */ jsxs("strong", { children: [
            Math.round(quality * 100),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "range",
            min: "0.1",
            max: "0.95",
            step: "0.05",
            value: quality,
            onChange: handleQualityChange,
            style: s.slider
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: s.sliderHints, children: [
          /* @__PURE__ */ jsx("span", { children: "Smaller file" }),
          /* @__PURE__ */ jsx("span", { children: "Better quality" })
        ] })
      ] }),
      savings !== null && /* @__PURE__ */ jsxs("div", { style: s.savingsBadge, children: [
        /* @__PURE__ */ jsxs("span", { style: s.savingsPercent, children: [
          "↓ ",
          savings,
          "% smaller"
        ] }),
        /* @__PURE__ */ jsxs("span", { style: s.savingsDetail, children: [
          formatBytes(originalFile.size),
          " → ",
          formatBytes(compressedSize)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: s.previewGrid, children: [
        /* @__PURE__ */ jsxs("div", { style: s.previewCard, children: [
          /* @__PURE__ */ jsx("p", { style: s.previewLabel, children: "Original" }),
          /* @__PURE__ */ jsx("img", { src: originalPreview, alt: "Original", style: s.previewImg }),
          /* @__PURE__ */ jsx("p", { style: s.previewSize, children: formatBytes(originalFile.size) })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: s.previewCard, children: [
          /* @__PURE__ */ jsx("p", { style: s.previewLabel, children: "Compressed" }),
          isProcessing ? /* @__PURE__ */ jsxs("div", { style: s.processingBox, children: [
            /* @__PURE__ */ jsx("span", { style: s.spinner, children: "⏳" }),
            /* @__PURE__ */ jsx("p", { style: { color: "#6b7280", fontSize: 14 }, children: "Processing..." })
          ] }) : compressedUrl && /* @__PURE__ */ jsx("img", { src: compressedUrl, alt: "Compressed", style: s.previewImg }),
          /* @__PURE__ */ jsx("p", { style: s.previewSize, children: compressedSize ? formatBytes(compressedSize) : "—" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: s.actions, children: [
        compressedUrl && !isProcessing && /* @__PURE__ */ jsx("a", { href: compressedUrl, download: downloadName, style: s.downloadBtn, children: "⬇ Download compressed image" }),
        /* @__PURE__ */ jsx("button", { onClick: reset, style: s.resetBtn, children: "Start again" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: s.privacyNote, children: "🔒 Your files never leave your device. Everything happens locally." })
  ] });
}
const s = {
  wrapper: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 20,
    padding: 32,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
  },
  dropzone: {
    border: "2px dashed",
    borderRadius: 16,
    padding: "56px 24px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.15s"
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  dropTitle: {
    fontSize: 24,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    marginBottom: 8,
    color: "#111827"
  },
  dropText: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 24
  },
  btn: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "14px 28px",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    fontFamily: "inherit"
  },
  toolArea: {
    display: "flex",
    flexDirection: "column",
    gap: 24
  },
  sliderRow: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  sliderLabel: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827"
  },
  slider: {
    width: "100%",
    accentColor: "#2563eb",
    height: 6
  },
  sliderHints: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#9ca3af"
  },
  savingsBadge: {
    background: "#dcfce7",
    border: "1px solid #86efac",
    borderRadius: 12,
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8
  },
  savingsPercent: {
    fontSize: 18,
    fontWeight: 800,
    color: "#166534"
  },
  savingsDetail: {
    fontSize: 14,
    color: "#166534"
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16
  },
  previewCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 16,
    background: "#fafaf9"
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#6b7280",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  previewImg: {
    width: "100%",
    height: 220,
    objectFit: "contain",
    borderRadius: 10,
    background: "#f3f4f6"
  },
  processingBox: {
    width: "100%",
    height: 220,
    background: "#f3f4f6",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },
  spinner: {
    fontSize: 28
  },
  previewSize: {
    marginTop: 10,
    fontWeight: 700,
    fontSize: 14,
    color: "#111827"
  },
  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap"
  },
  downloadBtn: {
    background: "#2563eb",
    color: "#fff",
    textDecoration: "none",
    padding: "14px 28px",
    borderRadius: 999,
    fontWeight: 700,
    fontSize: 15,
    display: "inline-flex",
    alignItems: "center",
    gap: 8
  },
  resetBtn: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    padding: "14px 24px",
    borderRadius: 999,
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    fontFamily: "inherit",
    color: "#374151"
  },
  privacyNote: {
    marginTop: 20,
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center"
  }
};

const $$CompressImage = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Compress Image Online Free", "description": "Compress JPG, PNG and WebP images online for free. No upload, no login, works 100% in your browser.", "data-astro-cid-2m7xj6yf": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="tool-page" data-astro-cid-2m7xj6yf> <div class="tool-header" data-astro-cid-2m7xj6yf> <a href="/" class="back-link" data-astro-cid-2m7xj6yf>← All tools</a> <h1 class="tool-title" data-astro-cid-2m7xj6yf>Image Compressor</h1> <p class="tool-subtitle" data-astro-cid-2m7xj6yf>Reduce image file size instantly. No upload needed. Everything runs in your browser.</p> </div> <div class="ad-slot ad-slot-horizontal" data-astro-cid-2m7xj6yf>Advertisement</div> ${renderComponent($$result2, "ImageCompressor", ImageCompressor, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/urbansound/Downloads/digifixtool/src/components/ImageCompressor.jsx", "client:component-export": "default", "data-astro-cid-2m7xj6yf": true })} <div class="ad-slot ad-slot-horizontal" style="margin-top: 32px;" data-astro-cid-2m7xj6yf>Advertisement</div> <section class="seo-content" data-astro-cid-2m7xj6yf> <h2 data-astro-cid-2m7xj6yf>How to compress an image online</h2> <p data-astro-cid-2m7xj6yf>Upload your image, adjust the compression slider, then download. Done in seconds.</p> <h2 data-astro-cid-2m7xj6yf>Which formats are supported?</h2> <p data-astro-cid-2m7xj6yf>JPG, PNG, and WebP. Output is always saved as JPG.</p> <h2 data-astro-cid-2m7xj6yf>Is it safe?</h2> <p data-astro-cid-2m7xj6yf>No files are ever uploaded. Everything runs in your browser. Nothing is sent to any server.</p> </section> </div> ` })} `;
}, "/Users/urbansound/Downloads/digifixtool/src/pages/tools/compress-image.astro", void 0);

const $$file = "/Users/urbansound/Downloads/digifixtool/src/pages/tools/compress-image.astro";
const $$url = "/tools/compress-image";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CompressImage,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
