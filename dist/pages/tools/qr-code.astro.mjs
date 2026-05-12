import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Dw9fQcLJ.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_Dj2wG1aG.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

function QRGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [qrUrl, setQrUrl] = useState("");
  const debounceRef = useRef(null);
  useEffect(() => {
    if (!text.trim()) {
      setQrUrl("");
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const encoded = encodeURIComponent(text.trim());
      const fgClean = fg.replace("#", "");
      const bgClean = bg.replace("#", "");
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&color=${fgClean}&bgcolor=${bgClean}&qzone=2`);
    }, 400);
  }, [text, size, fg, bg]);
  const download = () => {
    const a = document.createElement("a");
    a.href = qrUrl + "&format=png";
    a.download = "qrcode.png";
    a.click();
  };
  return /* @__PURE__ */ jsxs("div", { style: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: 32 }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 20 }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }, children: "Text or URL" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: text,
              onChange: (e) => setText(e.target.value),
              placeholder: "Enter a URL, text, email, phone number...",
              style: { width: "100%", height: 120, border: "1px solid #d1d5db", borderRadius: 12, padding: "12px 16px", fontSize: 15, fontFamily: "inherit", color: "#111827", resize: "vertical", outline: "none", lineHeight: 1.5, boxSizing: "border-box" }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { style: { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }, children: [
            "Size: ",
            /* @__PURE__ */ jsxs("strong", { children: [
              size,
              "x",
              size,
              "px"
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "range",
              min: "128",
              max: "512",
              step: "64",
              value: size,
              onChange: (e) => setSize(Number(e.target.value)),
              style: { width: "100%", accentColor: "#2563eb" }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 16 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }, children: "QR Color" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, border: "1px solid #d1d5db", borderRadius: 10, padding: "8px 12px" }, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "color",
                  value: fg,
                  onChange: (e) => setFg(e.target.value),
                  style: { width: 32, height: 32, border: "none", borderRadius: 6, cursor: "pointer", background: "none" }
                }
              ),
              /* @__PURE__ */ jsx("span", { style: { fontSize: 14, color: "#374151", fontWeight: 500 }, children: fg })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsx("label", { style: { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }, children: "Background" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, border: "1px solid #d1d5db", borderRadius: 10, padding: "8px 12px" }, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "color",
                  value: bg,
                  onChange: (e) => setBg(e.target.value),
                  style: { width: 32, height: 32, border: "none", borderRadius: 6, cursor: "pointer", background: "none" }
                }
              ),
              /* @__PURE__ */ jsx("span", { style: { fontSize: 14, color: "#374151", fontWeight: 500 }, children: bg })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }, children: qrUrl ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("img", { src: qrUrl, alt: "QR Code", style: { width: size > 256 ? 256 : size, height: size > 256 ? 256 : size, borderRadius: 12, border: "1px solid #e5e7eb" } }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: download,
            style: { background: "#2563eb", color: "#fff", border: "none", borderRadius: 999, padding: "14px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" },
            children: "⬇ Download QR Code"
          }
        )
      ] }) : /* @__PURE__ */ jsx("div", { style: { width: 200, height: 200, background: "#f3f4f6", borderRadius: 12, border: "2px dashed #d1d5db", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: "#9ca3af", textAlign: "center", padding: 20 }, children: "Your QR code will appear here" }) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { marginTop: 24, fontSize: 13, color: "#6b7280", textAlign: "center" }, children: "🔒 Your data is never stored. QR codes are generated instantly." })
  ] });
}

const $$QrCode = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Free QR Code Generator Online", "description": "Generate QR codes instantly for free. Enter any URL, text, email or phone number. Download as PNG. No login, no signup needed.", "data-astro-cid-vff3s5k6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="tool-page" data-astro-cid-vff3s5k6> <div class="tool-header" data-astro-cid-vff3s5k6> <a href="/" class="back-link" data-astro-cid-vff3s5k6>← All tools</a> <h1 class="tool-title" data-astro-cid-vff3s5k6>QR Code Generator</h1> <p class="tool-subtitle" data-astro-cid-vff3s5k6>Generate a QR code for any URL, text, email or phone number. Download instantly for free.</p> </div> <div class="ad-slot ad-slot-horizontal" data-astro-cid-vff3s5k6>Advertisement</div> ${renderComponent($$result2, "QRGenerator", QRGenerator, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/urbansound/Downloads/digifixtool/src/components/QRGenerator.jsx", "client:component-export": "default", "data-astro-cid-vff3s5k6": true })} <div class="ad-slot ad-slot-horizontal" style="margin-top: 32px;" data-astro-cid-vff3s5k6>Advertisement</div> <section class="seo-content" data-astro-cid-vff3s5k6> <h2 data-astro-cid-vff3s5k6>How to create a QR code</h2> <p data-astro-cid-vff3s5k6>Type or paste your URL or text, and your QR code generates instantly. Customize the size and colors, then download as a PNG file.</p> <h2 data-astro-cid-vff3s5k6>What can I encode in a QR code?</h2> <p data-astro-cid-vff3s5k6>Anything. Website URLs, plain text, email addresses, phone numbers, Wi-Fi passwords, or any other text.</p> <h2 data-astro-cid-vff3s5k6>Is it free?</h2> <p data-astro-cid-vff3s5k6>Yes, completely free. No account, no watermark, no limits.</p> </section> </div> ` })} `;
}, "/Users/urbansound/Downloads/digifixtool/src/pages/tools/qr-code.astro", void 0);

const $$file = "/Users/urbansound/Downloads/digifixtool/src/pages/tools/qr-code.astro";
const $$url = "/tools/qr-code";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$QrCode,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
