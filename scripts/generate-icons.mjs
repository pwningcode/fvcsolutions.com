// Generate raster icon assets from the canonical logo SVG.
// Run with: npm run icons
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUBLIC = resolve(ROOT, 'public');
const ICONS = resolve(PUBLIC, 'icons');
mkdirSync(ICONS, { recursive: true });

const BG = '#0d0f0d';
const FILL = '#269C48';
const STROKE = '#176332';

// Inner logo paths shared across renders.
const LOGO_PATHS = `
  <g stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <g fill="${FILL}" stroke="${STROKE}">
      <path d="M31.9,2.2v20.5h0.2L59,32.3l0,20.1V11.6C59,11.6,45.5,6.9,31.9,2.2C31.9,2.2,31.8,2.2,31.9,2.2L5.1,12.3"/>
      <polyline points="5.1,32.5 31.9,42 31.9,42.1 31.9,62.1 31.9,62.2 5.1,52.8 5.1,12.5"/>
    </g>
    <g fill="none" stroke="${STROKE}">
      <line x1="59" y1="52.4" x2="31.9" y2="62.2"/>
      <line x1="31.9" y1="42" x2="58.9" y2="32.3"/>
      <line x1="5.1" y1="32.5" x2="31.9" y2="22.7"/>
    </g>
  </g>
`;

const baseSvg = (transform = '') => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${BG}"/>
  <g transform="${transform}">${LOGO_PATHS}</g>
</svg>
`;

const maskableSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${BG}"/>
  <g transform="translate(12.8,12.8) scale(0.6)">${LOGO_PATHS}</g>
</svg>
`;

async function rasterize(svg, size, outPath) {
  const buf = Buffer.from(svg);
  await sharp(buf, { density: Math.max(384, size * 4) })
    .resize(size, size, { fit: 'contain' })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log(`  ✓ ${outPath} (${size}x${size})`);
}

async function generateOgImage() {
  const W = 1200, H = 630;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="g1" cx="50%" cy="0%" r="80%">
      <stop offset="0%" stop-color="#269C48" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="#269C48" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="80%" cy="100%" r="60%">
      <stop offset="0%" stop-color="#5cc97e" stop-opacity="0.10"/>
      <stop offset="60%" stop-color="#5cc97e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>

  <g transform="translate(96, 184)">
    <g transform="scale(2.8)">${LOGO_PATHS}</g>
  </g>

  <g font-family="'Instrument Serif', Georgia, serif" fill="#f1ede4">
    <text x="320" y="288" font-size="58" font-style="italic" fill="#5cc97e" font-weight="400">FVC</text>
    <text x="320" y="288" font-size="58" font-weight="400" dx="118">Solutions</text>
    <text x="320" y="370" font-size="44" font-weight="400">AI-powered software</text>
    <text x="320" y="424" font-size="44" font-style="italic" fill="#5cc97e" font-weight="400">for small business.</text>
  </g>

  <g font-family="'JetBrains Mono', ui-monospace, monospace" fill="#65635a" font-size="18" letter-spacing="3">
    <text x="96" y="540">FVCSOLUTIONS.COM</text>
    <text x="96" y="568">GREATER COLUMBUS, OH</text>
  </g>
</svg>
`;

  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(resolve(PUBLIC, 'og-image.png'));
  console.log(`  ✓ og-image.png (${W}x${H})`);
}

async function generateFaviconIco() {
  // Compose a 32x32 ICO from PNG data — fall back gracefully if not supported.
  // Most modern browsers respect favicon.svg; we ship favicon.ico for legacy + Google bot.
  const png = await sharp(Buffer.from(baseSvg()), { density: 256 })
    .resize(32, 32)
    .png()
    .toBuffer();
  // Sharp doesn't write .ico natively — we ship the PNG bytes wrapped in ICO container.
  // Minimal ICO: 6-byte header + 16-byte directory entry + PNG data.
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(1, 4); // count

  const dir = Buffer.alloc(16);
  dir.writeUInt8(32, 0);  // width
  dir.writeUInt8(32, 1);  // height
  dir.writeUInt8(0, 2);   // colors (0 = >=256)
  dir.writeUInt8(0, 3);   // reserved
  dir.writeUInt16LE(1, 4); // planes
  dir.writeUInt16LE(32, 6); // bits per pixel
  dir.writeUInt32LE(png.length, 8); // size
  dir.writeUInt32LE(22, 12); // offset (header + dir)

  const ico = Buffer.concat([header, dir, png]);
  writeFileSync(resolve(PUBLIC, 'favicon.ico'), ico);
  console.log(`  ✓ favicon.ico (32x32 PNG inside ICO)`);
}

async function main() {
  console.log('Generating PWA + favicon assets…');

  // Apple touch icon: padded slightly for clean iOS rounding.
  await rasterize(baseSvg(), 180, resolve(ICONS, 'apple-touch-icon.png'));

  // PWA icons.
  await rasterize(baseSvg(), 192, resolve(ICONS, 'icon-192.png'));
  await rasterize(baseSvg(), 512, resolve(ICONS, 'icon-512.png'));

  // Maskable icon — 60% inner area is safe zone per W3C maskable spec.
  await rasterize(maskableSvg(), 512, resolve(ICONS, 'icon-maskable-512.png'));

  await generateFaviconIco();
  await generateOgImage();

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
