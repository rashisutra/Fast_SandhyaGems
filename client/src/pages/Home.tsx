import { useState, useEffect } from "react";
import { Phone, MapPin, Clock, ExternalLink, Navigation, Store, Award, Users, ChevronDown, ShoppingBag, MessageCircle, X, Star } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  images: Array<{ src: string }>;
  variants: Array<{ id: number; price: string }>;
}

interface ShopifyResponse {
  products: ShopifyProduct[];
}

const BUSINESS_INFO = {
  name: "Sandhya Gems Corner",
  tagline: "Your Trusted Gemstone Dealer Since Generations",
  phone: "8240673685",
  phoneDisplay: "+91 82406-73685",
  whatsapp: "918240673685",
  address: {
    street: "Shop No 2A, New Barrackpore Post Office Market",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700131",
    landmark: "Near New Barrackpore Post Office",
  },
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Sandhya+Gems+Corner+New+Barrackpore+Post+Office+Market+Kolkata+700131",
  staticMapUrl: "https://maps.googleapis.com/maps/api/staticmap?center=22.6983,88.4371&zoom=16&size=600x300&maptype=roadmap&markers=color:red%7C22.6983,88.4371&key=placeholder",
  shopifyUrl: "https://sandhyagems.in",
  collectionUrl: "https://sandhyagems.in/collections/all",
  hours: [
    { day: "Monday", hours: "10:00 AM - 9:30 PM", isShort: false },
    { day: "Tuesday", hours: "10:00 AM - 3:30 PM", isShort: true },
    { day: "Wednesday", hours: "10:00 AM - 9:30 PM", isShort: false },
    { day: "Thursday", hours: "10:00 AM - 3:30 PM", isShort: true },
    { day: "Friday", hours: "10:00 AM - 9:30 PM", isShort: false },
    { day: "Saturday", hours: "10:00 AM - 9:30 PM", isShort: false },
    { day: "Sunday", hours: "10:00 AM - 9:30 PM", isShort: false },
  ],
  yearsInBusiness: 25,
  customerCount: "10,000+",
};

function getCurrentDayIndex(): number {
  return new Date().getDay();
}

function getTodayHours(): { hours: string; isOpen: boolean } {
  const now = new Date();
  const dayIndex = now.getDay();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = BUSINESS_INFO.hours.find(h => h.day === dayNames[dayIndex]);
  
  if (!today) return { hours: "Closed", isOpen: false };
  
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;
  
  const closeHour = today.isShort ? 15 : 21;
  const closeMinute = 30;
  const closeTime = closeHour * 60 + closeMinute;
  const openTime = 10 * 60;
  
  const isOpen = currentTime >= openTime && currentTime <= closeTime;
  
  return { hours: today.hours, isOpen };
}

function formatPrice(price: string): string {
  const num = parseFloat(price);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

// Optimize Shopify CDN images - request smaller size with WebP format
function getOptimizedImageUrl(originalUrl: string, width: number = 400): string {
  if (!originalUrl || !originalUrl.includes('cdn.shopify.com')) {
    return originalUrl;
  }
  // Shopify CDN supports width parameter and format conversion
  const url = new URL(originalUrl);
  url.searchParams.set('width', width.toString());
  url.searchParams.set('format', 'webp');
  return url.toString();
}

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a365d]/95 backdrop-blur-sm border-b border-[#2a4a7a]" role="banner">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center" aria-label="Sandhya Gems Corner - Home">
          <span className="text-xl font-bold text-purple-400 tracking-wide">Sandhya Gems</span>
        </a>
        <Button asChild size="sm">
          <a href={`tel:${BUSINESS_INFO.phone}`} data-testid="button-call-header" aria-label="Call our gem expert">
            <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
            <span className="hidden sm:inline">Talk to Our Gem Expert</span>
            <span className="sm:hidden">Call Expert</span>
          </a>
        </Button>
      </div>
    </header>
  );
}

function HeroSection() {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center pt-16" aria-label="Welcome to Sandhya Gems Corner">
      <div className="absolute inset-0 bg-[#1a365d]" aria-hidden="true">
        <img 
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=70"
          alt=""
          role="presentation"
          className="w-full h-full object-cover"
          width="800"
          height="600"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a365d] via-[#1a365d]/70 to-[#1a365d]/40" aria-hidden="true" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Certified Gemstones in Kolkata
        </h1>
        <p className="text-lg md:text-xl text-purple-300 mb-4 max-w-2xl mx-auto font-medium">
          {BUSINESS_INFO.tagline}
        </p>
        <p className="text-sm text-purple-200 mb-4">Best Panna, Moonga & Manik stones in Kolkata</p>
        <address className="not-italic flex items-center justify-center gap-2 text-gray-200 mb-8">
          <MapPin className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm md:text-base">{BUSINESS_INFO.address.street}, {BUSINESS_INFO.address.city} - {BUSINESS_INFO.address.pincode}</span>
        </address>
        <nav className="flex flex-col sm:flex-row items-center justify-center gap-4" aria-label="Contact options">
          <Button asChild size="lg" className="min-w-[180px]">
            <a href={`tel:${BUSINESS_INFO.phone}`} data-testid="button-call-hero" aria-label="Call our gem expert at +91 82406-73685">
              <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
              Talk to Our Gem Expert
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white backdrop-blur-sm bg-white/10 min-w-[180px]">
            <a href={BUSINESS_INFO.mapUrl} target="_blank" rel="noopener noreferrer" data-testid="button-map-hero" aria-label="Get directions to our store on Google Maps">
              <Navigation className="w-5 h-5 mr-2" aria-hidden="true" />
              Get Directions
            </a>
          </Button>
        </nav>
        <button 
          onClick={scrollToProducts}
          className="mt-12 text-purple-300"
          aria-label="Scroll down to view our gemstone collection"
          data-testid="button-scroll-down"
          type="button"
        >
          <ChevronDown className="w-8 h-8" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function QuickInfoBar() {
  const { hours, isOpen } = getTodayHours();
  
  return (
    <section className="bg-primary text-primary-foreground py-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <Clock className="w-6 h-6 flex-shrink-0" />
            <div>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mr-2 ${isOpen ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                {isOpen ? "Open Now" : "Closed"}
              </span>
              <span className="text-sm font-medium">Today: {hours}</span>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-3">
            <Phone className="w-6 h-6 flex-shrink-0" />
            <a 
              href={`tel:${BUSINESS_INFO.phone}`} 
              className="text-lg font-semibold hover:underline"
              data-testid="link-phone-quickinfo"
            >
              {BUSINESS_INFO.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  const { data, isLoading, error } = useQuery<ShopifyResponse>({
    queryKey: ['/api/products'],
  });

  const products = data?.products?.slice(0, 8) || [];

  return (
    <section id="products" className="py-12 md:py-16 bg-background scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Our Collection</h2>
        <p className="text-center text-muted-foreground mb-8">Handpicked gemstones for every occasion</p>
        
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-muted" />
                <CardContent className="p-3">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Unable to load products</p>
            <Button asChild>
              <a href={BUSINESS_INFO.shopifyUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Our Store
              </a>
            </Button>
          </div>
        )}

        {products.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => {
                const productUrl = `${BUSINESS_INFO.shopifyUrl}/products/${product.handle}`;
                
                // Optimize Shopify images - request 400px WebP for faster loading
                const originalImageUrl = product.images[0]?.src || 'https://placehold.co/400x400/1a365d/d4af37?text=Gemstone';
                const imageUrl = getOptimizedImageUrl(originalImageUrl, 400);
                
                return (
                  <Card key={product.id} className="overflow-hidden group flex flex-col h-full" data-testid={`product-card-${product.id}`}>
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img 
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={400}
                        height={400}
                        decoding="async"
                      />
                    </div>
                    <CardContent className="p-3 flex flex-col flex-1">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1" title={product.title}>
                        {product.title}
                      </h3>
                      <p className="text-primary font-bold text-base mb-1">
                        {formatPrice(product.variants[0]?.price || "0")}
                      </p>
                      <div className="mt-auto">
                        <Button asChild size="sm" className="w-full">
                          <a 
                            href={productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid={`button-buy-${product.id}`}
                          >
                            <ShoppingBag className="w-4 h-4 mr-1" />
                            Know More
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="text-center mt-8">
              <Button asChild size="lg">
                <a href={BUSINESS_INFO.collectionUrl} target="_blank" rel="noopener noreferrer" data-testid="button-view-all">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View All Products
                </a>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section id="location" className="py-12 md:py-16 bg-muted/30 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Visit Our Store</h2>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <a 
              href={BUSINESS_INFO.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-video rounded-xl overflow-hidden border border-border relative group"
              data-testid="link-map-image"
            >
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=70')`,
                  backgroundColor: '#e5e7eb',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a365d]/80 to-transparent flex items-end justify-center pb-16">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg text-center">
                  <div className="flex items-center justify-center gap-2 text-[#1a365d] font-semibold text-lg">
                    <MapPin className="w-6 h-6 text-red-500" />
                    <span>Sandhya Gems Corner</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">New Barrackpore Post Office Market, Kolkata - 700131</p>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm shadow-lg flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Open in Google Maps
              </div>
            </a>
          </div>
          <div className="lg:col-span-2 flex flex-col justify-center">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Store Address</h3>
                    <address className="not-italic text-muted-foreground leading-relaxed">
                      {BUSINESS_INFO.address.street}<br />
                      {BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.state}<br />
                      PIN: {BUSINESS_INFO.address.pincode}
                    </address>
                    <p className="text-sm text-muted-foreground mt-2">
                      {BUSINESS_INFO.address.landmark}
                    </p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <a 
                    href={BUSINESS_INFO.mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    data-testid="button-get-directions"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function BusinessHoursSection() {
  const currentDayIndex = getCurrentDayIndex();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[currentDayIndex];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Business Hours</h2>
        <p className="text-center text-muted-foreground mb-8">We're open 7 days a week</p>
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {BUSINESS_INFO.hours.map((schedule) => {
                  const isToday = schedule.day === todayName;
                  return (
                    <li 
                      key={schedule.day}
                      className={`flex items-center justify-between px-4 py-3 ${isToday ? 'bg-primary/10' : ''}`}
                      data-testid={`hours-${schedule.day.toLowerCase()}`}
                    >
                      <span className={`font-medium ${isToday ? 'text-primary' : ''}`}>
                        {schedule.day}
                        {isToday && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Today</span>}
                      </span>
                      <span className={`${schedule.isShort ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'}`}>
                        {schedule.hours}
                        {schedule.isShort && <span className="ml-1 text-xs">(Short)</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Note: Tuesday & Thursday are short days (till 3:30 PM only)
          </p>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const trustItems = [
    {
      icon: Award,
      title: `${BUSINESS_INFO.yearsInBusiness}+ Years`,
      description: "Serving the community with trust and quality",
    },
    {
      icon: Users,
      title: `${BUSINESS_INFO.customerCount} Customers`,
      description: "Happy families across Kolkata",
    },
    {
      icon: Store,
      title: "Physical Store",
      description: "Visit us at New Barrackpore Post Office Market",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustItems.map((item, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2" data-testid={`trust-title-${index}`}>{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const googleReviewsUrl = "https://www.google.com/search?q=Sandhya+Gems+Corner+New+Barrackpore+reviews";
  
  const testimonials = [
    {
      name: "Rajesh Kumar",
      rating: 5,
      text: "Excellent quality gemstones with proper certification. The owner is very knowledgeable and helped me choose the perfect Pukhraj for my daughter.",
      date: "2 months ago"
    },
    {
      name: "Priya Sharma",
      rating: 5,
      text: "Trustworthy shop with genuine stones. I bought a Panna stone and they explained everything about its benefits. Highly recommended!",
      date: "3 months ago"
    },
    {
      name: "Amit Das",
      rating: 5,
      text: "Best gemstone shop in North Kolkata. Fair prices and authentic certificates. Been buying from them for years.",
      date: "1 month ago"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              className="w-6 h-6"
              width="24"
              height="24"
            />
            <span className="font-semibold text-lg">Google Reviews</span>
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-3xl font-bold text-[#1a365d]">4.8</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-5 h-5 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-400/80 text-yellow-400'}`} 
                />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground">Based on Google reviews</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-5">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{testimonial.name}</span>
                  <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <a 
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-google-reviews"
            >
              <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
              View All Reviews
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-12 md:py-16 bg-[#1a365d]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Explore Our Full Collection
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Browse our extensive collection of certified and natural gemstones. 
          From traditional cuts to rare pieces, find the perfect gemstone for every occasion.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="min-w-[200px]">
            <a 
              href={BUSINESS_INFO.collectionUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              data-testid="button-shop-online"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Visit Online Store
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white bg-white/10 min-w-[200px]">
            <a href={`tel:${BUSINESS_INFO.phone}`} data-testid="button-call-cta">
              <Phone className="w-5 h-5 mr-2" />
              Call to Inquire
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="font-semibold">{BUSINESS_INFO.name}</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground" aria-label="Footer contact links">
            <a 
              href={`tel:${BUSINESS_INFO.phone}`} 
              className="hover:text-foreground flex items-center gap-1"
              data-testid="link-phone-footer"
              aria-label={`Call us at ${BUSINESS_INFO.phoneDisplay}`}
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              {BUSINESS_INFO.phoneDisplay}
            </a>
            <a 
              href={BUSINESS_INFO.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground flex items-center gap-1"
              data-testid="link-location-footer"
              aria-label="View our location on Google Maps"
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              New Barrackpore, Kolkata
            </a>
          </nav>
        </div>
        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.</p>
          <p className="mt-1">{BUSINESS_INFO.address.street}, {BUSINESS_INFO.address.city} - {BUSINESS_INFO.address.pincode}</p>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=I%20am%20interested%20in%20a%20gemstone%20from%20your%20Kolkata%20store.`;
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-transform hover:scale-110 active:scale-95"
      aria-label="Chat with us on WhatsApp"
      data-testid="button-whatsapp"
      title="Chat on WhatsApp"
    >
      <SiWhatsapp className="w-7 h-7 text-white" aria-hidden="true" />
    </a>
  );
}

function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=Hi!%20I%20want%20to%20learn%20more%20about%20gemstones.`;

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenWelcomePopup');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenWelcomePopup', 'true');
  };

  const handleConnect = () => {
    sessionStorage.setItem('hasSeenWelcomePopup', 'true');
    window.open(whatsappUrl, '_blank');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="popup-title">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close popup"
          data-testid="button-close-popup"
          type="button"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
            <SiWhatsapp className="w-8 h-8 text-white" />
          </div>
          <h3 id="popup-title" className="text-xl font-bold text-[#1a365d] mb-2">
            Want to Learn About Gemstones?
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Connect with our gemstone experts on WhatsApp for personalized guidance on finding the perfect stone for you.
          </p>
          <Button
            onClick={handleConnect}
            type="button"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white"
            size="lg"
            data-testid="button-connect-whatsapp"
          >
            <SiWhatsapp className="w-5 h-5 mr-2" />
            Connect on WhatsApp
          </Button>
          <button
            onClick={handleClose}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
            data-testid="button-maybe-later"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:p-4">
        Skip to main content
      </a>
      <Header />
      <main className="flex-1" role="main" id="main-content">
        <HeroSection />
        <QuickInfoBar />
        <ProductsSection />
        <LocationSection />
        <BusinessHoursSection />
        <TrustSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
      {/* <WelcomePopup /> */}
    </div>
  );
}