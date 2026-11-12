// Post-build check, run by `npm run build` right after `next build` (plain Node, no packages).
// It fails the build when a built page breaks the doctor's name rules from CLAUDE.md:
//   1. "Dr. Ava" may appear only on the About page. Elsewhere the one allowed use is the
//      alt text of her headshot (the homepage About section shows it). Checked in the built
//      pages and in the browser JavaScript (text that only appears after the page loads, such
//      as the chat's replies), where only the About page's own chunks may contain it.
//   2. The surname must never appear anywhere. It is checked by SHA-256 hash only
//      (src/content/blocked-hashes.json), so this script never contains or prints it. Checked
//      in the built pages, the browser JavaScript, src/, content/, public/manifest.json and
//      keystatic.config.ts. The hash itself must not reach the browser JavaScript either
//      (src/content/blocked.ts is server-only).
// It also warns (without failing) while the placeholder phone number is still on the site.

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const root = fileURLToPath(new URL("..", import.meta.url));
const buildDir = join(root, ".next");
const builtPages = join(buildDir, "server", "app");
const browserChunks = join(buildDir, "static", "chunks");

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
const failures = [];
const warnings = [];

if (!existsSync(builtPages)) {
  console.error(`check-built-html: ${show(builtPages)} not found. Run \`next build\` first.`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 1. "Dr. Ava" outside the About page
// ---------------------------------------------------------------------------

const htmlFiles = walk(builtPages, (path) => path.endsWith(".html"));
const ABOUT_PAGE = "about.html";
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
  if (relative(builtPages, file) === ABOUT_PAGE) continue;
  checkDoctorName(file, readFileSync(file, "utf8"), "outside the About page");
}

// The browser JavaScript. Next.js lists each page's (and layout's) chunks in its client
// reference manifests; the About page's chunks that no other page or layout uses may contain
// the name. Every other chunk, shared ones included, follows the same rule as the pages.
const ABOUT_ENTRY = /\/\(site\)\/about\/page$/;
const chunkPath = (file) => relative(buildDir, file).split(sep).join("/");
const aboutChunks = new Set();
const otherChunks = new Set();
for (const file of walk(builtPages, (path) => path.endsWith("_client-reference-manifest.js"))) {
  const context = {};
  runInNewContext(readFileSync(file, "utf8"), context, { timeout: 1000 });
  for (const manifest of Object.values(context.__RSC_MANIFEST ?? {})) {
    for (const [entry, chunks] of Object.entries(manifest.entryJSFiles ?? {})) {
      for (const chunk of chunks) (ABOUT_ENTRY.test(entry) ? aboutChunks : otherChunks).add(chunk);
    }
  }
}
if (aboutChunks.size === 0) {
  failures.push("Couldn't find the About page's JavaScript in .next/server/app/**/*_client-reference-manifest.js, so the name check of the browser JavaScript can't run. Update ABOUT_ENTRY in this script.");
}
const browserFiles = walk(browserChunks, (path) => path.endsWith(".js"));
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

const textFile = (path) => /\.(html|rsc|body|txt|js|mjs|cjs|ts|tsx|jsx|json|css|md)$/.test(path);
const hashTargets = [
  ...walk(builtPages, textFile),
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

const placeholderPhonePages = htmlFiles.filter((file) =>
  /\(555\)\s?\d{3}-\d{4}|tel:555\d{7}/.test(readFileSync(file, "utf8"))
);
if (placeholderPhonePages.length > 0) {
  warnings.push(
    `The placeholder phone number (555) is still on ${placeholderPhonePages.length} built page(s). Replace it in content/practice.json before launch.`
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
  `check-built-html: OK (${htmlFiles.length} built pages and ${browserFiles.length} browser chunks checked for the doctor's name; ${hashTargets.length} files checked for blocked words).`
);
