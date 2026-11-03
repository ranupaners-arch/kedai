# Kedai

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Kedai** (Indonesian for a small shop or stall) is a multi-page online storefront built with [Astro](https://astro.build) and SQLite. Product, brand and category pages are pre-rendered at build time; a small Node server handles the catalog and order API.

> **This is an independent demo project.** It is not affiliated with, endorsed by, or connected to Shopify or the Shop app. Brands, products, prices and ratings are fictional and generated in code. No real payments are taken and no orders are fulfilled.

## Features

- **Home** – a search field at the centre of a half-circle of brand cards, a hero carousel, trending stores and category sections. The main menu starts docked at the bottom of the screen and glides to the left edge on scroll.
- **Browse** – category pages (type chips, brand, on-sale and price filters, sorting), brand pages with Follow, and full-text style search.
- **Product page** – sticky scroll gallery, variants, quantity stepper, *Add to cart* / *Buy now*, Save, Share, collapsible description and ratings.
- **Cart & checkout** – quantity editing, a promo code (`SHOP10`), shipping and tax rules. Totals are **recomputed on the server from database prices**; values sent by the browser are never trusted.
- **Orders** – stored in SQLite and restored by email, with a simulated Processing → Shipped → Delivered status.
- **Favorites, followed brands and a demo profile** – kept in the browser (`localStorage`).
- **Responsive** – desktop, tablet and mobile layouts, including a bottom tab bar on phones.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Astro 7 (static pages + on-demand API routes) with the `@astrojs/node` adapter |
| Language | TypeScript, plain CSS (design tokens in `src/styles/global.css`) |
| Database | SQLite through Node's built-in `node:sqlite` – no native dependencies |
| Font | Inter (self-hosted via `@fontsource-variable/inter`) |
| Client JS | Small vanilla TypeScript modules, no UI framework |

## Getting started

**Requirements:** Node.js 22.18 or newer (built-in `node:sqlite` and native TypeScript support for the seed script). Developed and tested on Node 26.

```bash
git clone https://github.com/ranupaners-arch/kedai.git
cd kedai
npm install

npm run db:seed     # creates data/shop.db and loads the catalog (required for checkout)
npm run dev         # development server with hot reload
```

Open the URL printed in the terminal (usually `http://localhost:4321`).

### Production-style run

```bash
npm run build       # prerenders pages and builds the Node server into dist/
npm start           # serves dist/ (set PORT and HOST to change the address)
```

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Astro dev server |
| `npm run build` | Production build |
| `npm start` | Run the built server (`dist/server/entry.mjs`) |
| `npm run preview` | Astro preview server |
| `npm run check` | Type-check `.astro` and `.ts` files |
| `npm run db:seed` | Create/refresh `data/shop.db` from the catalog |

### Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `SHOP_DB` | `data/shop.db` | Path to the SQLite database file |
| `PORT`, `HOST` | `4321`, `localhost` | Address for `npm start` (use `HOST=0.0.0.0` to expose it on your network) |

## Project structure

```
src/
  data/catalog.ts      Typed catalog: categories, brands, products (generated deterministically)
  pages/               File-based routes: /, /category/[c], /product/[id], /brand/[id], /cart, /checkout, /orders, /login, ...
  pages/api/           orders.ts and products.ts (server-rendered)
  components/          Product/brand cards, stars, sections, search form, ...
  layouts/Base.astro   Menu, floating search, footer, cookie notice, toast
  lib/                 db.ts (SQLite access) and orders.ts (validation and pricing)
  scripts/             Client modules: cart, checkout, orders, account, login, shell, grid filters
  styles/global.css    Design tokens and all styles
db/schema.sql          SQLite schema
scripts/seed.ts        Loads the catalog into SQLite
public/images/         Static images (home hero background)
```

## How it works

- **Pre-rendered pages.** Every product, brand and category page is generated from `src/data/catalog.ts` at build time. Filtering and sorting then run in the browser over the already-rendered cards.
- **Server only where needed.** Only `/api/*` runs on the server (`export const prerender = false`).
- **Orders.** `POST /api/orders` validates the input, looks up every price in SQLite, applies the promo code, shipping and tax, and writes the order and its items in one transaction. If the server is unreachable, checkout falls back to a local-only order.
- **Your data.** Cart, favorites, followed brands and the demo profile never leave the browser.

### API

| Endpoint | Description |
| --- | --- |
| `GET /api/products?q=&cat=&type=&limit=` | Search the catalog (`limit` up to 200) |
| `POST /api/orders` | Create an order from `{ email, name, street, city, zip, promo?, items: [{ id, opt?, qty }] }` |
| `GET /api/orders?email=` | List orders for an email address |

> **Not production-ready.** There is no real authentication: the demo profile has no password, and `GET /api/orders` looks orders up by email alone. Add proper auth and a payment provider before using any of this for real customers.

## Customizing

- **Catalog:** edit `src/data/catalog.ts`, then run `npm run db:seed` and rebuild. For real data, replace the generator with a CMS or API.
- **Photos:** set `image` on a product or brand (for example `"/images/linen-dress.jpg"`) and put the file in `public/images/`. Cards and thumbnails then use the photo instead of the colour block.
- **Look and feel:** colours, radii and shadows are CSS variables at the top of `src/styles/global.css`.
- **Name and logo:** "Kedai" and its logo mark (`public/favicon.svg`, `src/components/LogoMark.astro`) are original artwork by KukerjainAja. If you fork this to launch a shop of your own, swap in your own name and mark.

## Credits

Made by **Ranupane** · **KukerjainAja**.

The home hero background is a photo by **MagicPattern** from [Unsplash](https://unsplash.com/photos/yellow-pink-and-blue-gradient-oPH_5xuMgQw), used under the [Unsplash License](https://unsplash.com/license). The Inter typeface is licensed under the SIL Open Font License 1.1. Details are in [CREDITS.md](CREDITS.md).

## License

The source code, the Kedai name and the logo are released under the [MIT License](LICENSE) — © 2026 Ranupane (KukerjainAja). Third-party material listed in [CREDITS.md](CREDITS.md) keeps its own license.
