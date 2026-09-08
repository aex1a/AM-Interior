# AM Interior — React + Tailwind

This is a React (Vite) + Tailwind CSS conversion of the original static
AM Interior site (index/about/contact/gallery .html + vanilla CSS/JS).

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview   # serve the built dist/ folder locally
```

## Structure

- `src/pages/` — one component per original page (Home, Gallery, About, Contact),
  each with its own CSS Module ported from the original stylesheet.
- `src/components/` — shared `Navigation` and `Footer`, used by every page.
- `src/data/projects.js` — the featured/ongoing/gallery/before-after project data
  that used to be hard-coded HTML.
- `public/assets/images` and `public/assets/fonts` — all original media, referenced
  as absolute paths (e.g. `/assets/images/logo.png`).

## Notes / pre-existing issues carried over from the original site

- A few `@font-face` rules point at font files that were never actually included
  in the original project (`avenirltstd-book.*`, `avenirltstd-black.*`,
  `Schoonheid.woff2`). These are harmless (the browser just falls back to the
  next font in the stack) — add the real files to `public/assets/fonts/` if you
  have them.
- The Google Apps Script contact-form endpoint in `src/pages/Contact.jsx` is the
  same one used in the original `contact.js` — swap it out if you'd rather point
  it somewhere else.

## Styling approach

Tailwind is installed and configured (see `vite.config.js` / `src/index.css`)
and available for any new styling you add. The original design's specific
pixel values, animations, and layout (which relied on `clamp()`, keyframes,
`clip-path`, pseudo-elements, etc.) are preserved as CSS Modules per component
rather than rewritten as Tailwind utility classes, so the site looks and
behaves exactly as it did before the conversion.
