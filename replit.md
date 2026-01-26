# Sandhya Gems Corner - Local SEO Landing Page

## Overview
High-performance, single-page landing page for Sandhya Gems Corner, a **Gemstone Dealer** in New Barrackpore, Kolkata. Designed for local SEO optimization and fast PageSpeed performance.

## Project Structure
```
client/
├── src/
│   ├── pages/
│   │   └── Home.tsx       # Main landing page with all sections
│   ├── components/ui/     # Shadcn UI components
│   ├── App.tsx            # Router setup
│   └── index.css          # Tailwind styles with Inter font
├── index.html             # SEO meta tags and Schema.org markup
server/
├── routes.ts              # API proxy for Shopify products (CORS bypass)
├── storage.ts             # In-memory storage
shared/
└── schema.ts              # Database schema (not used for this page)
```

## Key Features
- **Hero Section**: Background image with dark wash overlay, H1: "Certified Gemstones in Kolkata"
- **Quick Info Bar**: Open/closed status, phone number
- **Product Grid**: 8 Navratna gemstones from Shopify with "Know More" buttons
- **Location Section**: Static map image + address card (click opens Google Maps)
- **Business Hours**: Full weekly schedule with current day highlight
- **Trust Indicators**: Years in business, customer count, physical store
- **Google Reviews**: 4.8 rating display with testimonials
- **Floating WhatsApp Button**: Green bubble with pre-filled message
- **Welcome Popup**: WhatsApp redirect (3-second delay, session-based)
- **CTA Section**: Links to Shopify store
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

## SEO Features
- **Title**: "Natural Certified Gemstones in Kolkata | Sandhya Gems Corner"
- **H1**: "Certified Gemstones in Kolkata"
- **Meta Description**: "Trusted gemstone shop in New Barrackpore since 2011. Certified Panna, Moonga, and Manik stones."
- Schema.org LocalBusiness structured data with geo coordinates (22.6983, 88.4371) and aggregateRating
- Open Graph and Twitter Card meta tags
- Geo meta tags for local SEO (geo.position, ICBM)
- Canonical URL
- Semantic HTML with proper heading hierarchy
- Skip to main content link for accessibility
- ARIA labels and roles throughout for screen readers
- Theme-color meta tag

## Design System
- **Font**: Inter (Google Fonts with font-display: swap)
- **Colors**: Deep Blue (#1a365d) and Purple (#a855f7) theme
- **Animations**: None (speed-first approach, only smooth scroll)
- **Mobile-first**: Responsive design with touch-friendly tap targets
- **Speed optimized**: LCP hero image preloaded, critical CSS inlined, all images have width/height for CLS, lazy loading enabled

## API Routes
- `GET /api/products` - Server-side proxy fetching from https://sandhyagems.in/collections/products.json?limit=8

## Product Links
- **Know More**: Links to product page at `https://sandhyagems.in/products/{handle}`
- **View All Products**: Links to `https://sandhyagems.in/collections/all`

## Recent Changes
- January 2026: Major SEO and performance optimizations
  - Updated to Gemstone Dealer branding with purple accent color
  - Changed product collection to Navratna gemstones
  - "Know More" buttons instead of "Quick Buy" (links to product page)
  - Removed "In-Store Pickup Available" from product cards
  - Enhanced Schema.org LocalBusiness structured data with aggregateRating
  - Added Twitter Card meta tags
  - Added accessibility features: skip link, ARIA labels, role attributes
  - Performance: preload LCP hero image, critical CSS inline, font-display swap
  - Google Reviews testimonials section with 4.8 rating
  - Welcome popup with WhatsApp redirect (currently disabled)