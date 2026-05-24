import { TOOLS } from './tools.js';

export const CATEGORIES = [
  {
    slug: 'image-tools',
    name: 'Image Tools',
    label: 'Image',
    metaTitle: 'Free Online Image Tools – Compress, Resize, Crop & Convert Images',
    metaDescription: 'Free browser-based image tools. Compress JPG and PNG, resize photos to exact dimensions, crop images, convert between formats, remove EXIF data, and check image info. No login, no uploads.',
    h1: 'Free Online Image Tools',
    intro: 'Compress, resize, crop, convert and optimize images directly in your browser. Every image tool runs locally. No files are uploaded to any server.',
    seoContent: 'PixMidas image tools cover the full range of everyday image editing tasks — all running locally in your browser without any server uploads. Compress JPG, PNG and WebP images to reduce file size without visible quality loss. Resize photos to exact pixel dimensions for email, web, or print. Crop any image by drawing a selection and choosing an aspect ratio. Convert between PNG, JPG, WebP and HEIC formats in seconds. Remove backgrounds from photos using on-device AI. Strip EXIF and GPS metadata before sharing images online. Create animated GIFs from a sequence of still frames. Add text or logo watermarks with full control over position and opacity. Extract the dominant colors from any image for use in design systems and branding. Convert SVG vector files to high-resolution PNG for platforms that require raster images. Generate complete favicon packages in all required sizes for any website.',
    faq: [
      { q: 'Are my image files uploaded to a server?', a: 'Most PixMidas image tools run entirely in your browser using the HTML5 Canvas API and File API. Your images are processed on your own device and never transmitted to any external server. This is true for tools including the image compressor, resizer, cropper, converter, EXIF remover, watermark tool, color palette generator, SVG to PNG converter, and favicon generator.' },
      { q: 'What image formats are supported?', a: 'Most tools accept JPG, JPEG, PNG and WebP input. The HEIC to JPG converter accepts Apple HEIC/HEIF files. The SVG to PNG converter accepts SVG files. Output formats are typically JPG or PNG depending on the tool. The image converter lets you choose between JPG, PNG, and WebP output explicitly.' },
      { q: 'Do I need to create an account or install software?', a: 'No account, no installation, and no download required. All image tools run in any modern web browser on desktop or mobile. Open the tool, upload your image, and download the result — no signup and no limits.' },
    ],
    toolSlugs: ['compress-image', 'resize-image', 'heic-to-jpg', 'background-remover', 'image-cropper', 'convert-image', 'webp-to-jpg', 'passport-photo-maker', 'exif-remover', 'image-info', 'image-to-text', 'gif-maker', 'image-watermark', 'color-palette', 'svg-to-png', 'favicon-generator'],
  },
  {
    slug: 'pdf-tools',
    name: 'PDF Tools',
    label: 'PDF',
    metaTitle: 'Free Online PDF Tools – Compress, Convert, Merge & Create PDF Documents',
    metaDescription: 'Free browser-based PDF tools. Compress PDF files, convert PDF pages to JPG images, merge multiple PDF files into one document, and combine images into a PDF. No login, no upload to any server.',
    h1: 'Free Online PDF Tools',
    intro: 'Convert, merge and create PDF documents in your browser. All PDF processing runs locally. Your files stay on your device and are never uploaded.',
    seoContent: 'PixMidas PDF tools handle the most common document tasks without desktop software or cloud services. Compress PDF files to shrink attachment size for email, form submissions, and storage — useful when upload limits reject your original file. Merge multiple PDF files into a single document for reports, presentations, or combined records. Convert every page of a PDF to individual JPG images for use in presentations, websites, or documentation. Combine a set of photos or scanned images into a single PDF document for sharing or archiving. All tools process your documents locally in the browser — your PDF files are never sent to any server.',
    faq: [
      { q: 'Are my PDF files uploaded to a server?', a: 'No. PDF processing on PixMidas runs locally in your browser using PDF.js and related browser-based libraries. Your documents are processed on your own device and never transmitted to any external server.' },
      { q: 'What is the maximum PDF file size supported?', a: 'There is no enforced server-side limit since all processing is local. Practical limits depend on your device memory and browser. Most tools handle files up to several hundred megabytes on modern devices. Very large PDFs may be slow to process on older hardware.' },
      { q: 'Can I merge more than two PDFs at once?', a: 'Yes. The Merge PDFs tool accepts multiple files and combines them into a single output document. You can reorder the files before merging to control the page sequence in the final PDF.' },
    ],
    toolSlugs: ['compress-pdf', 'merge-pdfs', 'pdf-to-jpg', 'images-to-pdf'],
  },
  {
    slug: 'text-tools',
    name: 'Text Tools',
    label: 'Text',
    metaTitle: 'Free Online Text Tools – Word Count, Case Converter, Text Diff & More',
    metaDescription: 'Free browser-based text tools. Count words and characters, convert text case, compare two texts for differences, and generate lorem ipsum placeholder text.',
    h1: 'Free Online Text Tools',
    intro: 'Count words, convert text case, compare differences and generate placeholder text. Lightweight tools for writers, designers and developers.',
    seoContent: 'PixMidas text tools are instant-response utilities for writers, editors, developers, and designers. The word counter tracks words, characters, sentences, paragraphs, and estimated reading time in real time as you paste or type. The case converter transforms text between uppercase, lowercase, title case, sentence case, camelCase, snake_case, and kebab-case with a single click — useful for formatting copy and normalizing variable names. The text diff tool compares two text versions side by side and highlights every added, removed, or changed character — practical for proofreading, comparing document versions, and reviewing code changes. The lorem ipsum generator creates any number of placeholder paragraphs, sentences, or words for use in wireframes, mockups, and layout designs.',
    faq: [
      { q: 'Is any text I enter sent to a server?', a: 'No. All text tools process your input entirely in the browser using JavaScript. Nothing you type or paste is transmitted to any server. Your text stays entirely on your device.' },
      { q: 'What case formats does the case converter support?', a: 'The case converter supports uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, kebab-case, and alternating case. Each conversion applies to the entire input text at once.' },
      { q: 'Can I compare very long texts with the text diff tool?', a: 'Yes. The text diff tool runs in the browser and can handle long documents. Performance remains fast for texts up to tens of thousands of words on modern devices. There is no file size or character limit enforced.' },
    ],
    toolSlugs: ['word-count', 'case-converter', 'text-diff', 'lorem-ipsum'],
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    label: 'Developer',
    metaTitle: 'Free Online Developer Tools – JSON Formatter, Base64, QR Code, Password Generator',
    metaDescription: 'Free browser-based developer tools. Format and validate JSON, encode and decode Base64 strings, generate QR codes, create strong passwords, and pick colors with HEX, RGB and HSL values.',
    h1: 'Free Online Developer Tools',
    intro: 'Format JSON, encode Base64, generate QR codes, build strong passwords and pick colors. Lightweight browser tools for developers and power users.',
    seoContent: 'PixMidas developer tools speed up common tasks in web development, API debugging, security, and design. The JSON formatter parses, validates, and pretty-prints JSON data with syntax highlighting — paste raw API responses or config files and see them structured and readable immediately. The Base64 encoder and decoder converts plain text to Base64 and back, useful for embedding data URIs, encoding email content, or decoding auth tokens. The QR code generator creates scannable QR codes for any URL, text, phone number, email, or contact card — downloadable as PNG. The password generator produces cryptographically random passwords with custom length and character set rules. The color picker lets you select colors visually or enter HEX, RGB, or HSL values and instantly see all three formats — useful for matching CSS colors, checking accessibility contrast, and building design tokens.',
    faq: [
      { q: 'Does the JSON formatter send my data anywhere?', a: 'No. JSON parsing and formatting runs entirely in your browser using JavaScript\'s built-in JSON.parse(). Your data is never sent to any server. This makes it safe to paste API responses, config files, and private data for formatting.' },
      { q: 'What formats does the QR code generator support?', a: 'The QR code generator creates codes for plain text, URLs, email addresses, phone numbers, and SMS messages. The output is a PNG image you can download and use in print or digital materials.' },
      { q: 'How secure are passwords generated by the password generator?', a: 'The password generator uses the browser\'s built-in Web Crypto API (crypto.getRandomValues) for cryptographically secure randomness. Generated passwords are not transmitted anywhere and exist only in your browser session.' },
    ],
    toolSlugs: ['json-formatter', 'base64', 'qr-code', 'password-generator', 'color-picker'],
  },
];

export function getCategoryBySlug(slug) {
  return CATEGORIES.find(c => c.slug === slug) || null;
}

export function getCategoryForTool(toolSlug) {
  return CATEGORIES.find(c => c.toolSlugs.includes(toolSlug)) || null;
}
