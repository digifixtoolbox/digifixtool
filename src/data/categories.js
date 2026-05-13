import { TOOLS } from './tools.js';

export const CATEGORIES = [
  {
    slug: 'image-tools',
    name: 'Image Tools',
    label: 'Image',
    metaTitle: 'Free Online Image Tools – Compress, Resize, Crop & Convert Images',
    metaDescription: 'Free browser-based image tools. Compress JPG and PNG, resize photos to exact dimensions, crop images, convert between formats, remove EXIF data, and check image info. No login, no uploads.',
    h1: 'Free Online Image Tools',
    intro: 'Compress, resize, crop, convert and optimize images directly in your browser. Every image tool runs locally — no files are uploaded to any server.',
    toolSlugs: ['compress-image', 'resize-image', 'image-cropper', 'convert-image', 'image-info', 'webp-to-jpg', 'exif-remover', 'social-sizes'],
  },
  {
    slug: 'pdf-tools',
    name: 'PDF Tools',
    label: 'PDF',
    metaTitle: 'Free Online PDF Tools – Convert, Merge & Create PDF Documents',
    metaDescription: 'Free browser-based PDF tools. Convert PDF pages to JPG images, merge multiple PDF files into one document, and combine images into a PDF. No login, no upload to any server.',
    h1: 'Free Online PDF Tools',
    intro: 'Convert, merge and create PDF documents in your browser. All PDF processing runs locally — your files stay on your device and are never uploaded.',
    toolSlugs: ['images-to-pdf', 'pdf-to-jpg', 'merge-pdfs'],
  },
  {
    slug: 'text-tools',
    name: 'Text Tools',
    label: 'Text',
    metaTitle: 'Free Online Text Tools – Word Count, Case Converter, Text Diff & More',
    metaDescription: 'Free browser-based text tools. Count words and characters, convert text case, compare two texts for differences, and generate lorem ipsum placeholder text.',
    h1: 'Free Online Text Tools',
    intro: 'Count words, convert text case, compare differences and generate placeholder text — lightweight tools for writers, designers and developers.',
    toolSlugs: ['word-count', 'case-converter', 'text-diff', 'lorem-ipsum'],
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    label: 'Developer',
    metaTitle: 'Free Online Developer Tools – JSON Formatter, Base64, QR Code & More',
    metaDescription: 'Free browser-based developer tools. Format and validate JSON, encode and decode Base64 strings, generate QR codes, create strong passwords, and pick colors with HEX, RGB and HSL values.',
    h1: 'Free Online Developer Tools',
    intro: 'Format JSON, encode Base64, generate QR codes, build strong passwords and pick colors — lightweight browser tools for developers and power users.',
    toolSlugs: ['json-formatter', 'base64', 'qr-code', 'password-generator', 'color-picker'],
  },
];

export function getCategoryBySlug(slug) {
  return CATEGORIES.find(c => c.slug === slug) || null;
}

export function getCategoryForTool(toolSlug) {
  return CATEGORIES.find(c => c.toolSlugs.includes(toolSlug)) || null;
}
