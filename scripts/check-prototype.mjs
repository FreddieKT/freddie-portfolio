import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const root = new URL('..', import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), 'utf8');
const pkg = JSON.parse(read('package.json'));
const index = read('src/pages/index.astro');
const header = read('src/components/Header.astro');
const globalCss = read('src/styles/global.css');
const tokenCss = read('src/styles/tokens.css');
const metrics = read('src/components/MetricsStrip.astro');
const hero = read('src/components/Hero.astro');
const profileCard = read('src/components/ProfileStatusCard.astro');

for (const id of ['about', 'labs', 'notes', 'work', 'contact']) {
  assert.match(index + read('src/components/FooterStatus.astro'), new RegExp(`id=["']${id}["']`), `missing section id #${id}`);
}

for (const href of ['#about', '#labs', '#notes', '#work']) {
  assert.match(header, new RegExp(`href: ['"]${href}['"]`), `navbar missing ${href}`);
}

assert.ok(pkg.dependencies?.gsap, 'gsap dependency must be installed');
assert.match(index, /gsap/i, 'page must load GSAP animation script');
assert.match(metrics, /data-animate=/, 'metric/dashboard components need animation hooks');
assert.match(hero, /profile-about\.jpg/, 'main hero must reuse the existing About portrait asset');
assert.match(hero, /<Image[\s\S]*alt=/, 'main hero portrait must render as an accessible responsive Astro image');
assert.match(hero, /font-size:\s*clamp\(1\.55rem, 3\.15vw, 3\.05rem\)/, 'hero headline should be reduced so text is not visually dominant');
assert.match(hero, /max-width:\s*20ch/, 'hero headline should use a wider measure to reduce poster-like line breaks');
assert.match(hero, /width=\{176\}/, 'main hero image should match the original portfolio desktop image width');
assert.match(hero, /width:\s*11rem/, 'main hero desktop CSS image size should match the original portfolio md:w-44 sizing');
assert.match(hero, /width:\s*7rem/, 'main hero mobile CSS image size should match the original portfolio w-28 sizing');
assert.doesNotMatch(profileCard, /profile-about\.jpg/, 'right profile/status card should not contain the portrait asset');
assert.doesNotMatch(profileCard, /<Image[\s\S]*alt=/, 'right profile/status card should stay a status panel, not the hero portrait');
assert.match(profileCard, /cubitRows/, 'right profile/status card should restore the pixel cubit mascot layer');
assert.match(profileCard, /PIXEL STAGE/, 'pixel cubit layer should be labelled as a secondary identity stage');
assert.doesNotMatch(profileCard, /<span><\/span><span><\/span>/, 'generic pixel avatar placeholder should not return; use the styled cubit mascot instead');

assert.match(globalCss, /width:\s*min\(1360px, calc\(100% - 1\.5rem\)\)/, 'page shell should be slightly wider after reducing hero text dominance');
assert.match(globalCss, /\.grid-tags\s*>\s*span\s*{/, 'grid tag styles must target only direct child tag labels');
assert.doesNotMatch(globalCss, /\.grid-tags\s+span\s*{/, 'broad grid tag selector makes nested tag dots render as large pills');
assert.match(tokenCss, /--panel-overlay:/, 'theme tokens need theme-aware panel overlay');
assert.doesNotMatch(globalCss, /rgba\(10, 13, 18, 0\.92\)/, 'global styles still contain stale hardcoded dark panel rgba');

function walk(dir) {
  return readdirSync(join(root, dir)).flatMap((name) => {
    const rel = join(dir, name);
    const abs = join(root, rel);
    return statSync(abs).isDirectory() ? walk(rel) : [rel];
  });
}

const sourceFiles = walk('src').filter((file) => /\.(astro|css|ts)$/.test(file));
const staleDarkPattern = /background:\s*rgba\(10, 13, 18, 0\.92\)/;
const stale = sourceFiles.filter((file) => staleDarkPattern.test(read(file)));
assert.deepEqual(stale, [], `stale hardcoded dark component backgrounds: ${stale.join(', ')}`);

console.log('prototype checks passed');
