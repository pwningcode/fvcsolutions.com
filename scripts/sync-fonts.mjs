// Re-sync Latin font subsets from @fontsource into public/fonts/.
// Run after upgrading @fontsource packages: npm run fonts
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'public/fonts');
mkdirSync(OUT, { recursive: true });

const FILES = [
  ['@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2', 'manrope-latin-wght.woff2'],
  ['@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2', 'instrument-serif-latin-400.woff2'],
  ['@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2', 'instrument-serif-latin-400-italic.woff2'],
  ['@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2', 'jetbrains-mono-latin-wght.woff2'],
];

for (const [src, dst] of FILES) {
  const from = resolve(ROOT, 'node_modules', src);
  const to = resolve(OUT, dst);
  copyFileSync(from, to);
  console.log(`  ✓ ${dst}`);
}

console.log('Latin font subsets synced.');
