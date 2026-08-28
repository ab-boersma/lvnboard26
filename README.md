# LVN Board 2026

An interactive working model for the Legal Value Network's 2026 strategy, governance structure, delivery model, participation lanes, and value exchange.

## What is included

- `public/index.html`: responsive, interactive website
- `public/deck.html`: companion presentation view
- `public/assets`: LVNx brand assets used by both views
- `tests/validate.mjs`: checks pages, interactions, links, and local assets

The website intentionally keeps three kinds of content distinct: source-derived proposals, recommended operating choices, and decisions still reserved for the Board.

## Local use

```sh
npm install
npm test
npm run dev
```

## Deployment

The site is configured as a static Cloudflare Worker.

```sh
npm run deploy:dry
npm run deploy
```
