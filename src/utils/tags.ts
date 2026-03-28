import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

export type TagStat = {
	tag: string;
	slug: string;
	count: number;
};

export function slugifyTag(tag: string) {
	return tag
		.trim()
		.toLowerCase()
		replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function collectTagStats(posts: BlogPost[]): TagStat[] {
	const stats = new Map<string, TagStat>();

	for (const post of posts) {
		for (const rawTag of post.data.tags) {
			const tag = rawTag.trim();
			if (!tag) continue;

			const slug = slugifyTag(tag);
			if (!slug) continue;

			const existing = stats.get(slug);
			if (existing) {
				existing.count += 1;
				continue;
			}

			stats.set(slug, { tag, slug, count: 1 });
		}
	}

	return [...stats.values()].sort((a, b) => {
		if (b.count !== a.count) return b.count - a.count;
		return a.tag.localeCompare(b.tag);
	});
}

export function filterPostsByTag(posts: BlogPost[], tagSlug: string) {
	return posts.filter((post) =>
		post.data.tags.some((tag) => slugifyTag(tag) === tagSlug),
	);
}
