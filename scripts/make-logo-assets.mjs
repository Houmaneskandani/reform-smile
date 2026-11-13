// Builds every logo file the site uses from the two master files in brand/:
//   brand/logo-full.png    emblem + "REFORM" + "DENTAL & IMPLANT CENTER" (transparent background)
//   brand/logo-emblem.png  the emblem alone (transparent background)
// Run it after replacing a master:  node scripts/make-logo-assets.mjs
// (sharp comes with Next.js, so there is nothing extra to install.)
//
// Output, all in public/ unless noted:
//   logo-on-light.png   full logo for white and cream backgrounds (header, structured data)
//   logo-on-dark.png    the same logo for navy backgrounds: the charcoal parts turn white and
//                       the brown line turns light gold, so everything stays readable
//   logo-emblem.png     emblem only
//   logo.png            full logo on a white background (what Google is given as the logo)
//   favicon.ico (also src/app/favicon.ico), apple-touch-icon.png, icon-192.png, icon-512.png
//   og-image.jpg        the preview image when the site is shared (1200x630)
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const at = (...parts) => join(root, ...parts);

const NAVY = { r: 27, g: 58, b: 92 };
const WHITE = [255, 255, 255];
const CREAM = [245, 240, 235];
const LIGHT_GOLD = [217, 190, 138];

/** Trimmed RGBA pixels of a master file. */
async function load(file) {
  const { data, info } = await sharp(at("brand", file))
    .trim({ threshold: 12 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

/** Horizontal bands of artwork (runs of rows that contain any ink), top to bottom. */
function bands({ data, width, height }) {
  const result = [];
  let start = -1;
  for (let y = 0; y <= height; y++) {
    let ink = false;
    if (y < height) {
      for (let x = 0; x < width; x++) {
        if (data[(y * width + x) * 4 + 3] > 24) { ink = true; break; }
      }
    }
    if (ink && start === -1) start = y;
    if (!ink && start !== -1) {
      // Ignore hairline gaps inside a band (anti-aliasing), keep real gaps between bands.
      const previous = result[result.length - 1];
      if (previous && start - previous.end < 12) previous.end = y;
      else result.push({ start, end: y });
      start = -1;
    }
  }
  return result;
}

/** A copy recolored for dark backgrounds. textBands: [{start,end,color}] rows painted one color. */
function forDark(image, textBands) {
  const { data, width, height } = image;
  const out = Buffer.from(data);
  for (let y = 0; y < height; y++) {
    const band = textBands.find((b) => y >= b.start && y < b.end);
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (out[i + 3] === 0) continue;
      if (band) {
        [out[i], out[i + 1], out[i + 2]] = band.color;
        continue;
      }
      // Emblem: only its charcoal stroke (dark and colorless) changes; the bronze stays.
      const max = Math.max(out[i], out[i + 1], out[i + 2]);
      const min = Math.min(out[i], out[i + 1], out[i + 2]);
      if (max < 100 && max - min < 30) [out[i], out[i + 1], out[i + 2]] = CREAM;
    }
  }
  return { data: out, width, height };
}

const png = ({ data, width, height }) => sharp(data, { raw: { width, height, channels: 4 } }).png();
const pngBuffer = (image) => png(image).toBuffer();

/** The image centered on a square canvas with the given padding (fraction of the side). */
async function square(buffer, side, padding, background) {
  const inner = Math.round(side * (1 - padding * 2));
  const art = await sharp(buffer).resize({ width: inner, height: inner, fit: "inside" }).toBuffer();
  return sharp({ create: { width: side, height: side, channels: 4, background } })
    .composite([{ input: art, gravity: "center" }])
    .png()
    .toBuffer();
}

/** A .ico file holding PNG images (every current browser reads these). */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, buffer }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += buffer.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((image) => image.buffer)]);
}

const full = await load("logo-full.png");
const emblem = await load("logo-emblem.png");

const fullBands = bands(full);
if (fullBands.length !== 3) {
  throw new Error(`Expected 3 bands in brand/logo-full.png (emblem, name, line) but found ${fullBands.length}. Adjust this script to the new artwork.`);
}
const [, nameBand, lineBand] = fullBands;
const fullDark = forDark(full, [
  { ...nameBand, color: WHITE },
  { ...lineBand, color: LIGHT_GOLD },
]);

const fullLightPng = await pngBuffer(full);
const fullDarkPng = await pngBuffer(fullDark);
const emblemPng = await pngBuffer(emblem);

await sharp(fullLightPng).resize({ width: 900 }).png({ compressionLevel: 9 }).toFile(at("public", "logo-on-light.png"));
await sharp(fullDarkPng).resize({ width: 900 }).png({ compressionLevel: 9 }).toFile(at("public", "logo-on-dark.png"));
await sharp(emblemPng).resize({ width: 512 }).png({ compressionLevel: 9 }).toFile(at("public", "logo-emblem.png"));

// Google's logo guideline: readable on white. 1200x675 with breathing room.
const onWhite = await sharp(fullLightPng).resize({ width: 960, height: 520, fit: "inside" }).toBuffer();
await sharp({ create: { width: 1200, height: 675, channels: 4, background: "#ffffff" } })
  .composite([{ input: onWhite, gravity: "center" }])
  .png({ compressionLevel: 9 })
  .toFile(at("public", "logo.png"));

// Icons: the emblem on white (phones fill transparent corners with black).
const white = { r: 255, g: 255, b: 255, alpha: 1 };
const clear = { r: 0, g: 0, b: 0, alpha: 0 };
writeFileSync(at("public", "apple-touch-icon.png"), await square(emblemPng, 180, 0.12, white));
writeFileSync(at("public", "icon-192.png"), await square(emblemPng, 192, 0.12, white));
writeFileSync(at("public", "icon-512.png"), await square(emblemPng, 512, 0.12, white));
const favicon = ico(
  await Promise.all([16, 32, 48].map(async (size) => ({ size, buffer: await square(emblemPng, size, 0.02, clear) })))
);
writeFileSync(at("public", "favicon.ico"), favicon);
writeFileSync(at("src", "app", "favicon.ico"), favicon);

// Social preview: the dark logo on navy with a gold rule and one line of text.
const ogLogo = await sharp(fullDarkPng).resize({ height: 330 }).toBuffer();
const ogLogoWidth = (await sharp(ogLogo).metadata()).width;
const caption = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
     <rect x="450" y="478" width="300" height="2" fill="#C4A265"/>
     <text x="600" y="535" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30" fill="#ffffff">Full Arch &amp; All-on-X Dental Implants  |  Free Consultation</text>
   </svg>`
);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: NAVY } })
  .composite([
    { input: ogLogo, left: Math.round((1200 - ogLogoWidth) / 2), top: 95 },
    { input: caption, left: 0, top: 0 },
  ])
  .jpeg({ quality: 88 })
  .toFile(at("public", "og-image.jpg"));

console.log(`make-logo-assets: done (bands at rows ${fullBands.map((b) => `${b.start}-${b.end}`).join(", ")} of ${full.height}).`);
