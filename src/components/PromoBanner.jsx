import { useState, useEffect, useRef } from "react";

const tools = [
  { slug: "compress-image",     name: "Image Compressor",          icon: "🗜️", bg: "#e8f4fd", category: "Image",     hook: "Need to make an image file smaller?" },
  { slug: "resize-image",       name: "Image Resizer",             icon: "📐",       bg: "#e8f4fd", category: "Image",     hook: "Need to resize a photo?" },
  { slug: "image-cropper",      name: "Image Cropper",             icon: "✂️",       bg: "#e8f4fd", category: "Image",     hook: "Need to crop an image?" },
  { slug: "convert-image",      name: "Image Converter",           icon: "🔄",       bg: "#e8f4fd", category: "Image",     hook: "Need to convert an image format?" },
  { slug: "image-info",         name: "Image Info",                icon: "🔍",       bg: "#e8f4fd", category: "Image",     hook: "Need to check image dimensions?" },
  { slug: "webp-to-jpg",        name: "WebP to JPG",               icon: "🖼️", bg: "#e8f4fd", category: "Image",     hook: "Need to convert WebP to JPG?" },
  { slug: "exif-remover",       name: "EXIF Data Remover",         icon: "🛡️", bg: "#e8f4fd", category: "Image",     hook: "Need to remove hidden photo metadata?" },
  { slug: "background-remover", name: "Background Remover",        icon: "🪄",       bg: "#e8f4fd", category: "Image",     hook: "Need to remove an image background?" },
  { slug: "images-to-pdf",      name: "Images to PDF",             icon: "📄",       bg: "#fef3e8", category: "PDF",       hook: "Need to combine photos into a PDF?" },
  { slug: "pdf-to-jpg",         name: "PDF to JPG",                icon: "📸",       bg: "#fef3e8", category: "PDF",       hook: "Need to convert a PDF to images?" },
  { slug: "merge-pdfs",         name: "Merge PDFs",                icon: "📑",       bg: "#fef3e8", category: "PDF",       hook: "Need to merge multiple PDF files?" },
  { slug: "word-count",         name: "Word Counter",              icon: "📝",       bg: "#e8fdf0", category: "Text",      hook: "Need to count words in your text?" },
  { slug: "case-converter",     name: "Case Converter",            icon: "🔡",       bg: "#e8fdf0", category: "Text",      hook: "Need to change text case?" },
  { slug: "text-diff",          name: "Text Difference Checker",   icon: "🔎",       bg: "#e8fdf0", category: "Text",      hook: "Need to compare two texts?" },
  { slug: "lorem-ipsum",        name: "Lorem Ipsum Generator",     icon: "📃",       bg: "#e8fdf0", category: "Text",      hook: "Need placeholder text for a design?" },
  { slug: "json-formatter",     name: "JSON Formatter",            icon: "📋",       bg: "#ede8fd", category: "Developer", hook: "Need to format or validate JSON?" },
  { slug: "base64",             name: "Base64 Encoder / Decoder",  icon: "💻",       bg: "#ede8fd", category: "Developer", hook: "Need to encode or decode Base64?" },
  { slug: "social-sizes",       name: "Social Media Sizes",        icon: "📱",       bg: "#f0e8fd", category: "Social",    hook: "What size is an Instagram post?" },
  { slug: "qr-code",            name: "QR Code Generator",         icon: "🔳",       bg: "#fef9e3", category: "Utility",   hook: "Need a QR code for your link?" },
  { slug: "password-generator", name: "Password Generator",        icon: "🔐",       bg: "#fef9e3", category: "Utility",   hook: "Need a strong random password?" },
  { slug: "color-picker",       name: "Color Picker",              icon: "🎨",       bg: "#fef9e3", category: "Utility",   hook: "Need HEX or RGB color values?" },
];

const categoryColor = {
  Image:     "#0071e3",
  PDF:       "#f56300",
  Text:      "#16a34a",
  Developer: "#7c3aed",
  Social:    "#7c3aed",
  Utility:   "#d97706",
};

export default function PromoBanner() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);

  useEffect(function () {
    setIdx(Math.floor(Math.random() * tools.length));
  }, []);

  useEffect(function () {
    timerRef.current = setInterval(function () {
      setVisible(false);
      setTimeout(function () {
        setIdx(function (prev) { return (prev + 1) % tools.length; });
        setVisible(true);
      }, 570);
    }, 10000);
    return function () { clearInterval(timerRef.current); };
  }, []);

  var tool = tools[idx];
  var color = categoryColor[tool.category] || "#0071e3";

  return (
    <a
      href={"/tools/" + tool.slug + "/"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        background: tool.bg,
        borderRadius: "16px",
        padding: "20px 28px",
        textDecoration: "none",
        width: "100%",
        boxSizing: "border-box",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.57s ease",
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: "36px", lineHeight: "1", flexShrink: "0" }}>{tool.icon}</span>
      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "16px", fontWeight: "600", color: "#1d1d1f", lineHeight: "1.3" }}>{tool.hook}</span>
        <span style={{ fontSize: "15px", fontWeight: "700", color: color, lineHeight: "1.3" }}>{"Try " + tool.name}</span>
      </span>
    </a>
  );
}
