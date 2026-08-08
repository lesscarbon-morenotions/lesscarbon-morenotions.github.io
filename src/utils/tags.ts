import type { Post } from './posts';

export function slugifyTag(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function collectTags(posts: Post[]): { label: string; slug: string; count: number }[] {
  const map = new Map<string, { label: string; count: number }>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = slugifyTag(tag);
      const existing = map.get(slug);
      if (existing) existing.count += 1;
      else map.set(slug, { label: tag, count: 1 });
    }
  }
  return [...map.entries()]
    .map(([slug, { label, count }]) => ({ slug, label, count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function postsWithTag(posts: Post[], tagSlug: string): Post[] {
  return posts.filter((p) => p.data.tags.some((t) => slugifyTag(t) === tagSlug));
}
