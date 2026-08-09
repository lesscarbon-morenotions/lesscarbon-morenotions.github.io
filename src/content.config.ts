import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

// Flat Sveltia settings.json → one entry via glob (not file())
const site = defineCollection({
  loader: glob({ base: './src/content/site', pattern: 'settings.json' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    author: z.string(),
    authorBio: z.string(),
    authorNote: z.string().optional(),
    authorImage: z.string().optional(),
    email: z.string().optional(),
    social: z
      .object({
        github: z.string().optional(),
        mastodon: z.string().optional(),
        instagram: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { posts, site };
