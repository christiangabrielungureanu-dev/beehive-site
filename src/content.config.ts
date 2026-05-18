import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const podcast = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/podcast' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    guest: z.string(),
    guestTitle: z.string(),
    guestImage: z.string().optional(),
    publishDate: z.date(),
    youtubeId: z.string(),
    thumbnail: z.string().optional(),
    tags: z.array(z.string()),
    episode: z.number(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { podcast };
