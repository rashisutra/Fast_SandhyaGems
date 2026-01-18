# Sandhya Gems Corner - Local SEO Landing Page

## Overview
High-performance, single-page landing page for Sandhya Gems Corner, a jewelry store in New Barrackpore, Kolkata. Designed for local SEO optimization and fast PageSpeed performance.

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
├── routes.ts              # API routes (minimal for this static page)
├── storage.ts             # In-memory storage
shared/
└── schema.ts              # Database schema (not used for this page)
```

## Key Features
- **Hero Section**: Background image with dark wash overlay
- **Quick Info Bar**: Open/closed status, phone number
- **Location Section**: Google Maps embed + address card
- **Business Hours**: Full weekly schedule with current day highlight
- **Trust Indicators**: Years in business, customer count, physical store
- **CTA Section**: Links to Shopify store
- **Footer**: NAP (Name, Address, Phone) for local SEO

## Business Information
- **Name**: Sandhya Gems Corner
- **Address**: Shop No 2A, New Barrackpore Post Office Market, Kolkata 700131
- **Phone**: +91-9007746465
- **Hours**: 
  - Mon, Wed, Fri-Sun: 10:00 AM - 9:30 PM
  - Tue, Thu: 10:00 AM - 3:30 PM (Short days)

## SEO Features
- Schema.org JewelryStore structured data
- Open Graph meta tags
- Geo meta tags for local SEO
- Canonical URL
- Semantic HTML with proper heading hierarchy

## Design System
- **Font**: Inter (Google Fonts)
- **Colors**: Gold/amber theme (primary: 39 85% 45%)
- **Animations**: None (speed-first approach, only smooth scroll)
- **Mobile-first**: Responsive design with touch-friendly tap targets

## Recent Changes
- January 2026: Initial build with all sections, SEO markup, and responsive design