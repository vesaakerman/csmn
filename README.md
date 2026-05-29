# CSMN website

Astro + Sanity website for Chinese Student Ministry Netherlands.

## Stack

- Astro static site
- Sanity Studio mounted at `/admin`
- Bootstrap and SCSS
- No Tailwind
- Static page copy in `src/text-long/{en,zh,nl}`
- Short UI labels in `src/text/ui.js`
- Sanity content type only for videos

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Sanity project and copy `.env.example` to `.env`.

3. Fill in:

   ```bash
   PUBLIC_SANITY_PROJECT_ID=...
   PUBLIC_SANITY_DATASET=production
   PUBLIC_SANITY_USE_CDN=false
   ```

4. Run the site:

   ```bash
   npm run dev
   ```

The public site will be available at `http://127.0.0.1:4321/`. Sanity Studio is available at `http://127.0.0.1:4321/admin#/`.

In the Sanity project settings, add these CORS origins with credentials enabled:

```text
http://127.0.0.1:4321
http://localhost:4321
```

If the embedded Studio ever behaves oddly during local development, you can run the same Studio directly on a separate port:

```bash
npm run sanity:dev
```

That starts Sanity Studio at `http://127.0.0.1:3333/`. Add `http://127.0.0.1:3333` as a Sanity CORS origin with credentials if you use this fallback.

## Editor workflow

Trusted editors log in to Sanity Studio, then add videos. Music videos and song links are handled as videos. The Studio includes a "My videos" view based on the `submittedBy` metadata that is set when a document is created.

This is an editor-friendly view, not a substitute for enterprise document-level security. For trusted editors it keeps the workflow simple. If many less-trusted members later need uploads, add a separate submission flow with moderation.

## Search

`npm run index` builds `public/search-index.json` from Markdown pages and Sanity video metadata. The build script uses Sanity when environment variables are present and falls back to sample content otherwise.
