import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dw9fQcLJ.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_Dj2wG1aG.mjs';
/* empty css                                   */
export { renderers } from '../renderers.mjs';

const $$Privacy = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Privacy Policy - PixMidas", "description": "PixMidas privacy policy. Learn how we handle your data and files when using our free online tools.", "data-astro-cid-fb3qbcs3": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page" data-astro-cid-fb3qbcs3> <h1 data-astro-cid-fb3qbcs3>Privacy Policy</h1> <p class="updated" data-astro-cid-fb3qbcs3>Last updated: May 2025</p> <section data-astro-cid-fb3qbcs3> <h2 data-astro-cid-fb3qbcs3>Local Processing</h2> <p data-astro-cid-fb3qbcs3>PixMidas tools are designed to process your files, images and text locally inside your browser. Your content is not uploaded to PixMidas servers. We do not collect, store, review or access the files or text you process through our tools.</p> </section> <section data-astro-cid-fb3qbcs3> <h2 data-astro-cid-fb3qbcs3>What We Collect</h2> <p data-astro-cid-fb3qbcs3>We do not require account creation. We do not collect your name, email address or any personal information to use our tools.</p> <p data-astro-cid-fb3qbcs3>Like most websites, we may collect anonymous usage data through analytics tools such as page views and general traffic patterns. This data does not identify you personally.</p> </section> <section data-astro-cid-fb3qbcs3> <h2 data-astro-cid-fb3qbcs3>Cookies</h2> <p data-astro-cid-fb3qbcs3>PixMidas may use essential cookies to ensure the website functions correctly. We do not use tracking cookies for advertising purposes at this time.</p> </section> <section data-astro-cid-fb3qbcs3> <h2 data-astro-cid-fb3qbcs3>Third Party Services</h2> <p data-astro-cid-fb3qbcs3>PixMidas may display advertisements through third party advertising networks such as Google AdSense. These networks may use cookies to serve relevant ads. Please refer to Google's privacy policy for more information on how they handle data.</p> <p data-astro-cid-fb3qbcs3>The QR Code Generator tool uses the QR Server API to generate QR codes. Your input text is sent to this external API to generate the QR image. Please review their privacy policy at goqr.me if you have concerns about this.</p> </section> <section data-astro-cid-fb3qbcs3> <h2 data-astro-cid-fb3qbcs3>Your Responsibility</h2> <p data-astro-cid-fb3qbcs3>Users are solely responsible for the files, text, links and other content they choose to process with PixMidas tools. Do not process illegal, harmful, abusive or unauthorized material.</p> </section> <section data-astro-cid-fb3qbcs3> <h2 data-astro-cid-fb3qbcs3>Changes</h2> <p data-astro-cid-fb3qbcs3>We may update this privacy policy from time to time. Continued use of PixMidas after changes constitutes acceptance of the updated policy.</p> </section> <section data-astro-cid-fb3qbcs3> <h2 data-astro-cid-fb3qbcs3>Contact</h2> <p data-astro-cid-fb3qbcs3>For privacy related questions, please contact us at privacy@pixmidas.com</p> </section> </div> ` })} `;
}, "/Users/urbansound/Downloads/digifixtool/src/pages/privacy.astro", void 0);

const $$file = "/Users/urbansound/Downloads/digifixtool/src/pages/privacy.astro";
const $$url = "/privacy";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Privacy,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
