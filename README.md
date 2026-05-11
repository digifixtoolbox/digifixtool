# DigifixTool

Free online tools. No login. No upload. Everything runs in the browser.

## Stack
- **Framework**: Astro 4 + React (for interactive tool components)
- **Hosting**: Cloudflare Pages (free)
- **Repo**: GitHub

---

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:4321

---

## Adding a New Tool

1. Create the React component in `src/components/YourTool.jsx`
2. Create the page in `src/pages/tools/your-tool-slug.astro`
3. Add it to the tools array in `src/pages/index.astro`
4. Push to GitHub — Cloudflare deploys automatically

---

## Cloudflare Pages Setup

1. Go to Cloudflare Pages > Create a project
2. Connect your GitHub repo
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy

---

## Adding Google AdSense

When your site is approved:
1. Open `src/layouts/Layout.astro`
2. Uncomment the AdSense script tag and add your publisher ID
3. Replace `.ad-slot` divs with real AdSense ad units

---

## Tool Roadmap

- [x] Image Compressor (`/tools/compress-image`)
- [ ] Image Resizer (`/tools/resize-image`)
- [ ] PNG to JPG (`/tools/png-to-jpg`)
- [ ] Word Counter (`/tools/word-count`)
- [ ] Base64 Encoder (`/tools/base64`)
- [ ] PDF to JPG (`/tools/pdf-to-jpg`)
- [ ] Color Picker (`/tools/color-picker`)
- [ ] Unit Converter (`/tools/unit-converter`)
