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
- **Product Grid**: 8 best-seller products from Shopify with Quick Buy buttons
- **Location Section**: Static map image + address card (click opens Google Maps)
- **Business Hours**: Full weekly schedule with current day highlight
- **Trust Indicators**: Years in business, customer count, physical store
- **Floating WhatsApp Button**: Green bubble with pre-filled message
- **CTA Section**: Links to Shopify store
- **Footer**: NAP (Name, Address, Phone) for local SEO

## Business Information
- **Name**: Sandhya Gems Corner
- **Type**: Gemstone Dealer (NOT jeweler)
- **Address**: Shop No 2A, New Barrackpore Post Office Market, Kolkata 700131
- **Phone**: +91-9007746465
- **WhatsApp**: 919007746465
- **Hours**: 
  - Mon, Wed, Fri-Sun: 10:00 AM - 9:30 PM
  - Tue, Thu: 10:00 AM - 3:30 PM (Short days)

## SEO Features
- **Title**: "Natural Certified Gemstones in Kolkata | Sandhya Gems Corner"
- **H1**: "Certified Gemstones in Kolkata"
- **Meta Description**: "Trusted gemstone shop in New Barrackpore since 2011. Certified Panna, Moonga, and Manik stones."
- Schema.org JewelryStore structured data with geo coordinates (22.6983, 88.4371)
- Open Graph meta tags
- Geo meta tags for local SEO
- Canonical URL
- Semantic HTML with proper heading hierarchy

## Design System
- **Font**: Inter (Google Fonts)
- **Colors**: Deep Blue (#1a365d) and Gold (#d4af37) theme
- **Animations**: None (speed-first approach, only smooth scroll)
- **Mobile-first**: Responsive design with touch-friendly tap targets
- **Speed optimized**: All images have width/height for CLS, lazy loading enabled

## API Routes
- `GET /api/products` - Server-side proxy fetching from https://sandhyagems.in/collections/best-seller/products.json?limit=8

## Product Links
- **Quick Buy**: Links to `https://sandhyagems.in/cart/{variant_id}:1` (direct checkout)
- **View All Products**: Links to `https://sandhyagems.in/collections/all`

## Recent Changes
- January 2026: Updated to Gemstone Dealer branding, new phone number, best-seller collection, Quick Buy buttons, WhatsApp with pre-filled message