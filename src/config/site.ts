export const site = {
  name: 'FREDDIE K.',
  title: 'FREDDIE K. — Strange tools for real life',
  description:
    "FREDDIE K. is Freddie's portfolio for small AI tools, automation workflows, memory systems, and terminal-native experiments.",
  origin: 'https://freddie-portfolio.pages.dev',
  ogImage: '/favicon.png',
  author: 'Freddie K.',
  xHandle: '@ktythaung',
};

export function absoluteUrl(path = '/') {
  return new URL(path, site.origin).toString();
}
