import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const published = await getPublishedPosts();
  const featured = published.filter((p) => p.data.featured);
  if (featured.length >= limit) return featured.slice(0, limit);
  // Fallback: latest posts
  return published.slice(0, limit);
}

export function readingTime(body: string | undefined): string {
  if (!body) return '1 min read';
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}
