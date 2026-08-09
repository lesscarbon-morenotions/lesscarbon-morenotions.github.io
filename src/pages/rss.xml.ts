import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '../utils/posts';
import { getEntry } from 'astro:content';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  const settings = await getEntry('site', 'settings');

  return rss({
    title: settings?.data.title ?? 'Less Carbon, More Notions',
    description: settings?.data.description ?? '',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
