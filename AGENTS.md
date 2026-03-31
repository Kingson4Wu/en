# Repository Guidelines

## Project Structure & Module Organization

This repository is an Astro-based English blog deployed to GitHub Pages. Core application code lives under `src/`. Use `src/pages/` for routes, `src/layouts/` for page shells, `src/components/` for reusable UI, and `src/styles/global.css` for site-wide styling. Content is split into two collections: long-form posts in `src/content/blog/` and short notes in `src/content/notes/`. Static assets belong in `public/` or `src/assets/` depending on whether they need Astro processing.

## Build, Test, and Development Commands

Run commands from the repository root:

- `npm install`: install dependencies.
- `npm run dev`: start the local Astro dev server.
- `npm run build`: produce a production build in `dist/` and generate Pagefind search indexes.
- `npm run preview`: serve the built site locally.
- `npm run deploy`: publish `dist/` to the `gh-pages` branch.
- `npm run build-and-deploy`: build and deploy in one step.
- `./scripts/create.sh "Post Title"`: scaffold a new blog post in `src/content/blog/`.

## Coding Style & Naming Conventions

Follow the existing code style: TypeScript and Astro files use tabs for indentation, while Markdown content stays simple and readable. Keep components and layouts in PascalCase such as `BlogPost.astro`; utility files use lower-case names such as `tags.ts`. Note and blog filenames should be kebab-case and descriptive, for example `skills-may-matter-more-than-agents.md`. Keep frontmatter minimal and valid against `src/content.config.ts`.

## Testing Guidelines

There is no separate unit test suite in this repository. Treat `npm run build` as the primary validation step because it catches Astro, content collection, and search-index generation issues. Use `npm run preview` for a final route/content check before deployment. When changing frontmatter schemas or routing, also run `npx astro check`.

## Commit & Pull Request Guidelines

Recent history follows concise conventional-style subjects such as `feat: ...`, `fix: ...`, and `docs(notes): ...`. Keep subjects imperative and specific to the dominant change. PRs should include a short summary, affected routes or content paths, and screenshots only when UI/layout changes are visible. Link related issues when applicable and mention any deployment impact.

## Content Workflow Notes

Blog posts require `title`, `description`, and `pubDate`. Notes require `pubDate` and usually a `title`. Put English-only content in this repository and keep note entries short, direct, and publication-ready.
