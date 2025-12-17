# Scripts

This directory contains convenience scripts for common development tasks.

## Available Scripts

### `dev.sh`
Starts the local development server.

```bash
./scripts/dev.sh
```

### `build-and-publish.sh`
Builds the site and deploys it to GitHub Pages.

```bash
./scripts/build-and-publish.sh
```

### `create.sh`
Creates a new blog post with the given title.

```bash
./scripts/create.sh "Title of the Blog Post"
```

This will create a new markdown file in `src/content/blog/` with the proper frontmatter and a basic template to get started.