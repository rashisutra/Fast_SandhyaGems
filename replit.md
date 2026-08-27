# Sandhya Gems Corner - Local SEO Landing Page

## Overview
High-performance, single-page landing page for Sandhya Gems Corner, a **Gemstone Dealer** in New Barrackpore, Kolkata. Designed for local SEO optimization and fast PageSpeed performance.

**Architecture: Plain HTML + CSS + Vanilla JS** — No React, no TypeScript, no build step, no database. A single minimal Node.js static file server serves everything. Google reads 100% of content instantly from the HTML source.

## Project Structure
```
public/
├── index.html     # Complete page — all content, SEO meta, JSON-LD schema
├── styles.css     # All CSS — hand-written, no framework
├── script.js      # Vanilla JS — store status, product fetch, footer year
├── logo.jpg       # Business logo
└── favicon.png    # Browser tab icon
server.js          # Minimal static file server + /api/products Shopify proxy
```

## How to Edit Content
- **Change any text, headline, price, address, hours**: Edit `public/index.html` directly
- **Change styling/colors**: Edit `public/styles.css`
- **Change business logic (hours, fallback products)**: Edit `public/script.js`
- **No build step needed** — changes are live immediately after saving

## Server (server.js)
- Serves all static files from `public/`
- Proxies `/api/products` → `https://sandhyagems.in/collections/navaratna/products.json` (avoids browser CORS)
- Falls back to hard-coded navratna products if Shopify API is unavailable
- Runs on PORT 5000 (set via environment variable)

## Key Sections in index.html
- **Header**: Sticky nav with logo and call button
- **Hero**: Background gemstone image, H1, address, CTA buttons
- **Quick Info Bar**: Open/Closed status (set by JS), phone number
- **Products Grid**: Live from Shopify API, fallback to hard-coded
- **Location**: Map image linking to Google Maps, address card
- **Business Hours**: Weekly schedule, today highlighted by JS
- **Trust**: 25+ years, 10,000+ customers, physical store
- **CTA**: Links to Shopify store
- **Footer**: NAP (Name, Address, Phone) for local SEO

## Business Information
- **Name**: Sandhya Gems Corner
- **Type**: Gemstone Dealer (NOT jeweler)
- **Address**: Shop No 2A, New Barrackpore Post Office Market, Kolkata 700131
- **Phone**: +91-8240673685
- **WhatsApp**: 918240673685
- **Hours**:
  - Mon, Wed, Fri-Sun: 10:00 AM - 9:30 PM
  - Tue, Thu: 10:00 AM - 3:30 PM (Short days)

## SEO Features (all in index.html, readable without JavaScript)
- **Title**: "Natural Certified Gemstones in Kolkata | Sandhya Gems Corner"
- **H1**: "Certified Gemstones in Kolkata"
- **Meta Description**: Authentic and certified gemstones in New Barrackpore, Kolkata…
- Schema.org LocalBusiness structured data with geo coordinates and aggregateRating
- Open Graph and Twitter Card meta tags
- Geo meta tags (geo.position, ICBM)
- Canonical URL
- Semantic HTML with heading hierarchy
- Skip-to-content link, ARIA labels
- Hero LCP image preloaded

## Design System
- **Font**: Inter (Google Fonts, font-display: swap)
- **Primary color**: #6b46c1 (purple)
- **Navy**: #1a365d (hero, CTA section)
- **Animations**: None — speed-first
- **Mobile-first**: Responsive CSS grid, touch-friendly tap targets

## Workflow
- **Start**: `node server.js`
- **Port**: 5000

## Product Links
- **Know More**: Links to `https://sandhyagems.in/products/{handle}`
- **View All Products**: Links to `https://sandhyagems.in/collections/all`

## Recent Changes
- August 2026: Performance pass
  - Self-hosted the hero image and location map image (`public/hero.webp`, `public/map-preview.webp`) — no more external Unsplash round-trip on page load
  - Self-hosted Inter font (`public/fonts/*.woff2`) — dropped the fonts.googleapis.com/fonts.gstatic.com dependency entirely
  - Added Brotli compression in server.js (prefers `br` over `gzip` when the browser supports it)
  - Tightened CSP now that fonts are self-hosted; fixed a CSP bug that was silently blocking Google Analytics collection requests
  - Replaced the placeholder "50+ reviews" mention with a real link: "4.8 · 129 Google Reviews" sourced from the actual verified Google Business Profile, linking out to Google search results

- August 2026: Site audit fixes
  - Removed leftover `package.json`/`package-lock.json`/`node_modules`/`script/` — server.js has zero dependencies, deploy no longer runs `npm install`
  - Removed fabricated "Google Reviews" testimonials section and the matching fake Review/AggregateRating JSON-LD (was never a real Google integration)
  - Fixed canonical/OG/schema URLs — were pointing at `fast.sandhyagems.in`, now correctly `buy.sandhyagems.in`
  - Swapped the 1.1MB favicon.png (which had been deleted, breaking 6 references) for a proper small icon; og:image/twitter:image/schema now use `logo.jpg` instead
  - Escaped HTML in `script.js` product rendering to close a stored-XSS vector from Shopify product data
  - Added security headers (CSP, X-Frame-Options, HSTS, etc.) in server.js
  - Added `public/robots.txt` and `public/sitemap.xml`
  - `deploy.py` now uses SSH key auth instead of a hardcoded root password

- March 2026: Converted from React/TypeScript/Express monorepo to plain HTML/CSS/JS
  - Removed React, TypeScript, Drizzle ORM, PostgreSQL, shadcn, React Query
  - Single `server.js` replaces full Express server
  - All content now in `public/index.html` — instantly crawlable by Google
  - Page loads in under 1 second on mobile
  - Zero dependencies to break; edit HTML directly to update content
