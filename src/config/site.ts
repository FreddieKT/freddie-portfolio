export const site = {
  name: 'FREDDIE K.',
  title: 'FREDDIE K. — building things that work',
  description:
    "Hey, I'm Freddie. I build small tools, automate boring stuff, and tinker with AI systems. This is where I keep the things that actually work.",
  origin: 'https://freddie-portfolio.pages.dev',
  ogImage: '/favicon.png',
  author: 'Freddie K.',
  xHandle: '@ktythaung',
};

export function absoluteUrl(path = '/') {
  return new URL(path, site.origin).toString();
}
