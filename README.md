# Miqyas

An AI-analyzed news reader built on Dawn News. Every article gets a short AI summary
and six indicators (economic, political, social, market relevance, political lean, and
AI confidence), shown as shape-and-color-coded badges so the reading is never color
alone. Full write-up of the design and editorial rules is in the project's SOP.

Live article data refreshes daily at 6:00 AM Pakistan Standard Time via a scheduled
crawl of Dawn News's RSS feed, written to `public/articles.json`. If that file hasn't
run yet, the app falls back to a small sample set in `src/data/articles.js`.

## Development

```
npm install
npm run dev
```

## Build

```
npm run build
```
