import { getCollection } from 'astro:content';
import { projects } from '../data/projects';

const staticPages = ['/', '/about', '/contact', '/notes'];

export async function GET({ site }: { site?: URL }) {
  const origin = site?.toString() ?? 'https://freddie-portfolio.pages.dev/';
  const notes = await getCollection('notes');
  const urls = [
    ...staticPages,
    ...projects.map((project) => `/labs/${project.slug}`),
    ...notes.map((note) => `/notes/${note.id.replace(/\.md$/, '')}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((path) => {
    const loc = new URL(path, origin).toString();
    return `  <url><loc>${loc}</loc></url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
