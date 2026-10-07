/**
 * Copies the pdf.js worker into /public so the PDF viewer can load it from
 * "/pdf.worker.min.js" instead of having webpack resolve it
 * (`new URL('pdfjs-dist/...', import.meta.url)` breaks the Next.js build).
 *
 * The worker is taken from the same pdfjs-dist copy that react-pdf uses, so the
 * API and worker versions always match. Runs on install, dev and build.
 *
 * Saved with a .js extension so every server sends a JavaScript MIME type
 * (some serve .mjs as application/octet-stream, which browsers reject for workers).
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const relative = path.join('pdfjs-dist', 'build', 'pdf.worker.min.mjs');
const destination = path.join(root, 'public', 'pdf.worker.min.js');

const candidates = [];

// pnpm: react-pdf's own dependencies live next to it inside node_modules/.pnpm
const pnpmDir = path.join(root, 'node_modules', '.pnpm');
if (fs.existsSync(pnpmDir)) {
  for (const entry of fs.readdirSync(pnpmDir)) {
    if (entry.startsWith('react-pdf@')) {
      candidates.push(path.join(pnpmDir, entry, 'node_modules', relative));
    }
  }
}
// npm/yarn: nested copy (if versions conflict), then the hoisted copy
candidates.push(path.join(root, 'node_modules', 'react-pdf', 'node_modules', relative));
candidates.push(path.join(root, 'node_modules', relative));

const source = candidates.find((file) => fs.existsSync(file));

if (!source) {
  console.warn(
    '[copy-pdf-worker] pdfjs-dist worker not found. Run your package manager install first; the CV viewer will fall back to the download link until then.'
  );
  process.exit(0);
}

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.copyFileSync(source, destination);
console.log(`[copy-pdf-worker] ${path.relative(root, source)} -> ${path.relative(root, destination)}`);
