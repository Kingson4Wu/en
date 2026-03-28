import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const [posts, notes] = await Promise.all([getCollection('blog'), getCollection('notes')]);
	const englishSiteURL = new URL(import.meta.env.BASE_URL, context.site);
	const items = [...posts, ...notes]
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.map((entry) => ({
			title:
				entry.collection === 'notes'
					? entry.data.title ?? 'Untitled note'
					: entry.data.title,
			description:
				entry.collection === 'notes' ? SITE_DESCRIPTION : entry.data.description ?? SITE_DESCRIPTION,
			pubDate: entry.data.pubDate,
			link: new URL(
				`${entry.collection}/${entry.id}/`,
				englishSiteURL,
			).href,
		}));

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: englishSiteURL.href,
		items,
	});
}
