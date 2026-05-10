import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    publisher: z.string().optional().default('Freddie K.'),
    summary: z.string(),
    tags: z.array(z.string()).optional().default([]),
  }),
});

export const collections = { notes };
