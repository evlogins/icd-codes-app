#!/usr/bin/env node
/**
 * Fetch every ICD-10-CM code from the NLM Clinical Tables API and write
 * them to src/data/icd10cm-codes.json.
 *
 * The API has no "list all" endpoint; it's a prefix search with a max
 * page size around 500. This script does a breadth-first prefix walk:
 * it asks for each single character, and when a request returns the
 * cap it recurses into longer prefixes.  Collected records are
 * deduplicated by code.
 *
 * Usage:
 *   cd frontend
 *   node scripts/fetch-icd-codes.mjs
 *
 * Runs once. Rerun quarterly when CMS publishes updates.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const NLM_BASE = 'https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search';
const MAX = 500;                    // NLM response cap
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789.';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', 'src', 'data', 'icd10cm-codes.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPrefix(prefix) {
  const url = new URL(NLM_BASE);
  url.searchParams.set('sf', 'code,name');
  url.searchParams.set('terms', prefix);
  url.searchParams.set('maxList', String(MAX));
  url.searchParams.set('count', String(MAX));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status} for prefix "${prefix}"`);
  const [total, codes = [], , descs = []] = await res.json();
  const records = codes.map((code, i) => ({ code, description: descs[i] || '' }));
  return { total: total ?? records.length, records };
}

async function walk(prefix, out, depth = 0) {
  process.stdout.write(`\r  prefix=${prefix.padEnd(8)} codes=${out.size}      `);
  const { total, records } = await fetchPrefix(prefix);
  records.forEach((r) => out.set(r.code, r));
  await sleep(60);  // be polite
  if (records.length >= MAX && depth < 5) {
    for (const ch of ALPHABET) {
      await walk(prefix + ch, out, depth + 1);
    }
  }
}

async function main() {
  console.log('Fetching ICD-10-CM codes from NLM Clinical Tables …');
  console.log('This takes ~2–5 minutes. The API has no bulk endpoint; we\'re prefix-walking.\n');

  const out = new Map();
  const roots = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
  for (const p of roots) {
    await walk(p, out);
  }
  process.stdout.write('\n');

  const sorted = Array.from(out.values()).sort((a, b) => a.code.localeCompare(b.code));
  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(sorted, null, 0) + '\n', 'utf8');
  console.log(`\nWrote ${sorted.length.toLocaleString()} codes to ${path.relative(process.cwd(), OUT)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
