import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const distDir = join(root, 'dist');
const headers = await readFile(join(root, 'public/_headers'), 'utf8');
const cspLine = headers.split('\n').find((line) => line.includes('Content-Security-Policy:'));

if (!cspLine) {
  throw new Error('Content-Security-Policy header not found in public/_headers');
}

if (cspLine.includes("script-src 'self' 'unsafe-inline'")) {
  throw new Error("script-src still allows 'unsafe-inline'");
}

const allowedHashes = new Set(
  [...cspLine.matchAll(/'sha256-[^']+'/g)].map(([hash]) => hash),
);

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

const inlineScripts = new Set();
for (const file of await htmlFiles(distDir)) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\bsrc\s*=/.test(match[1])) inlineScripts.add(match[2]);
  }
}

const actualHashes = new Set(
  [...inlineScripts].map(
    (script) => `'sha256-${createHash('sha256').update(script).digest('base64')}'`,
  ),
);
const missing = [...actualHashes].filter((hash) => !allowedHashes.has(hash));

if (missing.length > 0) {
  throw new Error(`CSP is missing ${missing.length} inline script hash(es): ${missing.join(', ')}`);
}

console.log(`CSP verified: ${actualHashes.size} inline script hash(es) match the build output`);
