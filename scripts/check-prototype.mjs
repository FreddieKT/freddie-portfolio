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
const footer = read('src/components/FooterStatus.astro');
const about = read('src/pages/about.astro');
const contact = read('src/pages/contact.astro');
const themeToggle = read('src/components/ThemeToggle.astro');
const contentConfig = read('src/content.config.ts');
const projectsData = read('src/data/projects.ts');
const notesIndex = read('src/pages/notes.astro');
const noteDetail = read('src/pages/notes/[slug].astro');
const labDetail = read('src/pages/labs/[slug].astro');
const faviconSvg = read('public/favicon.svg');
const noteFiles = walk('src/content/notes').filter((file) => file.endsWith('.md'));

for (const id of ['about', 'labs', 'notes', 'work', 'contact']) {
  assert.match(index + read('src/components/FooterStatus.astro'), new RegExp(`id=["']${id}["']`), `missing section id #${id}`);
}

for (const href of ['/about', '/labs/afterglow', '/notes', '/#work']) {
  assert.match(header, new RegExp(`href: ['"]${href}['"]`), `navbar missing ${href}`);
}

assert.match(about + contact + footer, /mailto:ktythaung@gmail\.com/, 'contact surfaces must use Freddie\'s real email');
assert.doesNotMatch(about + contact + footer, /hello@ktt\.dev/, 'placeholder email must not appear in live contact surfaces');
assert.doesNotMatch(footer, /SYSTEM OPERATIONAL|footer-status/, 'footer should not show the old system operational status block');
assert.match(footer, /Freddie K\./, 'footer should show the Freddie K. brand');
assert.doesNotMatch(footer, /ktt\.dev|kt\.dev/i, 'footer must not show old KTT/KT.DEV branding');
assert.match(themeToggle, /class="theme-toggle is-dark"/, 'theme toggle should render a default visible dark icon before JS runs');
assert.doesNotMatch(themeToggle, /class="nav-pill theme-toggle/, 'theme toggle should not inherit full nav-pill sizing');
assert.match(themeToggle, /width:\s*2\.75rem/, 'theme toggle should stay compact instead of becoming a large nav tile');
assert.match(themeToggle, /height:\s*2\.75rem/, 'theme toggle should keep a compact square hit area');
assert.match(themeToggle, /theme-icon-svg/, 'theme toggle should use an SVG icon, not the old CSS-only dot');
assert.match(themeToggle, /class="moon-icon"/, 'theme toggle needs a visible moon icon group');
assert.match(themeToggle, /class="sun-icon"/, 'theme toggle needs a visible sun icon group');
assert.match(themeToggle, /sun-rays/, 'theme toggle should include animated light-mode rays');
assert.match(themeToggle, /vector-effect="non-scaling-stroke"/, 'theme icon strokes should render crisply and reliably');
assert.match(themeToggle, /transition:/, 'theme toggle icon should animate between light and dark states');
assert.match(index, /rel="icon" type="image\/svg\+xml" href="\/favicon\.svg"/, 'homepage should use animated SVG favicon');
assert.match(read('src/layouts/PageLayout.astro'), /rel="icon" type="image\/svg\+xml" href="\/favicon\.svg"/, 'inner pages should use animated SVG favicon');
assert.match(faviconSvg, /@keyframes\s+blink/, 'favicon should include cursor blink animation');
assert.match(faviconSvg, /@keyframes\s+orbitA/, 'favicon should include orbital pixel animation');
assert.match(faviconSvg, /FREDDIE K\. animated pixel favicon/, 'favicon should describe the FREDDIE K. identity');

assert.ok(pkg.dependencies?.gsap, 'gsap dependency must be installed');
assert.match(index, /gsap/i, 'page must load GSAP animation script');
assert.match(index, /class="section-pointer" href="\/about"/, 'homepage about section should point to the full about page');
assert.match(index, /class="section-pointer" href="\/labs\/afterglow"/, 'homepage labs section should point to a lab detail page');
assert.match(index, /class="section-pointer" href="\/notes"/, 'homepage notes section should point to the notes page');
assert.doesNotMatch(index, /mini-preview-grid/, 'homepage should avoid dense preview-card grids');
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
assert.match(contentConfig, /publisher:\s*z\.string\(\)\.optional\(\)\.default\('Freddie K\.'\)/, 'notes schema should include a default publisher');
for (const file of noteFiles) {
  assert.match(read(file), /^publisher:\s*["']Freddie K\.["']/m, `${file} missing Freddie K. publisher frontmatter`);
}
assert.match(notesIndex + noteDetail, /note\.data\.publisher/, 'notes pages should render note publisher metadata');
assert.match(projectsData, /date:\s*'2026-05-09'/, 'labs project data should include published dates');
assert.match(projectsData, /publisher:\s*'Freddie K\.'/, 'labs project data should include publisher metadata');
assert.match(read('src/components/ProjectCard.astro'), /\.metric-row\s*>\s*div\s*{[\s\S]*justify-items:\s*center;[\s\S]*text-align:\s*center;/, 'project metric labels and values should be centered within each column');
assert.match(labDetail, /project\.date[\s\S]*project\.publisher/, 'labs detail should render date and publisher metadata');
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
