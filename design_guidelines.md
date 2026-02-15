# Sandhya Gems Corner - Design Guidelines

## Design Approach
**System:** Material Design principles adapted for local business + speed optimization
**Strategy:** Trust-building local business page prioritizing conversion and performance over decorative elements

## Core Design Elements

### Typography
- **Primary Font:** Inter (Google Fonts CDN) - clean, readable, loads fast
- **Headings:** 700 weight - Business name (3xl/4xl), Sections (2xl)
- **Body:** 400 weight (base/lg) - Address, hours, descriptions
- **Accent:** 600 weight - CTAs, key info highlights

### Layout System
**Spacing Units:** Tailwind's 4, 6, 8, 12, 16, 24 (consistent, minimal variety for performance)
**Container:** max-w-6xl centered, px-4 on mobile
**Vertical Rhythm:** py-12 (mobile), py-16 (desktop) for sections

### Component Structure

**1. Header/Navigation (Sticky)**
- Logo/Business name left, Phone CTA right
- Clean single-line layout, subtle shadow on scroll
- Mobile: Hamburger unnecessary (single-page)

**2. Hero Section (Above Fold)**
- **Image:** Store front exterior photo showing physical location (authentic, not stock)
- Height: 60vh mobile, 70vh desktop
- Overlay: Dark gradient (bottom-to-top) for text legibility
- Content (centered, over image): Business name, tagline, primary address, two CTAs (Call Now + View on Map) with backdrop-blur
- Trust signals: Years in business, customer count badge

**3. Quick Info Bar**
- Two-column grid (mobile: stack): Hours today + Phone number
- Contrasting background for immediate visibility
- Icons: Heroicons (clock, phone)

**4. Location & Map Section**
- Two-column: Google Maps embed (left, 60%) + Address details (right, 40%)
- Mobile: Stack with map first
- Include: Full address, landmark reference, parking info
- CTA: "Get Directions" button

**5. Business Hours**
- Clean table/card showing all days
- Highlight current day
- Note special Tuesday/Thursday hours prominently

**6. Trust Indicators**
- Three-column grid (mobile: single): Years established, local presence statement, verified badges
- Minimal icons, text-focused

**7. CTA Section**
- Centered layout: "Visit Our Full Collection" headline
- Button: Link to Shopify store
- Supporting text: Brief store description
- Secondary CTA: Call button

**8. Footer (Minimal)**
- Single row: Business name, phone, minimal nav links
- Schema markup integration (hidden)

### Images
**Required Images:**
1. **Hero:** Store exterior - authentic photo showing "Sandhya Gems Corner" signage and New Barrackpore Post Office Market context (professional quality, well-lit)
2. **Optional:** Small jewelry showcase thumbnails in trust section (compressed, lazy-loaded)

**Image Strategy:** Prioritize ONE high-quality hero image; avoid multiple heavy images for speed

### Component Details
- **Buttons:** Solid fills, rounded-lg, shadow-sm, generous padding (px-6 py-3)
- **Cards:** Subtle borders, minimal shadows, rounded-xl
- **Map Embed:** Lazy-loaded, aspect-ratio-16/9
- **Icons:** Heroicons via CDN (outline style), size-6 standard

### Animations
**None** - Speed is priority. Only smooth scroll behavior.

### Mobile-First Priorities
- Touch-friendly tap targets (min 44px)
- Phone number one-tap callable
- Map directions one-tap accessible
- Compressed images with srcset

### Local SEO Integration Points
- Prominent NAP (Name, Address, Phone) in header/footer
- Schema markup placeholder comments
- Meta description focus on location
- H1: Business name + location

**Design Principle:** Every element serves conversion or local SEO - no decoration for decoration's sake. Clean, trustworthy, fast.