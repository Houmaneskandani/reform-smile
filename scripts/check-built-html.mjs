// Post-build check, run by `npm run build` right after `next build` (plain Node, no packages).
// It fails the build when a built page breaks the doctor's name rules from CLAUDE.md:
//   1. "Dr. Ava" may appear only on the About page. Elsewhere the one allowed use is the
//      alt text of her headshot (the homepage About section shows it). Checked in the built
//      pages and in the browser JavaScript (text that only appears after the page loads, such
//      as the chat's replies), where only the About page's own chunks may contain it.
//   2. The surname must never appear anywhere. It is checked by SHA-256 hash only
//      (src/content/blocked-hashes.json), so this script never contains or prints it. Checked
//      in the built server output (pages and server code), the browser JavaScript, src/,
//      content/, public/manifest.json and keystatic.config.ts. The hash itself must not reach
//      the browser JavaScript either (src/content/blocked.ts is server-only).
// It also warns (without failing) while the placeholder phone number is still on the site.
//
// Where the build lands depends on how Next.js runs:
//   - Plain `next build` (this computer): pages in .next/server/app/<page>.html, browser
//     JavaScript in .next/static/chunks/.
//   - Vercel: Next's build adapter (NEXT_ENABLE_ADAPTER=1) writes pages to
//     .next/server/route-cache/APP_PAGE/<hash>/$/<page>.html, and immutable static files
//     (VERCEL_IMMUTABLE_STATIC_FILES_ENABLED=1) put the browser JavaScript in
//     .next/static/immutable/chunks/.
// So this script searches all of .next/server and .next/static, and it fails if it can't find
// the HTML of every prerendered page (.next/prerender-manifest.json) or every JavaScript file
// Next's client manifests list. A new layout can make the build fail here, but it can never make
// this check pass without checking anything. To reproduce Vercel's layout on this computer:
//   vercel pull --yes --environment=preview
//   NEXT_ENABLE_ADAPTER=1 VERCEL_IMMUTABLE_STATIC_FILES_ENABLED=1 vercel build

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const root = fileURLToPath(new URL("..", import.meta.url));
const buildDir = join(root, ".next");
const serverDir = join(buildDir, "server");
const staticDir = join(buildDir, "static");

/** Every file under dir (recursively) whose path passes keep(). */
function walk(dir, keep = () => true) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(path, keep));
    else if (entry.isFile() && keep(path)) files.push(path);
  }
  return files;
}

const show = (path) => relative(root, path);
const toPosix = (path) => path.split(sep).join("/");
const failures = [];
const warnings = [];

for (const dir of [serverDir, staticDir]) {
  if (!existsSync(dir)) {
    console.error(`check-built-html: ${show(dir)} not found. Run \`next build\` first.`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// 1. "Dr. Ava" outside the About page
// ---------------------------------------------------------------------------

/** The route a built HTML file belongs to ("/about"), or null if its location is unknown. */
function pageRoute(file) {
  const path = toPosix(relative(serverDir, file));
  const match =
    path.match(/^app(\/.+)\.html$/) ?? // plain `next build`
    path.match(/^route-cache\/APP_PAGE\/[0-9a-f]+\/\$(\/.+)\.html$/) ?? // Next's build adapter (Vercel)
    path.match(/^pages(\/.+)\.html$/); // the 404.html and 500.html copies
  if (!match) return null;
  return match[1] === "/index" ? "/" : match[1];
}

// Every HTML file under .next/server is checked. A file whose location pageRoute() doesn't
// know is still checked; it just can't count as the About page.
const htmlFiles = walk(serverDir, (path) => path.endsWith(".html"));
const ABOUT_ROUTE = "/about";
const builtRoutes = new Set(htmlFiles.map(pageRoute).filter(Boolean));

// Proof that the search above found the pages: every prerendered App Router page (its data
// route ends in .rsc) must have a built HTML file.
const prerenderManifest = join(buildDir, "prerender-manifest.json");
const prerenderedPages = existsSync(prerenderManifest)
  ? Object.entries(JSON.parse(readFileSync(prerenderManifest, "utf8")).routes ?? {})
      .filter(([, route]) => typeof route?.dataRoute === "string" && route.dataRoute.endsWith(".rsc"))
      .map(([path]) => path)
  : [];
if (prerenderedPages.length === 0) {
  failures.push(
    `Couldn't read the list of prerendered pages from ${show(prerenderManifest)}, so this check can't prove it found the built pages.`
  );
}
for (const route of prerenderedPages) {
  if (!builtRoutes.has(route)) {
    failures.push(
      `Couldn't find the built HTML of ${route} under .next/server, so it wasn't checked. Next.js has probably changed where it writes pages: update pageRoute() in this script.`
    );
  }
}

// The headshot's alt text, as written in an HTML attribute or in the page's React data.
const ALLOWED_HEADSHOT_ALT =
  /Dr\. Ava, DDS (?:—|&#x2014;|\\u2014) Reform Smile (?:&amp;|&|\\u0026) Dental Implant Center/g;
const DOCTOR_NAME = /\bDr\.?\s*Ava\b/gi;

/** Reports every DOCTOR_NAME match in the text, except in the headshot's alt text. */
function checkDoctorName(file, text, where) {
  const cleaned = text.replace(ALLOWED_HEADSHOT_ALT, "");
  for (const match of cleaned.matchAll(DOCTOR_NAME)) {
    const context = cleaned
      .slice(Math.max(0, match.index - 40), match.index + 60)
      .replace(/\s+/g, " ");
    failures.push(`${show(file)}: the doctor's name ${where}: …${context}…`);
  }
}

for (const file of htmlFiles) {
  if (pageRoute(file) === ABOUT_ROUTE) continue;
  checkDoctorName(file, readFileSync(file, "utf8"), "outside the About page");
}

// The browser JavaScript. Next.js lists each page's (and layout's) chunks in its client
// reference manifests; the About page's chunks that no other page or layout uses may contain
// the name. Every other chunk, shared ones included, follows the same rule as the pages.
const ABOUT_ENTRY = /\/\(site\)\/about\/page$/;
/** A chunk as the manifests name it, relative to .next ("static/chunks/abc.js"). */
function normalizeChunk(chunk) {
  const path = chunk.split("?")[0];
  try {
    return decodeURI(path);
  } catch {
    return path;
  }
}
const chunkPath = (file) => toPosix(relative(buildDir, file));
const aboutChunks = new Set();
const otherChunks = new Set();
for (const file of walk(serverDir, (path) => path.endsWith("_client-reference-manifest.js"))) {
  const context = {};
  runInNewContext(readFileSync(file, "utf8"), context, { timeout: 1000 });
  for (const manifest of Object.values(context.__RSC_MANIFEST ?? {})) {
    for (const [entry, chunks] of Object.entries(manifest.entryJSFiles ?? {})) {
      for (const chunk of chunks) {
        (ABOUT_ENTRY.test(entry) ? aboutChunks : otherChunks).add(normalizeChunk(chunk));
      }
    }
  }
}
if (aboutChunks.size === 0) {
  failures.push("Couldn't find the About page's JavaScript in .next/server/**/*_client-reference-manifest.js, so the name check of the browser JavaScript can't run. Update ABOUT_ENTRY in this script.");
}
const browserFiles = walk(staticDir, (path) => path.endsWith(".js"));
// Proof that the search above found the browser JavaScript: every chunk the manifests list
// must be among the files checked.
const browserChunks = new Set(browserFiles.map(chunkPath));
if (browserFiles.length === 0) {
  failures.push(`Found no browser JavaScript under ${show(staticDir)}, so it wasn't checked.`);
}
for (const chunk of new Set([...aboutChunks, ...otherChunks])) {
  if (!browserChunks.has(chunk)) {
    failures.push(
      `.next/${chunk} is listed in Next's client manifests but isn't under ${show(staticDir)}, so it wasn't checked. Next.js has probably changed where it writes browser JavaScript: update browserFiles in this script.`
    );
  }
}
for (const file of browserFiles) {
  const chunk = chunkPath(file);
  if (aboutChunks.has(chunk) && !otherChunks.has(chunk)) continue;
  checkDoctorName(file, readFileSync(file, "utf8"), "in browser JavaScript used outside the About page");
}

// ---------------------------------------------------------------------------
// 2. Blocked words (by SHA-256 hash)
// ---------------------------------------------------------------------------

const blocked = new Set(
  JSON.parse(readFileSync(join(root, "src", "content", "blocked-hashes.json"), "utf8")).sha256
);
const hashCache = new Map();
function isBlocked(word) {
  let hash = hashCache.get(word);
  if (hash === undefined) {
    hash = createHash("sha256").update(word).digest("hex");
    hashCache.set(word, hash);
  }
  return blocked.has(hash);
}

/** Offset of the first blocked word in the text (whole runs of letters and camelCase parts), or -1. */
function findBlockedWord(text) {
  for (const match of text.matchAll(/[A-Za-z]+/g)) {
    const run = match[0];
    if (isBlocked(run.toLowerCase())) return match.index;
    for (const part of run.match(/[A-Z]?[a-z]+|[A-Z]+(?![a-z])/g) ?? []) {
      if (part !== run && isBlocked(part.toLowerCase())) return match.index;
    }
  }
  return -1;
}

const textFile = (path) => /\.(html|rsc|body|meta|txt|js|mjs|cjs|ts|tsx|jsx|json|css|md)$/.test(path);
const hashTargets = [
  ...walk(serverDir, textFile),
  ...browserFiles,
  ...walk(join(root, "src"), textFile),
  ...walk(join(root, "content"), textFile),
  join(root, "public", "manifest.json"),
  join(root, "keystatic.config.ts"),
].filter((path) => existsSync(path) && statSync(path).isFile());

for (const file of hashTargets) {
  const offset = findBlockedWord(readFileSync(file, "utf8"));
  if (offset !== -1) {
    failures.push(
      `${show(file)}: contains a blocked word (src/content/blocked-hashes.json) at character ${offset}.`
    );
  }
}

// A hash in the browser JavaScript would let anyone try names against it. Only server code
// (src/content/blocked.ts, imported by validate.ts) may hold the hashes.
for (const file of browserFiles) {
  const text = readFileSync(file, "utf8");
  if ([...blocked].some((hash) => text.includes(hash))) {
    failures.push(
      `${show(file)}: contains a blocked-word hash. Import the hashes only from server code (src/content/blocked.ts), never from code the browser loads.`
    );
  }
}

// ---------------------------------------------------------------------------
// 3. Placeholder phone number (warning only)
// ---------------------------------------------------------------------------

const placeholderPhonePages = new Set(
  htmlFiles
    .filter((file) => /\(555\)\s?\d{3}-\d{4}|tel:555\d{7}/.test(readFileSync(file, "utf8")))
    .map((file) => pageRoute(file) ?? show(file))
);
if (placeholderPhonePages.size > 0) {
  warnings.push(
    `The placeholder phone number (555) is still on ${placeholderPhonePages.size} built page(s). Replace it in content/practice.json before launch.`
  );
}

// ---------------------------------------------------------------------------

for (const warning of warnings) console.warn(`check-built-html: warning: ${warning}`);
if (failures.length > 0) {
  console.error(`check-built-html: FAILED (${failures.length} problem(s)):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(
  `check-built-html: OK (${builtRoutes.size} built pages in ${htmlFiles.length} HTML files and ${browserFiles.length} browser JavaScript files checked for the doctor's name; all ${prerenderedPages.length} prerendered pages found; ${hashTargets.length} files checked for blocked words).`
);
