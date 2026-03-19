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
- **Testimonials**: Google Reviews — 4.8 rating, 3 reviews
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
- March 2026: Converted from React/TypeScript/Express monorepo to plain HTML/CSS/JS
  - Removed React, TypeScript, Drizzle ORM, PostgreSQL, shadcn, React Query
  - Single `server.js` replaces full Express server
  - All content now in `public/index.html` — instantly crawlable by Google
  - Page loads in under 1 second on mobile
  - Zero dependencies to break; edit HTML directly to update content
