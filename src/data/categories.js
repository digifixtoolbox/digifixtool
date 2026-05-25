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
    seoContent: `<h2>What are online image tools?</h2>
<p>Online image tools are browser-based utilities that let you edit, convert, compress, and transform images without installing software. Every tool on this page runs entirely in your browser, meaning your photos never leave your device. Whether you need to shrink a photo for email, convert an iPhone HEIC file to JPG, or remove a background using AI, these tools handle it instantly and privately.</p>

<h2>Most popular image tools</h2>
<p>The <a href="/tools/compress-image/">Image Compressor</a> is the most used tool on PixMidas, reducing file sizes by 30–70% without visible quality loss. The <a href="/tools/resize-image/">Image Resizer</a> lets you set exact pixel dimensions for social media, print, or web use. For iPhone users, the <a href="/tools/heic-to-jpg/">HEIC to JPG Converter</a> instantly converts Apple's proprietary format to universally compatible JPG. The <a href="/tools/background-remover/">Background Remover</a> uses AI to isolate subjects from any photo in seconds.</p>

<h2>How to use these tools</h2>
<p>All image tools follow the same simple workflow: drag your image into the drop zone or click to browse, adjust any settings, and download your result. No account required, no watermarks added, and no file size restrictions beyond what your browser can handle. Most operations complete in under five seconds.</p>

<h2>Privacy and security</h2>
<p>Unlike cloud-based tools that upload your photos to remote servers, every image tool on PixMidas processes files locally in your browser using WebAssembly technology. Your images are never transmitted, stored, or analyzed. This makes PixMidas safe for sensitive photos, confidential documents, and personal files.</p>

<h2>Which image tool do you need?</h2>
<p>Use the <a href="/tools/compress-image/">Image Compressor</a> to reduce file size for email or web. Use the <a href="/tools/image-cropper/">Image Cropper</a> to trim or reframe any photo. Use the <a href="/tools/convert-image/">Image Converter</a> to switch between PNG, JPG, and WebP formats. Use the <a href="/tools/exif-remover/">EXIF Data Remover</a> to strip hidden GPS and device metadata before sharing photos online.</p>`,
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
    seoContent: `<h2>What are online PDF tools?</h2>
<p>Online PDF tools let you compress, convert, merge, and create PDF documents directly in your browser without installing Adobe Acrobat or any other software. Every PDF tool on this page processes files locally, meaning your documents never leave your device. This is especially important for confidential contracts, financial documents, and personal records.</p>

<h2>Most popular PDF tools</h2>
<p>The <a href="/tools/compress-pdf/">PDF Compressor</a> reduces PDF file sizes by up to 80% while preserving text, links, and layout. It is ideal for email attachments and portal uploads that enforce file size limits. The <a href="/tools/merge-pdfs/">Merge PDFs</a> tool combines multiple PDF files into one document with drag-and-drop reordering. The <a href="/tools/pdf-to-jpg/">PDF to JPG Converter</a> exports every page as a separate JPG image, useful for presentations and social media. The <a href="/tools/images-to-pdf/">Images to PDF</a> tool combines multiple photos into a single PDF document.</p>

<h2>How to use these tools</h2>
<p>Drag your PDF into the upload area or click to browse from your device. Select your options, process the file, and download the result. No account, no watermark, no daily limits. Files up to 100MB are supported across all PDF tools.</p>

<h2>Privacy and security</h2>
<p>All PDF processing happens locally in your browser. Your documents are never uploaded to any server, never stored, and never shared. This makes PixMidas PDF tools safe for sensitive legal, financial, and personal documents that you would not want to transmit over the internet.</p>

<h2>Which PDF tool do you need?</h2>
<p>Use the <a href="/tools/compress-pdf/">PDF Compressor</a> to shrink file size for email. Use the <a href="/tools/merge-pdfs/">Merge PDFs</a> tool to combine multiple files into one. Use the <a href="/tools/pdf-to-jpg/">PDF to JPG</a> converter to extract pages as images. Use the <a href="/tools/images-to-pdf/">Images to PDF</a> tool to bundle photos into a single document.</p>`,
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
    seoContent: `<h2>What are online text tools?</h2>
<p>Online text tools help you analyze, format, transform, and generate text instantly in your browser. From counting words in an essay to comparing two versions of a document, these utilities handle common writing and editing tasks without installing software. Every tool runs locally, processes text privately, and produces results in real time.</p>

<h2>Most popular text tools</h2>
<p>The <a href="/tools/word-count/">Word Counter</a> instantly counts words, characters, sentences, and paragraphs as you type or paste text. It is widely used by students, writers, and professionals managing content length. The <a href="/tools/case-converter/">Case Converter</a> switches text between uppercase, lowercase, title case, and sentence case in one click. The <a href="/tools/text-diff/">Text Difference Checker</a> compares two texts side by side and highlights every addition, deletion, and change. The <a href="/tools/lorem-ipsum/">Lorem Ipsum Generator</a> creates placeholder text for design mockups and layout prototypes.</p>

<h2>How to use these tools</h2>
<p>Paste or type your text into the input area and results appear instantly. No file uploads, no processing delays, no account required. Text tools work on any device including phones and tablets, making them useful for quick edits on the go.</p>

<h2>Privacy and security</h2>
<p>All text processing happens entirely in your browser. Nothing you type or paste is ever sent to a server, stored, or logged. This makes PixMidas text tools safe for confidential content, private notes, and sensitive documents.</p>

<h2>Which text tool do you need?</h2>
<p>Use the <a href="/tools/word-count/">Word Counter</a> to check length and readability. Use the <a href="/tools/case-converter/">Case Converter</a> to fix capitalization. Use the <a href="/tools/text-diff/">Text Diff Checker</a> to find changes between two versions. Use the <a href="/tools/lorem-ipsum/">Lorem Ipsum Generator</a> to fill layouts with placeholder text.</p>`,
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
    seoContent: `<h2>What are online developer tools?</h2>
<p>Online developer tools are browser-based utilities for common programming, design, and technical tasks. From formatting JSON data to generating QR codes and creating strong passwords, these tools handle the repetitive tasks that developers, designers, and technical users encounter daily. Every tool runs in your browser with no installation, no account, and no data transmission.</p>

<h2>Most popular developer tools</h2>
<p>The <a href="/tools/json-formatter/">JSON Formatter</a> validates, formats, and minifies JSON data instantly, making it essential for API debugging and data inspection. The <a href="/tools/base64/">Base64 Encoder and Decoder</a> converts text and files to Base64 strings and back, commonly used in authentication, email encoding, and data URIs. The <a href="/tools/qr-code/">QR Code Generator</a> creates scannable QR codes for URLs, text, phone numbers, and more. The <a href="/tools/password-generator/">Password Generator</a> creates cryptographically strong passwords with customizable length and character sets.</p>

<h2>How to use these tools</h2>
<p>Paste your input, adjust settings if needed, and copy or download your result. Most developer tools produce output instantly as you type. No account required, no rate limits, no watermarks. Tools work across all modern browsers on desktop and mobile.</p>

<h2>Privacy and security</h2>
<p>All processing happens locally in your browser. JSON data, Base64 strings, passwords, and QR code content are never transmitted to any server. This makes PixMidas developer tools safe for sensitive API keys, authentication tokens, and confidential data structures.</p>

<h2>Which developer tool do you need?</h2>
<p>Use the <a href="/tools/json-formatter/">JSON Formatter</a> to validate and clean API responses. Use the <a href="/tools/base64/">Base64 tool</a> to encode or decode strings. Use the <a href="/tools/qr-code/">QR Code Generator</a> to create scannable codes for any content. Use the <a href="/tools/color-picker/">Color Picker</a> to extract HEX, RGB, and HSL values. Use the <a href="/tools/password-generator/">Password Generator</a> to create strong, secure passwords instantly.</p>`,
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
