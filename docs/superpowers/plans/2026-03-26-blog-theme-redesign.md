# Blog Theme Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the blog's visual theme to a warm, elegant newsletter aesthetic using Stone & Slate colors, Lora serif font, and Dracula code highlighting.

**Architecture:** All changes are purely CSS and template updates — no logic changes, no new dependencies beyond Google Fonts (external CDN, no npm install). The Shiki syntax highlighter is already bundled with Astro; only a config key needs to be added.

**Tech Stack:** Astro 4+, CSS custom properties, Google Fonts (Lora), Shiki (dracula theme)

---

## File Map

| File | Change Type | What Changes |
|---|---|---|
| `astro.config.mjs` | Modify | Add `markdown.shikiConfig.theme: 'dracula'` |
| `src/styles/global.css` | Modify | Full CSS variable replacement, Atkinson removal, new type scale |
| `src/components/BaseHead.astro` | Modify | Remove Atkinson preloads, add Lora Google Fonts |
| `src/components/Header.astro` | Modify | New nav styles, remove placeholder social icons |
| `src/components/Footer.astro` | Modify | Remove placeholder social icons, fix copyright, new styles |
| `src/layouts/BlogPost.astro` | Modify | Article header styling, divider, prose styles |
| `src/pages/blog/index.astro` | Modify | Replace grid with vertical list, remove 960px override |
| `src/pages/index.astro` | Modify | Minor — inherits global CSS, confirm homepage looks right |

---

### Task 1: Configure Dracula syntax highlighting

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Add shikiConfig to astro.config.mjs**

Open `astro.config.mjs` and add the `markdown` key:

```js
// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://kingson4wu.github.io',
	base: '/en/',
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			theme: 'dracula',
		},
	},
});
```

- [ ] **Step 2: Verify build still passes**

```bash
npm run build 2>&1 | tail -5
```

Expected: `dist/` created with no errors.

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: configure Dracula syntax highlighting theme"
```

---

### Task 2: Replace CSS variables and Atkinson font in global.css

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Remove Atkinson @font-face blocks and replace :root variables**

Replace the entire top section of `global.css` (the `@font-face` blocks and `:root`) with:

```css
:root {
	--bg: #f8f7f5;
	--border: #e8e5e0;
	--muted: #a8a29e;
	--text: #3c3530;
	--text-muted: #78716c;
	--heading: #1c1917;
}
```

Remove the two `@font-face` blocks for Atkinson entirely (lines 19–32 in the original file).

- [ ] **Step 2: Update body styles**

Replace the `body` rule:

```css
body {
	font-family: 'Lora', Georgia, serif;
	margin: 0;
	padding: 0;
	text-align: left;
	background: var(--bg);
	word-wrap: break-word;
	overflow-wrap: break-word;
	color: var(--text);
	font-size: 16px;
	line-height: 1.85;
}
```

- [ ] **Step 3: Update heading scale**

Replace the heading block:

```css
h1, h2, h3, h4, h5, h6 {
	margin: 0 0 0.5rem 0;
	color: var(--heading);
	line-height: 1.3;
}
h1 { font-size: 1.8em; }
h2 { font-size: 1.4em; }
h3 { font-size: 1.15em; }
h4 { font-size: 1em; font-weight: 700; }
h5 { font-size: 0.9em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
```

- [ ] **Step 4: Update links, blockquote, hr, code, and remaining color references**

```css
a {
	color: var(--heading);
	text-decoration: underline;
	text-underline-offset: 3px;
}
a:hover {
	color: var(--text-muted);
}
blockquote {
	border-left: 2px solid var(--muted);
	padding: 0 0 0 20px;
	margin: 0;
	font-size: 1em;
	font-style: italic;
	color: var(--text-muted);
}
hr {
	border: none;
	border-top: 1px solid var(--border);
}
code {
	padding: 2px 6px;
	background-color: #eeeae4;
	color: #44403c;
	border-radius: 3px;
	font-family: 'SF Mono', Menlo, Consolas, monospace;
	font-size: 0.875em;
}
pre {
	padding: 1.5em;
	border-radius: 8px;
}
pre > code {
	all: unset;
}
```

Also update the `.prose p` margin and responsive rules to use `var(--text)` etc. — do a global search for any remaining `rgb(var(--gray` or `var(--accent` or `var(--black` or `var(--box-shadow` and replace with the equivalent new variable from the migration map in the spec.

- [ ] **Step 5: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: replace CSS variables and font with Stone & Slate + Lora"
```

---

### Task 3: Update BaseHead — remove Atkinson, add Lora

**Files:**
- Modify: `src/components/BaseHead.astro`

- [ ] **Step 1: Remove Atkinson variable declarations**

Delete lines 16–17:
```js
const regularFontUrl = new URL('/en/fonts/atkinson-regular.woff', Astro.site.origin).href;
const boldFontUrl = new URL('/en/fonts/atkinson-bold.woff', Astro.site.origin).href;
```

- [ ] **Step 2: Remove Atkinson preload link tags**

Delete lines 36–37 (the two `<link rel="preload">` for atkinson `.woff` files).

- [ ] **Step 3: Add Lora Google Fonts**

In place of the removed preload links, add:

```html
<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add src/components/BaseHead.astro
git commit -m "feat: swap Atkinson preload for Lora Google Fonts"
```

---

### Task 4: Update Header component

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Replace the entire `<style>` block in Header.astro**

Replace everything inside `<style>...</style>` with:

```css
header {
	margin: 0;
	padding: 0 1em;
	background: var(--bg);
	border-bottom: 1px solid var(--border);
}
h2 {
	margin: 0;
	font-size: 1em;
}
h2 a,
h2 a.active {
	text-decoration: none;
	font-family: 'Lora', Georgia, serif;
	font-size: 14px;
	font-weight: 700;
	color: var(--heading);
}
nav {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
nav a {
	padding: 1em 0.5em;
	color: var(--muted);
	border-bottom: 2px solid transparent;
	text-decoration: none;
	font-size: 12px;
	letter-spacing: 0.04em;
}
nav a.active {
	color: var(--heading);
	border-bottom: 1px solid var(--heading);
}
```

- [ ] **Step 2: Remove the three social icon `<a>` blocks from the template**

Delete the entire `<div class="social-links">` block and its contents (the Mastodon, Twitter, and GitHub SVG links).

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: update header nav styles, remove placeholder social links"
```

---

### Task 5: Update Footer component

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Replace Footer.astro content entirely**

```astro
---
const today = new Date();
---

<footer>
	<p>&copy; {today.getFullYear()} Kingson Wu. All rights reserved.</p>
</footer>
<style>
	footer {
		padding: 2em 1em 4em;
		background: var(--bg);
		border-top: 1px solid var(--border);
		color: var(--muted);
		text-align: center;
		font-size: 13px;
	}
</style>
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: clean up footer, fix copyright name, remove placeholder social links"
```

---

### Task 6: Update BlogPost layout

**Files:**
- Modify: `src/layouts/BlogPost.astro`

- [ ] **Step 1: Replace the `<style>` block in BlogPost.astro**

Replace all existing styles in `BlogPost.astro`'s `<style>` block with:

```css
main {
	width: calc(100% - 2em);
	max-width: 100%;
	margin: 0;
}
.hero-image {
	width: 100%;
}
.hero-image img {
	display: block;
	margin: 0 auto;
	border-radius: 8px;
}
.prose {
	width: 720px;
	max-width: calc(100% - 2em);
	margin: auto;
	padding: 2em 1em;
	color: var(--text);
}
.title {
	margin-bottom: 1.5em;
	padding: 1.5em 0 0;
}
.title h1 {
	font-size: 1.8em;
	margin: 0 0 0.4em;
	color: var(--heading);
	line-height: 1.25;
}
.date {
	font-size: 10px;
	color: var(--muted);
	text-transform: uppercase;
	letter-spacing: 0.08em;
	margin-bottom: 0.75em;
}
.description {
	font-style: italic;
	color: var(--text-muted);
	font-size: 1em;
	line-height: 1.6;
	margin-bottom: 1em;
}
.divider {
	width: 28px;
	height: 2px;
	background: #c8c3bb;
	margin: 1.25em 0;
}
.last-updated-on {
	font-style: italic;
	font-size: 0.85em;
	color: var(--muted);
	margin-top: 0.25em;
}
```

- [ ] **Step 2: Update the template in BlogPost.astro to use new classes**

Replace the `.title` div block:

```astro
<div class="title">
	<div class="date">
		<FormattedDate date={pubDate} />
		{updatedDate && (
			<div class="last-updated-on">
				Last updated on <FormattedDate date={updatedDate} />
			</div>
		)}
	</div>
	<h1>{title}</h1>
	{description && <p class="description">{description}</p>}
	<div class="divider"></div>
</div>
```

Note: `description` is not currently destructured from props — add it:
```astro
const { title, description, pubDate, updatedDate, heroImage } = Astro.props;
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BlogPost.astro
git commit -m "feat: redesign article header with date, title, description, divider"
```

---

### Task 7: Update blog index page

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: Replace the scoped `<style>` block entirely**

Delete the entire existing `<style>...</style>` block in `blog/index.astro` and replace with:

```css
<style>
	section {
		padding: 2em 0;
	}
	.page-title {
		font-size: 10px;
		color: var(--muted);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-bottom: 1.5em;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	ul li {
		padding-bottom: 1.5em;
		margin-bottom: 1.5em;
		border-bottom: 1px solid var(--border);
	}
	ul li:last-child {
		border-bottom: none;
	}
	ul li a {
		display: block;
		text-decoration: none;
	}
	.post-meta {
		font-size: 10px;
		color: var(--muted);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin-bottom: 0.4em;
	}
	.title {
		font-family: 'Lora', Georgia, serif;
		font-size: 1.1em;
		font-weight: 700;
		color: var(--heading);
		line-height: 1.35;
		margin: 0 0 0.4em;
	}
	.description {
		font-size: 0.9em;
		color: var(--text-muted);
		line-height: 1.6;
		margin: 0;
	}
	ul li a:hover .title {
		color: var(--text-muted);
	}
</style>
```

- [ ] **Step 2: Replace the template section**

Replace everything inside `<main>` with:

```astro
<main>
	<section>
		<p class="page-title">Writing</p>
		<ul>
			{posts.map((post) => (
				<li>
					<a href={createBlogUrl(post.id)}>
						<p class="post-meta"><FormattedDate date={post.data.pubDate} /></p>
						<h2 class="title">{post.data.title}</h2>
						{post.data.description && (
							<p class="description">{post.data.description}</p>
						)}
					</a>
				</li>
			))}
		</ul>
	</section>
</main>
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: replace card grid with clean vertical list on blog index"
```

---

### Task 8: Final check — homepage and dev preview

**Files:**
- Verify: `src/pages/index.astro`

- [ ] **Step 1: Run dev server and visually verify all pages**

```bash
npm run dev
```

Open in browser:
- `http://localhost:4321/en/` — homepage
- `http://localhost:4321/en/blog/` — blog list
- Any blog post — article page with code block

Check:
- [ ] Font is Lora (serif), not Atkinson
- [ ] Background is warm gray, not pure white
- [ ] Headings are appropriately sized (not huge)
- [ ] Code blocks use Dracula colors
- [ ] Header has no Astro social icons
- [ ] Footer shows "Kingson Wu" copyright, no social icons
- [ ] Nav active state has bottom border

- [ ] **Step 2: Final build and confirm no errors**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 3: Commit any homepage fixes if needed**

```bash
git add src/pages/index.astro
git commit -m "feat: verify homepage styling with new theme"
```
