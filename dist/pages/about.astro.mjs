import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dw9fQcLJ.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_Dj2wG1aG.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "About PixMidas - Free Online Tools", "description": "PixMidas is a collection of free browser-based tools for images, text and more. No login, no upload, everything runs locally.", "data-astro-cid-kh7btl4r": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page" data-astro-cid-kh7btl4r> <h1 data-astro-cid-kh7btl4r>About PixMidas</h1> <section class="intro" data-astro-cid-kh7btl4r> <p class="lead" data-astro-cid-kh7btl4r>PixMidas is a growing collection of free online tools built to make everyday digital tasks simple, fast and private.</p> </section> <section data-astro-cid-kh7btl4r> <h2 data-astro-cid-kh7btl4r>What We Do</h2> <p data-astro-cid-kh7btl4r>We build lightweight, browser-based tools that run locally on your device. Compress images, resize photos, convert file formats, generate QR codes, count words and more, without creating an account or uploading your files to a server.</p> </section> <section data-astro-cid-kh7btl4r> <h2 data-astro-cid-kh7btl4r>Why PixMidas</h2> <p data-astro-cid-kh7btl4r>Most online tools make you sign up, upload your files to their servers, or hit usage limits after a few tries. PixMidas is different. Our tools run directly in your browser, which means they're faster, more private and always free.</p> <p data-astro-cid-kh7btl4r>The name comes from King Midas, who turned everything he touched into gold. We want to do the same for your files.</p> </section> <section data-astro-cid-kh7btl4r> <h2 data-astro-cid-kh7btl4r>Our Tools</h2> <ul class="tool-list" data-astro-cid-kh7btl4r> <li data-astro-cid-kh7btl4r>Free Image Compressor</li> <li data-astro-cid-kh7btl4r>Free Image Resizer</li> <li data-astro-cid-kh7btl4r>Free Image Converter (PNG to JPG and JPG to PNG)</li> <li data-astro-cid-kh7btl4r>Free Image Info Tool</li> <li data-astro-cid-kh7btl4r>Free Images to PDF Tool</li> <li data-astro-cid-kh7btl4r>Social Media Sizes Guide</li> <li data-astro-cid-kh7btl4r>Free Word Counter</li> <li data-astro-cid-kh7btl4r>Free Text Difference Checker</li> <li data-astro-cid-kh7btl4r>Free QR Code Generator</li> </ul> </section> <section data-astro-cid-kh7btl4r> <h2 data-astro-cid-kh7btl4r>Beta</h2> <p data-astro-cid-kh7btl4r>PixMidas is currently in beta. We are actively building and improving. New tools are added regularly. If something doesn't work as expected, we appreciate your patience.</p> </section> <section data-astro-cid-kh7btl4r> <h2 data-astro-cid-kh7btl4r>Contact</h2> <p data-astro-cid-kh7btl4r>For questions, feedback or suggestions, reach us at hello@pixmidas.com</p> </section> </div> ` })} `;
}, "/Users/urbansound/Downloads/digifixtool/src/pages/about.astro", void 0);

const $$file = "/Users/urbansound/Downloads/digifixtool/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
