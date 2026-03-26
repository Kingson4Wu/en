# Blog Theme Redesign — Design Spec

**Date:** 2026-03-26
**Status:** Approved
**Scope:** Visual redesign of the Astro blog (kingson4wu.github.io.en)

---

## Problem

The current theme is based on Bear Blog's default CSS, which is deliberately rustic and minimal. Issues:
- Body font size too large (20px), headings oversized (h1: 3.052em)
- Bright blue accent (`#2337ff`) feels loud and generic
- Atkinson font has an engineering/utilitarian feel
- Overall aesthetic lacks elegance and professional polish

---

## Design Decisions

### Color Palette: Stone & Slate

| Role | CSS Variable | Value |
|---|---|---|
| Page background | `--bg` | `#f8f7f5` |
| Borders / dividers | `--border` | `#e8e5e0` |
| Accent / metadata / muted | `--muted` | `#a8a29e` |
| Body text | `--text` | `#3c3530` |
| Secondary text (dates, labels) | `--text-muted` | `#78716c` |
| Headings / strong | `--heading` | `#1c1917` |

**Variable migration map (old → new):**

| Old variable | Replacement |
|---|---|
| `--accent` (`#2337ff`) | `--muted` (`#a8a29e`) for borders; `--heading` for links |
| `--accent-dark` | removed |
| `--black` (RGB tuple `15, 18, 25`) | `--heading` (`#1c1917`) — all `rgb(var(--black))` call sites replaced with `var(--heading)` |
| `--gray` (RGB tuple `96, 115, 159`) | `--text-muted` (`#78716c`) |
| `--gray-light` (RGB tuple `229, 233, 240`) | `--border` (`#e8e5e0`) |
| `--gray-dark` (RGB tuple `34, 41, 57`) | `--text` (`#3c3530`) |
| `--gray-gradient` | removed — body background becomes solid `var(--bg)` |
| `--box-shadow` | removed — no box-shadows in new design |

**Links:** color `var(--heading)`, `text-decoration: underline`, `text-underline-offset: 3px`; hover color `var(--text-muted)`

**Blockquote:** left border `2px solid var(--muted)`

### Typography: Lora (full serif)
- **Font:** Lora (Google Fonts), loaded via `<link>` with `display=swap`
- **Full link tag:** `<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">`
- **Fallback stack:** `'Lora', Georgia, serif`
- **Body size:** `16px` (down from `20px`), `line-height: 1.85`
- **Heading scale:**
  - h1: `1.8em`
  - h2: `1.4em`
  - h3: `1.15em`
  - h4: `1em`, bold
  - h5: `0.9em`, bold, uppercase, letter-spacing `0.05em`
- **Italic** used for post descriptions/subtitles

### Code Blocks: Dracula Theme
- Configured via `markdown.shikiConfig.theme: 'dracula'` inside `defineConfig` in `astro.config.mjs`
- Inline code: `background: #eeeae4`, `color: #44403c`, `border-radius: 3px`, `padding: 2px 6px`

### Header Background
`#f8f7f5` (matches page, not pure white)

---

## Implementation Scope (Plan B)

### 1. `src/styles/global.css`
- Remove both `@font-face` blocks for Atkinson
- Replace `:root` CSS variables with new set: `--bg`, `--border`, `--muted`, `--text`, `--text-muted`, `--heading`
- Replace all `rgb(var(--black))`, `rgb(var(--gray-dark))`, etc. call sites with direct `var(--heading)`, `var(--text)` etc. (see migration map above)
- `font-family: 'Lora', Georgia, serif`
- `font-size: 16px`, `line-height: 1.85`
- Body `background: var(--bg)` (solid, no gradient)
- Update heading scale h1–h5
- Update `a` color and hover
- Update `blockquote` border
- Update `code` inline styles
- Remove `--box-shadow` and `--gray-gradient` entirely

### 2. `src/components/BaseHead.astro`
- Remove `regularFontUrl` and `boldFontUrl` variable declarations (lines 16–17)
- Remove two Atkinson `<link rel="preload">` tags (lines 36–37)
- Add Lora Google Fonts `<link>` (preconnect + stylesheet, see Typography section)

### 3. `src/components/Header.astro`
- Background: `var(--bg)` replacing `white`
- Remove `var(--black)` usage — replace with `var(--heading)`
- Remove `rgba(var(--black), 5%)` box-shadow — remove box-shadow entirely
- Site title: Lora, 14px, weight 700, `var(--heading)`
- Nav links: 12px, `var(--muted)`, active: `var(--heading)` + `border-bottom: 1px solid var(--heading)`
- Remove all three placeholder social icon `<a>` blocks (Mastodon/Twitter/GitHub)

### 4. `src/components/Footer.astro`
- Remove all three placeholder social icon `<a>` blocks
- Fix copyright: `"Your name here"` → `"Kingson Wu"`
- Background: `var(--bg)` (remove gradient)
- Footer text color: `var(--muted)`

### 5. `src/layouts/BlogPost.astro`
- Article header: date small uppercase `var(--muted)`, title Lora 22px `var(--heading)`, description italic `var(--text-muted)`
- Add thin `28px × 2px` divider (`#c8c3bb`) below title block
- Prose body: 16px, `line-height: 1.85`, `var(--text)`

### 6. `src/pages/blog/index.astro`
- Remove scoped `<style>` block's `main { width: 960px }` override — page inherits global 720px max-width
- Replace card/grid layout with vertical list
- Each item: date (`var(--muted)`, uppercase, 10px) → title (Lora, `var(--heading)`) → description (`var(--text-muted)`)
- Hero images hidden in list view

### 7. `src/pages/index.astro`
- No structural changes; inherits global CSS automatically

### 8. `astro.config.mjs`
- Add `markdown: { shikiConfig: { theme: 'dracula' } }` inside `defineConfig({...})`
- Sits at the same level as `site`, `base`, `integrations`

### 9. `src/pages/about.astro`
- No changes required; inherits all CSS updates automatically

---

## Out of Scope
- Dark mode toggle
- Tag/category filtering
- Search functionality
- Any content changes
