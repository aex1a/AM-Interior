// Vite's `base` config (see vite.config.js) is automatically applied to
// imported assets, CSS url()s, and the index.html build output — but NOT to
// plain string literals like <img src="/assets/images/logo.png" />. Since this
// project deploys to GitHub Pages under a subpath (/AMInterior/), any hardcoded
// "/assets/..." string needs that prefix added manually, or the image 404s.
//
// Wrap any hardcoded asset path with withBase() and it'll resolve correctly
// both locally (base "/") and on GitHub Pages (base "/AMInterior/").
export function withBase(path) {
  const base = import.meta.env.BASE_URL // e.g. '/' locally, '/AMInterior/' in prod
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
}
