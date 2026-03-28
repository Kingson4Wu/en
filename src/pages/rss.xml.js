import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const [posts, notes] = await Promise.all([getCollection('blog'), getCollection('notes')]);
	const englishSiteURL = new URL(import.meta.env.BASE_URL, context.site);
	const noteDescriptions = {
		'Small decisions shape the interface':
			'A short note on how tiny API decisions accumulate into product feel.',
		'Write before the idea feels finished':
			'A note about why partial thinking is still worth publishing.',
	};
	const items = [...posts, ...notes]
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.map((entry) => ({
			title: entry.data.title ?? 'Untitled note',
			description:
				entry.collection === 'notes'
					? noteDescriptions[entry.data.title ?? 'Untitled note'] ?? SITE_DESCRIPTION
					: entry.data.description,
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
