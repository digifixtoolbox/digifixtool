import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Dw9fQcLJ.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_Dj2wG1aG.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
/* empty css                                           */
export { renderers } from '../../renderers.mjs';

const platforms = {
  Instagram: {
    icon: "📸",
    formats: [
      { name: "Square Post", w: 1080, h: 1080, note: "Best for feed posts" },
      { name: "Portrait Post", w: 1080, h: 1350, note: "More screen space in feed" },
      { name: "Landscape Post", w: 1080, h: 566, note: "Cinematic look" },
      { name: "Story / Reel", w: 1080, h: 1920, note: "Full screen vertical" },
      { name: "Profile Picture", w: 320, h: 320, note: "Displays as circle" },
      { name: "Highlight Cover", w: 1080, h: 1920, note: "Circle crop at center" }
    ]
  },
  YouTube: {
    icon: "▶️",
    formats: [
      { name: "Video / Thumbnail", w: 1280, h: 720, note: "16:9 — standard HD" },
      { name: "Channel Banner", w: 2560, h: 1440, note: "Safe area: 1546x423px" },
      { name: "Profile Picture", w: 800, h: 800, note: "Displays as circle" },
      { name: "Community Post Image", w: 1080, h: 1080, note: "Square format" },
      { name: "Short", w: 1080, h: 1920, note: "Full screen vertical" }
    ]
  },
  TikTok: {
    icon: "🎵",
    formats: [
      { name: "Video / Story", w: 1080, h: 1920, note: "Full screen vertical" },
      { name: "Profile Picture", w: 200, h: 200, note: "Displays as circle" },
      { name: "Cover Image", w: 1080, h: 1920, note: "Vertical format" }
    ]
  },
  Facebook: {
    icon: "👍",
    formats: [
      { name: "Feed Post", w: 1200, h: 630, note: "Landscape recommended" },
      { name: "Square Post", w: 1200, h: 1200, note: "Works great in feed" },
      { name: "Story", w: 1080, h: 1920, note: "Full screen vertical" },
      { name: "Cover Photo", w: 820, h: 312, note: "Desktop display size" },
      { name: "Profile Picture", w: 170, h: 170, note: "Displays as circle" },
      { name: "Event Cover", w: 1920, h: 1005, note: "Wide format" }
    ]
  },
  LinkedIn: {
    icon: "💼",
    formats: [
      { name: "Post Image", w: 1200, h: 627, note: "Landscape recommended" },
      { name: "Profile Picture", w: 400, h: 400, note: "Displays as circle" },
      { name: "Cover / Banner", w: 1584, h: 396, note: "4:1 ratio" },
      { name: "Company Logo", w: 300, h: 300, note: "Square format" },
      { name: "Company Cover", w: 1128, h: 191, note: "Wide banner" },
      { name: "Story", w: 1080, h: 1920, note: "Full screen vertical" }
    ]
  },
  "Twitter / X": {
    icon: "🐦",
    formats: [
      { name: "Post Image", w: 1600, h: 900, note: "16:9 recommended" },
      { name: "Profile Picture", w: 400, h: 400, note: "Displays as circle" },
      { name: "Header / Banner", w: 1500, h: 500, note: "3:1 ratio" },
      { name: "Card Image", w: 1200, h: 628, note: "For link previews" }
    ]
  },
  Pinterest: {
    icon: "📌",
    formats: [
      { name: "Standard Pin", w: 1e3, h: 1500, note: "2:3 ratio — ideal" },
      { name: "Square Pin", w: 1e3, h: 1e3, note: "Square format" },
      { name: "Long Pin", w: 1e3, h: 2100, note: "Max recommended height" },
      { name: "Profile Picture", w: 165, h: 165, note: "Displays as circle" },
      { name: "Board Cover", w: 800, h: 450, note: "16:9 ratio" }
    ]
  }
};
function SocialSizes() {
  const [selectedPlatform, setSelectedPlatform] = useState("Instagram");
  const [selectedFormat, setSelectedFormat] = useState(null);
  const platform = platforms[selectedPlatform];
  const format = selectedFormat !== null ? platform.formats[selectedFormat] : null;
  const downloadBlank = () => {
    if (!format) return;
    const canvas = document.createElement("canvas");
    canvas.width = format.w;
    canvas.height = format.h;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    ctx.fillStyle = "#9ca3af";
    ctx.font = `bold ${Math.min(canvas.width, canvas.height) * 0.06}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${format.w} × ${format.h}px`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = `${Math.min(canvas.width, canvas.height) * 0.04}px sans-serif`;
    ctx.fillText(`${selectedPlatform} — ${format.name}`, canvas.width / 2, canvas.height / 2 + 40);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedPlatform}-${format.name.replace(/\s/g, "-")}-${format.w}x${format.h}.jpg`;
      a.click();
    }, "image/jpeg", 0.95);
  };
  const previewScale = format ? Math.min(200 / format.w, 160 / format.h) : 1;
  const previewW = format ? format.w * previewScale : 0;
  const previewH = format ? format.h * previewScale : 0;
  return /* @__PURE__ */ jsxs("div", { style: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: 32 }, children: [
    /* @__PURE__ */ jsxs("div", { style: { marginBottom: 24 }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Select Platform" }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: Object.keys(platforms).map((p) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setSelectedPlatform(p);
            setSelectedFormat(null);
          },
          style: {
            padding: "10px 18px",
            borderRadius: 999,
            border: "1px solid",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
            borderColor: selectedPlatform === p ? "#2563eb" : "#e5e7eb",
            background: selectedPlatform === p ? "#2563eb" : "#fff",
            color: selectedPlatform === p ? "#fff" : "#374151"
          },
          children: [
            platforms[p].icon,
            " ",
            p
          ]
        },
        p
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { marginBottom: 24 }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Select Format" }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }, children: platform.formats.map((f, i) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSelectedFormat(i),
          style: {
            padding: "14px 16px",
            borderRadius: 12,
            border: "1px solid",
            textAlign: "left",
            cursor: "pointer",
            fontFamily: "inherit",
            borderColor: selectedFormat === i ? "#2563eb" : "#e5e7eb",
            background: selectedFormat === i ? "#eff6ff" : "#fafaf9"
          },
          children: [
            /* @__PURE__ */ jsx("p", { style: { fontWeight: 700, fontSize: 14, color: selectedFormat === i ? "#2563eb" : "#111827", margin: 0 }, children: f.name }),
            /* @__PURE__ */ jsxs("p", { style: { fontSize: 12, color: "#6b7280", margin: 0, marginTop: 4 }, children: [
              f.w,
              " × ",
              f.h,
              "px"
            ] })
          ]
        },
        i
      )) })
    ] }),
    format && /* @__PURE__ */ jsxs("div", { style: { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }, children: [
      /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", minWidth: 120 }, children: /* @__PURE__ */ jsxs("div", { style: { width: previewW, height: previewH, background: "#e5e7eb", borderRadius: 4, border: "2px solid #2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#6b7280", fontWeight: 600 }, children: [
        format.w,
        ":",
        format.h
      ] }) }),
      /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 200 }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }, children: format.name }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "#6b7280", margin: "4px 0 0" }, children: selectedPlatform }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { fontSize: 11, color: "#9ca3af", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Width" }),
            /* @__PURE__ */ jsxs("p", { style: { fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }, children: [
              format.w,
              "px"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { fontSize: 11, color: "#9ca3af", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Height" }),
            /* @__PURE__ */ jsxs("p", { style: { fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }, children: [
              format.h,
              "px"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { fontSize: 13, color: "#6b7280", marginTop: 8 }, children: [
          "💡 ",
          format.note
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: downloadBlank,
            style: { marginTop: 12, background: "#2563eb", color: "#fff", border: "none", borderRadius: 999, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
            children: [
              "⬇ Download blank canvas (",
              format.w,
              "×",
              format.h,
              ")"
            ]
          }
        )
      ] })
    ] }),
    !format && /* @__PURE__ */ jsx("div", { style: { background: "#f9fafb", border: "1px dashed #d1d5db", borderRadius: 16, padding: 32, textAlign: "center", color: "#9ca3af" }, children: /* @__PURE__ */ jsx("p", { style: { fontSize: 15 }, children: "Select a format above to see the dimensions" }) })
  ] });
}

const $$SocialSizes = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Social Media Image Sizes 2025 - All Platforms", "description": "Find the correct image dimensions for every social media platform. Instagram, YouTube, TikTok, Facebook, LinkedIn, Twitter. Free tool with blank canvas download.", "data-astro-cid-y4p5olxi": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="tool-page" data-astro-cid-y4p5olxi> <div class="tool-header" data-astro-cid-y4p5olxi> <a href="/" class="back-link" data-astro-cid-y4p5olxi>← All tools</a> <h1 class="tool-title" data-astro-cid-y4p5olxi>Social Media Sizes</h1> <p class="tool-subtitle" data-astro-cid-y4p5olxi>Find the exact image dimensions for every platform and format. Download a blank canvas at the right size instantly.</p> </div> <div class="ad-slot ad-slot-horizontal" data-astro-cid-y4p5olxi>Advertisement</div> ${renderComponent($$result2, "SocialSizes", SocialSizes, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/urbansound/Downloads/digifixtool/src/components/SocialSizes.jsx", "client:component-export": "default", "data-astro-cid-y4p5olxi": true })} <div class="ad-slot ad-slot-horizontal" style="margin-top: 32px;" data-astro-cid-y4p5olxi>Advertisement</div> <section class="seo-content" data-astro-cid-y4p5olxi> <h2 data-astro-cid-y4p5olxi>Why do social media image sizes matter?</h2> <p data-astro-cid-y4p5olxi>Each platform crops and displays images differently. Using the wrong size results in blurry, cropped or distorted images that hurt engagement.</p> <h2 data-astro-cid-y4p5olxi>Which platforms are covered?</h2> <p data-astro-cid-y4p5olxi>Instagram, YouTube, TikTok, Facebook, LinkedIn, Twitter/X and Pinterest. All major content types including posts, stories, banners, profile pictures and thumbnails.</p> <h2 data-astro-cid-y4p5olxi>What is the blank canvas download?</h2> <p data-astro-cid-y4p5olxi>A blank JPG file at exactly the right pixel dimensions for your chosen format. Open it in any design tool and start creating at the correct size.</p> </section> </div> ` })} `;
}, "/Users/urbansound/Downloads/digifixtool/src/pages/tools/social-sizes.astro", void 0);

const $$file = "/Users/urbansound/Downloads/digifixtool/src/pages/tools/social-sizes.astro";
const $$url = "/tools/social-sizes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$SocialSizes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
