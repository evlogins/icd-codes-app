#!/usr/bin/env node
/**
 * Generate sitemap.xml (and a sitemap index if needed) after
 * vite-react-ssg has produced build/.
 *
 * - Reads src/data/icd10cm-codes.json for the list of code URLs.
 * - Adds / (home) as the top-priority entry. Does NOT add /search
 *   (noindexed).
 * - <= 50,000 URLs total → single build/sitemap.xml.
 * - > 50,000 URLs → build/sitemap.xml becomes a sitemap index and
 *   the actual URLs chunk into build/sitemap-1.xml, sitemap-2.xml,…
 *
 * Run via `npm run build` (wired after vite-react-ssg build).
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA = path.resolve(ROOT, 'src/data/icd10cm-codes.json');
const OUT = path.resolve(ROOT, 'build');
const SITE = (process.env.VITE_SITE_URL || 'https://icd-codes-git.pages.dev').replace(/\/$/, '');
const TODAY = new Date().toISOString().slice(0, 10);
const CHUNK = 50000;

const xmlEscape = (s) => String(s).replace(/[<>&'"]/g, (c) =>
  ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c])
);

function urlEntry({ loc, priority = '0.7', changefreq = 'monthly', lastmod = TODAY }) {
  return (
    '  <url>\n' +
    `    <loc>${xmlEscape(loc)}</loc>\n` +
    `    <lastmod>${lastmod}</lastmod>\n` +
    `    <changefreq>${changefreq}</changefreq>\n` +
    `    <priority>${priority}</priority>\n` +
    '  </url>'
  );
}

function urlsetDoc(entries) {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.join('\n') +
    '\n</urlset>\n'
  );
}

function indexDoc(sitemapFiles) {
  const items = sitemapFiles.map((f) =>
    '  <sitemap>\n' +
    `    <loc>${SITE}/${f}</loc>\n` +
    `    <lastmod>${TODAY}</lastmod>\n` +
    '  </sitemap>'
  );
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    items.join('\n') +
    '\n</sitemapindex>\n'
  );
}

async function main() {
  const codes = JSON.parse(await fs.readFile(DATA, 'utf8'));

  const entries = [
    urlEntry({ loc: `${SITE}/`, priority: '1.0', changefreq: 'weekly' }),
    ...codes.map((c) =>
      urlEntry({ loc: `${SITE}/code/${encodeURIComponent(c.code)}` })
    ),
  ];

  await fs.mkdir(OUT, { recursive: true });

  if (entries.length <= CHUNK) {
    await fs.writeFile(path.join(OUT, 'sitemap.xml'), urlsetDoc(entries), 'utf8');
    console.log(`sitemap.xml: ${entries.length} URLs (single file)`);
    return;
  }

  const chunkFiles = [];
  for (let i = 0, n = 1; i < entries.length; i += CHUNK, n += 1) {
    const chunk = entries.slice(i, i + CHUNK);
    const name = `sitemap-${n}.xml`;
    await fs.writeFile(path.join(OUT, name), urlsetDoc(chunk), 'utf8');
    chunkFiles.push(name);
  }
  await fs.writeFile(path.join(OUT, 'sitemap.xml'), indexDoc(chunkFiles), 'utf8');
  console.log(`sitemap.xml (index) + ${chunkFiles.length} chunks, ${entries.length} URLs total`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
