// The site's editable content, read from /content/*.json (edited through the website editor).
//
// The files are imported statically, so every page is still prerendered at build time and
// nothing is fetched at runtime. Each file has its own small module (./practice, ./pricing,
// ...) and this file only re-exports them: the bundler follows each import to the one file
// it needs, so a page doesn't download content it never shows (for example the FAQ).
// Types come from schema.ts as type-only imports, so zod never ships to the browser; the
// files themselves are checked against the schemas during the build.

export { practice } from "./practice";
export { pricing } from "./pricing";
export { services } from "./services";
export { faq } from "./faq";
export { testimonials } from "./testimonials";
