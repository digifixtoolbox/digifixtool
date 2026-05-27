export const BANNER_TOOLS = [
  // Image tools
  { slug: "compress-image",       name: "Image Compressor",          iconClass: "file-zip",        iconPalette: "blue",   category: "Image",     hook: "Need to make an image file smaller?" },
  { slug: "background-remover",   name: "Background Remover",        iconClass: "wand",            iconPalette: "blue",   category: "Image",     hook: "Need to remove an image background?" },
  { slug: "heic-to-jpg",          name: "HEIC to JPG",               iconClass: "refresh",         iconPalette: "blue",   category: "Image",     hook: "Need to open an iPhone HEIC photo?" },
  { slug: "resize-image",         name: "Image Resizer",             iconClass: "resize",          iconPalette: "blue",   category: "Image",     hook: "Need to resize a photo to exact dimensions?" },
  { slug: "image-cropper",        name: "Image Cropper",             iconClass: "crop",            iconPalette: "blue",   category: "Image",     hook: "Need to crop an image?" },
  { slug: "convert-image",        name: "Image Converter",           iconClass: "arrows-exchange", iconPalette: "blue",   category: "Image",     hook: "Need to convert an image format?" },
  { slug: "webp-to-jpg",          name: "WebP to JPG",               iconClass: "photo",           iconPalette: "blue",   category: "Image",     hook: "Need to convert WebP to JPG?" },
  { slug: "svg-to-png",           name: "SVG to PNG",                iconClass: "vector",          iconPalette: "blue",   category: "Image",     hook: "Need to convert an SVG file to PNG?" },
  { slug: "passport-photo-maker", name: "Passport Photo Maker",      iconClass: "id",              iconPalette: "blue",   category: "Image",     hook: "Need a compliant passport photo?" },
  { slug: "image-watermark",      name: "Image Watermark",           iconClass: "writing",         iconPalette: "blue",   category: "Image",     hook: "Need to add a watermark to your image?" },
  { slug: "exif-remover",         name: "EXIF Data Remover",         iconClass: "shield-off",      iconPalette: "blue",   category: "Image",     hook: "Need to remove hidden photo metadata?" },
  { slug: "favicon-generator",    name: "Favicon Generator",         iconClass: "browser",         iconPalette: "blue",   category: "Image",     hook: "Need a favicon for your website?" },
  { slug: "gif-maker",            name: "GIF Maker",                 iconClass: "player-play",     iconPalette: "blue",   category: "Image",     hook: "Need to create an animated GIF?" },
  { slug: "image-to-text",        name: "Image to Text (OCR)",       iconClass: "scan",            iconPalette: "blue",   category: "Image",     hook: "Need to extract text from a photo?" },
  { slug: "color-palette",        name: "Color Palette Generator",   iconClass: "palette",         iconPalette: "blue",   category: "Image",     hook: "Need to extract colors from an image?" },
  { slug: "image-info",           name: "Image Info",                iconClass: "info-circle",     iconPalette: "blue",   category: "Image",     hook: "Need to check image dimensions?" },
  // PDF tools
  { slug: "compress-pdf",         name: "PDF Compressor",            iconClass: "file-minus",      iconPalette: "coral",  category: "PDF",       hook: "Need to shrink a PDF for email?" },
  { slug: "merge-pdfs",           name: "Merge PDFs",                iconClass: "files",           iconPalette: "coral",  category: "PDF",       hook: "Need to merge multiple PDF files?" },
  { slug: "pdf-to-jpg",           name: "PDF to JPG",                iconClass: "file-export",     iconPalette: "coral",  category: "PDF",       hook: "Need to convert a PDF to images?" },
  { slug: "images-to-pdf",        name: "Images to PDF",             iconClass: "file-import",     iconPalette: "coral",  category: "PDF",       hook: "Need to combine photos into a PDF?" },
  // Text tools
  { slug: "word-count",           name: "Word Counter",              iconClass: "123",             iconPalette: "green",  category: "Text",      hook: "Need to count words in your text?" },
  { slug: "case-converter",       name: "Case Converter",            iconClass: "letter-case",     iconPalette: "green",  category: "Text",      hook: "Need to change text case?" },
  { slug: "lorem-ipsum",          name: "Lorem Ipsum Generator",     iconClass: "text-size",       iconPalette: "green",  category: "Text",      hook: "Need placeholder text for a design?" },
  { slug: "text-diff",            name: "Text Difference Checker",   iconClass: "file-diff",       iconPalette: "green",  category: "Text",      hook: "Need to compare two texts?" },
  // Developer tools
  { slug: "json-formatter",       name: "JSON Formatter",            iconClass: "code",            iconPalette: "amber",  category: "Developer", hook: "Need to format or validate JSON?" },
  { slug: "base64",               name: "Base64 Encoder / Decoder",  iconClass: "lock",            iconPalette: "amber",  category: "Developer", hook: "Need to encode or decode Base64?" },
  // Social tools
  { slug: "social-sizes",         name: "Social Media Sizes",        iconClass: "device-mobile",   iconPalette: "pink",   category: "Social",    hook: "What size is an Instagram post?" },
  // Utility tools
  { slug: "qr-code",              name: "QR Code Generator",         iconClass: "qrcode",          iconPalette: "purple", category: "Utility",   hook: "Need a QR code for your link?" },
  { slug: "color-picker",         name: "Color Picker",              iconClass: "color-picker",    iconPalette: "purple", category: "Utility",   hook: "Need HEX or RGB color values?" },
  { slug: "password-generator",   name: "Password Generator",        iconClass: "key",             iconPalette: "purple", category: "Utility",   hook: "Need a strong random password?" },
  // Special banners
  {
    slug: null,
    name: "Suggest a Tool",
    iconClass: "bulb",
    iconPalette: "amber",
    category: "special-suggest",
    hook: "Didn't find the tool you need?",
    cta: "Suggest what we should build next →",
    href: "mailto:hello@pixmidas.com?subject=Tool Suggestion for PixMidas",
  },
  {
    slug: null,
    name: "Report a Bug",
    iconClass: "bug",
    iconPalette: "coral",
    category: "special-bug",
    hook: "Found a bug in any of our tools?",
    cta: "Let us know and we'll fix it! →",
    href: "/report-bug/",
  },
];

export const categoryColor = {
  Image:            "var(--upload-btn-bg)",
  PDF:              "#f56300",
  Text:             "#16a34a",
  Developer:        "#7c3aed",
  Social:           "#A0306A",
  Utility:          "#5746AF",
  "special-suggest": "#b45309",
  "special-bug":     "#dc2626",
};
