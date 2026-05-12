import { useState, useEffect } from "react";

const banners = [
  { icon: "\u{1F5DC}\uFE0F", text: "Need a smaller image file?", cta: "Try Image Compressor", href: "/tools/compress-image/", bg: "#e8f4fd", color: "#0071e3" },
  { icon: "\u{1F4D0}", text: "Need to resize a photo?", cta: "Try Image Resizer", href: "/tools/resize-image/", bg: "#e8f4fd", color: "#0071e3" },
  { icon: "\u{1F504}", text: "Need to convert PNG to JPG?", cta: "Try Image Converter", href: "/tools/convert-image/", bg: "#e8f4fd", color: "#0071e3" },
  { icon: "\u{1F50D}", text: "Need to check image dimensions?", cta: "Try Image Info", href: "/tools/image-info/", bg: "#e8f4fd", color: "#0071e3" },
  { icon: "\u{1F4C4}", text: "Need to send photos as PDF?", cta: "Try Images to PDF", href: "/tools/images-to-pdf/", bg: "#fef3e8", color: "#f56300" },
  { icon: "\u{1F4F1}", text: "What size is an Instagram post?", cta: "Check Social Media Sizes", href: "/tools/social-sizes/", bg: "#f0e8fd", color: "#7c3aed" },
  { icon: "\u{1F4DD}", text: "Need to count words in text?", cta: "Try Word Counter", href: "/tools/word-count/", bg: "#e8fdf0", color: "#16a34a" },
  { icon: "\u{1F50E}", text: "Need to compare two texts?", cta: "Try Text Diff Checker", href: "/tools/text-diff/", bg: "#e8fdf0", color: "#16a34a" },
  { icon: "\u{1F533}", text: "Need a QR code for your link?", cta: "Try QR Generator", href: "/tools/qr-code/", bg: "#fdf0e8", color: "#d97706" },
  { icon: "\u{1F510}", text: "Need a strong password?", cta: "Try Password Generator", href: "/tools/password-generator/", bg: "#f0e8fd", color: "#7c3aed" },
  { icon: "\u{1F521}", text: "Need to change text case?", cta: "Try Case Converter", href: "/tools/case-converter/", bg: "#e8fdf0", color: "#16a34a" },
  { icon: "\u{2702}\uFE0F", text: "Need to crop an image?", cta: "Try Image Cropper", href: "/tools/image-cropper/", bg: "#e8f4fd", color: "#0071e3" },
  { icon: "\u{1F5BC}\uFE0F", text: "Need to convert WebP to JPG?", cta: "Try WebP to JPG", href: "/tools/webp-to-jpg/", bg: "#e8f4fd", color: "#0071e3" },
  { icon: "\u{1F3A8}", text: "Need HEX or RGB color values?", cta: "Try Color Picker", href: "/tools/color-picker/", bg: "#fef3e8", color: "#f56300" },
  { icon: "\u{1F4C4}", text: "Need to convert a PDF to images?", cta: "Try PDF to JPG", href: "/tools/pdf-to-jpg/", bg: "#fef3e8", color: "#f56300" },
  { icon: "\u{1F4D1}", text: "Need to combine PDF files?", cta: "Try Merge PDFs", href: "/tools/merge-pdfs/", bg: "#fef3e8", color: "#f56300" },
];

export default function PromoBanner() {
  const [idx, setIdx] = useState(0);
  useEffect(function() {
    setIdx(Math.floor(Math.random() * banners.length));
  }, []);
  var b = banners[idx];
  return (
    <a href={b.href} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", background: b.bg, borderRadius: "16px", padding: "20px 28px", textDecoration: "none", width: "100%" }}>
      <span style={{ fontSize: "36px", lineHeight: "1", flexShrink: "0" }}>{b.icon}</span>
      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "16px", fontWeight: "600", color: "#1d1d1f", lineHeight: "1.3" }}>{b.text}</span>
        <span style={{ fontSize: "15px", fontWeight: "700", color: b.color, lineHeight: "1.3" }}>{b.cta}</span>
      </span>
    </a>
  );
}