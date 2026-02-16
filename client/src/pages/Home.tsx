import { useState, useEffect, memo, useCallback } from "react";
import { Phone, MapPin, Clock, ExternalLink, Navigation, Store, Award, Users, ChevronDown, ShoppingBag, MessageCircle, X, Star, Shield, Truck, RotateCcw, Lock, ChevronRight, HelpCircle, Sparkles, Mail } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

// ────────────────────────────────────────────
// CUSTOM GEM LOGO (SVG)
// ────────────────────────────────────────────
function GemLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a853" />
          <stop offset="50%" stopColor="#f0d68a" />
          <stop offset="100%" stopColor="#c49a48" />
        </linearGradient>
        <linearGradient id="gemFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a5c4a" />
          <stop offset="100%" stopColor="#1a3c34" />
        </linearGradient>
      </defs>
      {/* Top facet */}
      <polygon points="20,2 34,14 6,14" fill="url(#gemGrad)" />
      {/* Left facet */}
      <polygon points="6,14 20,38 20,14" fill="url(#gemFace)" opacity="0.9" />
      {/* Right facet */}
      <polygon points="34,14 20,38 20,14" fill="url(#gemFace)" opacity="0.7" />
      {/* Top-left facet */}
      <polygon points="6,14 13,14 20,2" fill="url(#gemGrad)" opacity="0.8" />
      {/* Top-right facet */}
      <polygon points="34,14 27,14 20,2" fill="url(#gemGrad)" opacity="0.6" />
      {/* Center shine */}
      <polygon points="13,14 20,14 20,26" fill="#f0d68a" opacity="0.3" />
      {/* Outline */}
      <polygon points="20,2 34,14 20,38 6,14" stroke="#d4a853" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  created_at: string;
  images: Array<{ src: string }>;
  variants: Array<{ id: number; price: string; compare_at_price: string | null }>;
}

interface ShopifyResponse {
  products: ShopifyProduct[];
}

const BUSINESS_INFO = {
  name: "Sandhya Gems Corner",
  tagline: "Authentic Gemstone Bracelets & Healing Crystals",
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
  shopifyUrl: "https://sandhyagems.in",
  email: "info@sandhyagems.in",
  collectionUrl: "https://sandhyagems.in/collections/best-gemstone-bracelets-online",
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

function getOptimizedImageUrl(originalUrl: string, width: number = 400): string {
  if (!originalUrl || !originalUrl.includes('cdn.shopify.com')) {
    return originalUrl;
  }
  const url = new URL(originalUrl);
  url.searchParams.set('width', width.toString());
  url.searchParams.set('format', 'webp');
  return url.toString();
}

function getWhatsAppProductUrl(productTitle: string): string {
  const message = encodeURIComponent(`Hi Sandhya Gems, I saw your Bracelet collection on Facebook and want to know more about ${productTitle}.`);
  return `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${message}`;
}

// ────────────────────────────────────────────
// HEADER
// ────────────────────────────────────────────
function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 will-change-transform ${scrolled ? 'bg-[#1a3c34]/95 backdrop-blur-md shadow-lg' : 'bg-[#1a3c34]/80 backdrop-blur-sm'}`} role="banner">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2" aria-label="Sandhya Gems Corner - Home">
          <GemLogo className="w-8 h-8" />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold text-white tracking-wide">Sandhya <span className="text-[#d4a853]">Gems</span></span>
            <span className="text-[9px] text-emerald-300/60 tracking-[0.15em] uppercase font-medium hidden sm:block">Since 2000 • Kolkata</span>
          </div>
        </a>
        <Button asChild size="sm" className="bg-[#d4a853] hover:bg-[#c49a48] text-[#1a3c34] font-semibold">
          <a href={BUSINESS_INFO.collectionUrl} target="_blank" rel="noopener noreferrer" data-testid="button-shop-header" aria-label="Shop our collection">
            <ShoppingBag className="w-4 h-4 mr-2" aria-hidden="true" />
            <span className="hidden sm:inline">Shop Now</span>
            <span className="sm:hidden">Shop</span>
          </a>
        </Button>
      </div>
    </header>
  );
}

// ────────────────────────────────────────────
// HERO SECTION
// ────────────────────────────────────────────
function HeroSection() {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center pt-16" aria-label="Healing Gemstone Bracelets & Crystals">
      <div className="absolute inset-0 bg-[#1a3c34]" aria-hidden="true">
        <img
          src="/hero-bracelet.jpg"
          alt=""
          role="presentation"
          className="w-full h-full object-cover opacity-40"
          style={{ aspectRatio: '16/9' }}
          width="1200"
          height="675"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a3c34] via-[#1a3c34]/60 to-[#1a3c34]/30" aria-hidden="true" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-[#d4a853]/20 border border-[#d4a853]/40 rounded-full px-4 py-1.5 mb-6">
          <Sparkles className="w-4 h-4 text-[#d4a853]" />
          <span className="text-[#d4a853] text-sm font-medium">25+ Years of Trust</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 drop-shadow-lg leading-tight">
          Wear the Energy: Authentic<br className="hidden sm:block" />
          <span className="text-[#d4a853]"> Gemstone Bracelets</span> &amp; Healing Crystals
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-emerald-200 mb-3 max-w-2xl mx-auto font-medium">
          100% Certified Natural Stones. Ethically Sourced. Energized for You.
        </p>
        <p className="text-sm text-emerald-300/70 mb-8">Handpicked crystals for health, wealth & spiritual well-being</p>
        <nav className="flex flex-col sm:flex-row items-center justify-center gap-4" aria-label="Shop actions">
          <Button asChild size="lg" className="min-w-[200px] bg-[#d4a853] hover:bg-[#c49a48] text-[#1a3c34] font-semibold text-base shadow-xl hover:shadow-2xl transition-all">
            <a href="#products" onClick={(e) => { e.preventDefault(); scrollToProducts(); }} data-testid="button-shop-hero" aria-label="Browse our bracelet collection">
              <ShoppingBag className="w-5 h-5 mr-2" aria-hidden="true" />
              Shop Collection
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/30 text-white backdrop-blur-sm bg-white/10 min-w-[200px] hover:bg-white/20 transition-all">
            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent('Hi Sandhya Gems, I saw your Bracelet collection and want to know more.')}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-whatsapp-hero"
              aria-label="Chat with us on WhatsApp"
            >
              <SiWhatsapp className="w-5 h-5 mr-2" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </Button>
        </nav>
        <button
          onClick={scrollToProducts}
          className="mt-12 text-[#d4a853] animate-bounce"
          aria-label="Scroll down to view our bracelet collection"
          data-testid="button-scroll-down"
          type="button"
        >
          <ChevronDown className="w-8 h-8" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────
// BENEFIT ICONS BAR (replaces QuickInfoBar)
// ────────────────────────────────────────────
function BenefitIconsBar() {
  const benefits = [
    { icon: Shield, label: "Certified Natural", desc: "Lab-tested stones" },
    { icon: Truck, label: "Free Shipping", desc: "All over India" },
    { icon: RotateCcw, label: "Easy Returns", desc: "7-day returns" },
    { icon: Lock, label: "Secure Checkout", desc: "100% safe payment" },
  ];

  return (
    <section className="bg-gradient-to-r from-[#1a3c34] to-[#2a5c4a] py-5" aria-label="Our guarantees">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 min-w-[200px] sm:min-w-0 backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#d4a853]/20 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-5 h-5 text-[#d4a853]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm whitespace-nowrap">{benefit.label}</p>
                <p className="text-emerald-200/70 text-xs">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────
// GOOGLE REVIEWS TRUST BADGE (inline)
// ────────────────────────────────────────────
function GoogleReviewsBadge() {
  const googleReviewsUrl = "https://www.google.com/search?q=Sandhya+Gems+Corner+New+Barrackpore+reviews";

  return (
    <a
      href={googleReviewsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="col-span-2 md:col-span-4 flex items-center justify-center gap-4 bg-gradient-to-r from-[#f8f4ea] to-[#fdf9f0] border border-[#d4a853]/20 rounded-2xl p-5 my-2 hover:shadow-lg transition-all group"
      data-testid="trust-google-reviews-inline"
    >
      <img
        src="https://www.google.com/favicon.ico"
        alt="Google"
        className="w-8 h-8"
        width="32"
        height="32"
      />
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold text-[#1a3c34]">4.8</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
      <div className="text-left">
        <p className="font-semibold text-[#1a3c34] text-sm">Google Reviews</p>
        <p className="text-xs text-muted-foreground">Trusted by 10,000+ customers</p>
      </div>
      <ChevronRight className="w-5 h-5 text-[#d4a853] group-hover:translate-x-1 transition-transform ml-auto" />
    </a>
  );
}

// ────────────────────────────────────────────
// PRODUCTS SECTION
// ────────────────────────────────────────────
function ProductsSection() {
  const { data, isLoading, error } = useQuery<ShopifyResponse>({
    queryKey: ['/api/products'],
  });

  const products = [...(data?.products || [])]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 12);

  return (
    <section id="products" className="py-12 md:py-16 bg-background scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">✨ Our Bracelet Collection</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Handpicked healing gemstone bracelets — each stone certified, energized, and ready to transform your life.</p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
                <CardContent className="p-3">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Unable to load products</p>
            <Button asChild>
              <a href={BUSINESS_INFO.collectionUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Store
              </a>
            </Button>
          </div>
        )}

        {products.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {products.map((product, index) => {
                const productUrl = `${BUSINESS_INFO.shopifyUrl}/products/${product.handle}`;
                const originalImageUrl = product.images[0]?.src || 'https://placehold.co/400x400/1a3c34/d4a853?text=Bracelet';
                const imageUrl = getOptimizedImageUrl(originalImageUrl, 400);

                return (
                  <React.Fragment key={product.id}>
                    {/* Insert Google Reviews badge after first 4 products */}
                    {index === 4 && <GoogleReviewsBadge />}
                    <Card className="overflow-hidden group flex flex-col h-full border-border/50 hover:shadow-lg hover:border-[#d4a853]/30 transition-all duration-300" data-testid={`product-card-${product.id}`}>
                      <div className="aspect-square overflow-hidden bg-muted relative">
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ aspectRatio: '1/1' }}
                          loading="lazy"
                          width={400}
                          height={400}
                          decoding="async"
                        />
                      </div>
                      <CardContent className="p-3 flex flex-col flex-1">
                        <h3 className="font-medium text-sm line-clamp-2 mb-1.5" title={product.title}>
                          {product.title}
                        </h3>
                        <div className="mb-2">
                          {product.variants[0]?.compare_at_price && parseFloat(product.variants[0].compare_at_price) > parseFloat(product.variants[0].price) ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-[#1a3c34] font-bold text-base">
                                  {formatPrice(product.variants[0].price)}
                                </span>
                                <span className="text-muted-foreground text-xs line-through">
                                  {formatPrice(product.variants[0].compare_at_price)}
                                </span>
                              </div>
                              <span className="text-[#25a55f] text-xs font-semibold">
                                {Math.round(((parseFloat(product.variants[0].compare_at_price) - parseFloat(product.variants[0].price)) / parseFloat(product.variants[0].compare_at_price)) * 100)}% off
                              </span>
                            </>
                          ) : (
                            <span className="text-[#1a3c34] font-bold text-base">
                              {formatPrice(product.variants[0]?.price || "0")}
                            </span>
                          )}
                        </div>
                        <div className="mt-auto flex flex-col gap-1.5">
                          <Button asChild size="sm" className="w-full bg-[#1a3c34] hover:bg-[#2a5c4a] text-white">
                            <a
                              href={productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-testid={`button-buy-${product.id}`}
                            >
                              <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                              Buy Now
                            </a>
                          </Button>
                          <Button asChild size="sm" variant="outline" className="w-full border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 text-xs">
                            <a
                              href={getWhatsAppProductUrl(product.title)}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-testid={`button-whatsapp-${product.id}`}
                            >
                              <SiWhatsapp className="w-3.5 h-3.5 mr-1" />
                              <span className="hidden sm:inline">Buy on </span>WhatsApp
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </React.Fragment>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Button asChild size="lg" className="bg-[#d4a853] hover:bg-[#c49a48] text-[#1a3c34] font-semibold shadow-lg">
                <a href={BUSINESS_INFO.collectionUrl} target="_blank" rel="noopener noreferrer" data-testid="button-view-all">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View All Bracelets
                </a>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ────────────────────────────────────────────
// TRUST SECTION
// ────────────────────────────────────────────
function TrustSection() {
  const trustItems = [
    {
      icon: Award,
      title: `${BUSINESS_INFO.yearsInBusiness}+ Years`,
      description: "Serving families with trust, quality, and authentic gemstones",
      color: "text-[#d4a853]",
      bg: "bg-[#d4a853]/10",
    },
    {
      icon: Users,
      title: `${BUSINESS_INFO.customerCount} Customers`,
      description: "Happy families across Kolkata and all over India",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: Star,
      title: "4.8★ on Google",
      description: "Rated among the best gemstone shops in the region",
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-[#f8f4ea] to-background" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Why Customers Trust Us</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-lg mx-auto">Generations of excellence in gemstone expertise</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trustItems.map((item, index) => (
            <Card key={index} className="text-center border-border/50 hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <h3 className="font-bold text-lg mb-2" data-testid={`trust-title-${index}`}>{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────
// TESTIMONIALS SECTION
// ────────────────────────────────────────────
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
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">What Our Customers Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full border-border/50 hover:shadow-md transition-all">
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
              View All Reviews on Google
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────
// FAQ SECTION (NEW)
// ────────────────────────────────────────────
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Are these real stones?",
      answer: "Yes, absolutely! All our gemstones are 100% natural and certified. Each stone comes with a certificate of authenticity. We have been in the gemstone business for 25+ years and our reputation is built on trust and quality."
    },
    {
      question: "How to choose the right bracelet?",
      answer: "Choosing a gemstone bracelet depends on your astrological chart, health needs, or personal preference. Our experts can guide you through WhatsApp or a phone call. Popular choices include Tiger Eye for confidence, Rose Quartz for love, and Amethyst for calm."
    },
    {
      question: "What is the shipping time?",
      answer: "We ship all over India. Orders are dispatched within 1-2 business days. Delivery typically takes 3-5 business days for metros and 5-7 days for other cities. You will receive a tracking number once shipped."
    },
    {
      question: "Do you offer returns or exchanges?",
      answer: "Yes, we offer a 7-day easy return policy. If you are not satisfied with your purchase, you can return or exchange it within 7 days of delivery. The product must be unused and in original packaging."
    },
    {
      question: "Can I visit your store in Kolkata?",
      answer: "Of course! Our store is located at Shop No 2A, New Barrackpore Post Office Market, Kolkata - 700131. We are open 7 days a week. Visit us to see our full collection in person."
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-[#f8f4ea]" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <HelpCircle className="w-8 h-8 text-[#d4a853] mx-auto mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know before you buy</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border/50 rounded-xl overflow-hidden bg-card hover:border-[#d4a853]/30 transition-colors"
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
                data-testid={`faq-toggle-${index}`}
                type="button"
              >
                <span className="font-medium text-sm sm:text-base pr-4">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-[#d4a853] flex-shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────
// LOCATION SECTION (kept as-is but updated theme)
// ────────────────────────────────────────────
function LocationSection() {
  return (
    <section id="location" className="py-12 md:py-16 bg-muted/30 scroll-mt-16" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
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
                  backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=50')`,
                  backgroundColor: '#e5e7eb',
                  aspectRatio: '16/9',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/80 to-transparent flex items-end justify-center pb-16">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg text-center">
                  <div className="flex items-center justify-center gap-2 text-[#1a3c34] font-semibold text-lg">
                    <MapPin className="w-6 h-6 text-red-500" />
                    <span>Sandhya Gems Corner</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">New Barrackpore Post Office Market, Kolkata - 700131</p>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-[#1a3c34] text-white px-4 py-2 rounded-lg font-medium text-sm shadow-lg flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Open in Google Maps
              </div>
            </a>
          </div>
          <div className="lg:col-span-2 flex flex-col justify-center">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-[#d4a853] flex-shrink-0 mt-1" />
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
                <div className="flex items-start gap-3 mb-6">
                  <Mail className="w-5 h-5 text-[#d4a853] flex-shrink-0 mt-0.5" />
                  <a href={`mailto:${BUSINESS_INFO.email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {BUSINESS_INFO.email}
                  </a>
                </div>
                <Button asChild className="w-full bg-[#1a3c34] hover:bg-[#2a5c4a]">
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

// ────────────────────────────────────────────
// BUSINESS HOURS (kept, updated theme)
// ────────────────────────────────────────────
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
                      className={`flex items-center justify-between px-4 py-3 ${isToday ? 'bg-[#1a3c34]/5' : ''}`}
                      data-testid={`hours-${schedule.day.toLowerCase()}`}
                    >
                      <span className={`font-medium ${isToday ? 'text-[#1a3c34]' : ''}`}>
                        {schedule.day}
                        {isToday && <span className="ml-2 text-xs bg-[#1a3c34] text-white px-2 py-0.5 rounded">Today</span>}
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
            Note: Tuesday &amp; Thursday are short days (till 3:30 PM only)
          </p>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────
// CTA SECTION
// ────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-12 md:py-16 bg-[#1a3c34]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Sparkles className="w-8 h-8 text-[#d4a853] mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Find Your Perfect Healing Bracelet
        </h2>
        <p className="text-emerald-200/80 mb-8 max-w-2xl mx-auto">
          Explore our curated collection of certified gemstone bracelets.
          Each piece is handcrafted with authentic, energized stones to support your health, wealth, and well-being.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="min-w-[200px] bg-[#d4a853] hover:bg-[#c49a48] text-[#1a3c34] font-semibold shadow-xl">
            <a
              href={BUSINESS_INFO.collectionUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-shop-online"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shop Bracelets
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/30 text-white bg-white/10 min-w-[200px] hover:bg-white/20">
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

// ────────────────────────────────────────────
// FOOTER
// ────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8 pb-24 md:pb-8" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GemLogo className="w-6 h-6" />
            <span className="font-semibold">{BUSINESS_INFO.name}</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground" aria-label="Footer contact links">
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
              aria-label="Visit our Kolkata store"
            >
              <Store className="w-4 h-4" aria-hidden="true" />
              Visit our Kolkata Store
            </a>
            <a
              href={`mailto:${BUSINESS_INFO.email}`}
              className="hover:text-foreground flex items-center gap-1"
              data-testid="link-email-footer"
              aria-label={`Email us at ${BUSINESS_INFO.email}`}
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              {BUSINESS_INFO.email}
            </a>
            <a
              href={BUSINESS_INFO.collectionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground flex items-center gap-1"
              data-testid="link-shop-footer"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Online Store
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

// ────────────────────────────────────────────
// WHATSAPP FLOATING BUTTON
// ────────────────────────────────────────────
function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent('Hi Sandhya Gems, I saw your Bracelet collection on Facebook and want to know more about [Product].')}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-transform hover:scale-110 active:scale-95"
      aria-label="Chat with us on WhatsApp"
      data-testid="button-whatsapp"
      title="Chat on WhatsApp"
    >
      <SiWhatsapp className="w-7 h-7 text-white" aria-hidden="true" />
    </a>
  );
}

// ────────────────────────────────────────────
// STICKY MOBILE FOOTER (NEW)
// ────────────────────────────────────────────
function StickyMobileFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#1a3c34]/95 backdrop-blur-md border-t border-[#d4a853]/30 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
      <Button asChild size="lg" className="w-full bg-[#d4a853] hover:bg-[#c49a48] text-[#1a3c34] font-bold text-base shadow-lg">
        <a href={BUSINESS_INFO.collectionUrl} target="_blank" rel="noopener noreferrer" data-testid="button-shop-sticky">
          <ShoppingBag className="w-5 h-5 mr-2" />
          Shop Collection
        </a>
      </Button>
    </div>
  );
}

// ────────────────────────────────────────────
// WELCOME POPUP
// ────────────────────────────────────────────
function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent('Hi Sandhya Gems, I saw your Bracelet collection and want to know more!')}`;

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenWelcomePopup');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 4000);
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative border border-[#d4a853]/20">
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
          <h3 id="popup-title" className="text-xl font-bold text-[#1a3c34] mb-2">
            Looking for the Perfect Bracelet?
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Chat with our crystal experts on WhatsApp. Get personalized recommendations for your healing journey.
          </p>
          <Button
            onClick={handleConnect}
            type="button"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white"
            size="lg"
            data-testid="button-connect-whatsapp"
          >
            <SiWhatsapp className="w-5 h-5 mr-2" />
            Chat with Expert
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

// ────────────────────────────────────────────
// MAIN PAGE: React import needed for Fragment
// ────────────────────────────────────────────
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:p-4">
        Skip to main content
      </a>
      <Header />
      <main className="flex-1" role="main" id="main-content">
        <HeroSection />
        <BenefitIconsBar />
        <ProductsSection />
        <TrustSection />
        <TestimonialsSection />
        <FAQSection />
        <LocationSection />
        <BusinessHoursSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
      <StickyMobileFooter />
      {/* <WelcomePopup /> */}
    </div>
  );
}