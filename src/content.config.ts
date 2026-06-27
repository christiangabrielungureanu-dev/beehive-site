import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import Parser from 'rss-parser';

const FEED_URL = 'https://api.riverside.com/hosting/uEOr9jmt.rss';

function slugify(text: string): string {
  const cleaned = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  if (cleaned.length <= 90) return cleaned;
  const truncated = cleaned.slice(0, 90);
  const lastDash = truncated.lastIndexOf('-');
  return lastDash > 40 ? truncated.slice(0, lastDash) : truncated;
}

function extractGuest(title: string): string | undefined {
  const parts = title.split(/\s+—\s+/);
  if (parts.length < 2) return undefined;
  return parts[parts.length - 1].trim();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

const podcast = defineCollection({
  loader: async () => {
    const parser = new Parser({
      customFields: {
        item: [
          ['itunes:duration', 'duration'],
          ['itunes:image', 'image'],
          ['podcast:transcript', 'transcript'],
        ],
      },
    });

    const feed = await parser.parseURL(FEED_URL);
    const itemsOldestFirst = [...feed.items].reverse();

    return itemsOldestFirst
      .map((item: any, index: number) => {
        const episode = index + 1;
        const title = item.title || `Episode ${episode}`;
        const slug = slugify(title);
        const description = item.content || item.contentSnippet || '';
        const plain = stripHtml(description);
        const summary = plain.length > 220 ? plain.slice(0, 217).trimEnd() + '…' : plain;
        const audioUrl = item.enclosure?.url || '';
        const episodeImage = item.image?.$?.href;
        const transcriptUrl = item.transcript?.$?.url;
        const publishDate = item.isoDate ? new Date(item.isoDate) : new Date();

        return {
          id: slug,
          guid: item.guid || slug,
          title,
          description,
          summary,
          publishDate,
          audioUrl,
          duration: typeof item.duration === 'string' ? item.duration : undefined,
          episodeImage,
          transcriptUrl,
          guest: extractGuest(title),
          episode,
        };
      })
      .reverse();
  },
  schema: z.object({
    guid: z.string(),
    title: z.string(),
    description: z.string(),
    summary: z.string(),
    publishDate: z.date(),
    audioUrl: z.string(),
    duration: z.string().optional(),
    episodeImage: z.string().optional(),
    transcriptUrl: z.string().optional(),
    guest: z.string().optional(),
    episode: z.number(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    primaryKeyword: z.string().optional(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    coverImage: z.string().optional(),
    ogImage: z.string().optional(),
    episodeGuids: z.array(z.string()).default([]),
    youtubeUrl: z.string().optional(),
    draft: z.boolean().default(false),
    guestName: z.string().optional(),
    guestBio: z.string().optional(),
    guestImage: z.string().optional(),
    guestLinkedIn: z.string().optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

export const collections = { podcast, blog };
