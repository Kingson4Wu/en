# Kingson Wu's Technical Blog - English Version

This is the English version of my personal technical blog deployed to GitHub Pages at https://kingson4wu.github.io/en/

Features:

- ✅ Technical content focused on software architecture, distributed systems, LLMs, and AI
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run deploy`          | Deploy build to GitHub Pages `gh-pages` branch   |
| `npm run build-and-deploy`| Run build and deploy in sequence                 |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 📝 Creating New Blog Posts

To create a new blog post, follow these steps:

1. **Create a new markdown file** in the `src/content/blog/` directory:
   ```bash
   touch src/content/blog/my-new-post.md
   ```

2. **Add frontmatter** at the top of the file with required metadata:
   ```markdown
   ---
   title: 'Your Blog Post Title'
   description: 'Brief description of your post'
   pubDate: 'Dec 16 2025'
   updatedDate: 'Dec 16 2025'  # Optional
   heroImage: '../../assets/blog-placeholder-1.jpg'  # Optional
   ---
   ```

3. **Write your content** in Markdown format below the frontmatter.

4. **Preview your post** by running the dev server:
   ```bash
   npm run dev
   ```

5. **Build and deploy** when ready:
   ```bash
   npm run build-and-deploy
   ```

## 🚀 Deployment to GitHub Pages

This project is configured to deploy to GitHub Pages with subpath routing.

### Configuration
- Site URL: `https://kingson4wu.github.io`
- Deployment branch: `gh-pages`

### Deployment Steps
1. Build the project: `npm run build`
2. Deploy to GitHub Pages: `npm run deploy`
3. Or build and deploy in one command: `npm run build-and-deploy`

### GitHub Pages Setup
1. Go to your repository Settings → Pages
2. Set Source to "Deploy from a branch"
3. Select the `gh-pages` branch
4. Choose `/ (root)` folder option
5. Save the configuration

After deployment, your site will be accessible at: https://kingson4wu.github.io/en/

### Notes for Reproducible Builds
- For consistent builds across environments, consider committing `package-lock.json`
- The `dist/` folder is built locally and pushed to the `gh-pages` branch
- Only the `gh-pages` branch contains the static files served by GitHub Pages

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
