import { useState, useEffect } from "react";
import { Phone, MapPin, Clock, ExternalLink, Navigation, Store, Award, Users, ChevronDown, ShoppingBag, MessageCircle, X } from "lucide-react";
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
  tagline: "Your Trusted Neighborhood Gemstone Dealer Since Generations",
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

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a365d]/95 backdrop-blur-sm border-b border-[#2a4a7a]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Store className="w-6 h-6 text-primary" />
          <span className="font-semibold text-lg text-white">{BUSINESS_INFO.name}</span>
        </div>
        <Button asChild size="sm">
          <a href={`tel:${BUSINESS_INFO.phone}`} data-testid="button-call-header">
            <Phone className="w-4 h-4 mr-2" />
            Call Now
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
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center pt-16">
      <div 
        className="absolute inset-0 bg-[#1a365d]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a365d] via-[#1a365d]/70 to-[#1a365d]/40" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Certified Gemstones in Kolkata
        </h1>
        <p className="text-lg md:text-xl text-primary mb-6 max-w-2xl mx-auto font-medium">
          {BUSINESS_INFO.tagline}
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-200 mb-8">
          <MapPin className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm md:text-base">{BUSINESS_INFO.address.street}, {BUSINESS_INFO.address.city} - {BUSINESS_INFO.address.pincode}</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="min-w-[180px]">
            <a href={`tel:${BUSINESS_INFO.phone}`} data-testid="button-call-hero">
              <Phone className="w-5 h-5 mr-2" />
              Call Now
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white backdrop-blur-sm bg-white/10 min-w-[180px]">
            <a href={BUSINESS_INFO.mapUrl} target="_blank" rel="noopener noreferrer" data-testid="button-map-hero">
              <Navigation className="w-5 h-5 mr-2" />
              Get Directions
            </a>
          </Button>
        </div>
        <button 
          onClick={scrollToProducts}
          className="mt-12 text-primary"
          aria-label="Scroll to see products"
          data-testid="button-scroll-down"
        >
          <ChevronDown className="w-8 h-8" />
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
                const variantId = product.variants[0]?.id;
                const buyNowUrl = variantId 
                  ? `https://sandhyagems.in/cart/${variantId}:1`
                  : `${BUSINESS_INFO.shopifyUrl}/products/${product.handle}`;
                
                // Use original Shopify image URLs - they're already optimized by Shopify CDN
                const imageUrl = product.images[0]?.src || 'https://placehold.co/400x400/1a365d/d4af37?text=Gemstone';
                
                return (
                  <Card key={product.id} className="overflow-hidden group" data-testid={`product-card-${product.id}`}>
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
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1" title={product.title}>
                        {product.title}
                      </h3>
                      <p className="text-primary font-bold text-base mb-2">
                        {formatPrice(product.variants[0]?.price || "0")}
                      </p>
                      <Button asChild size="sm" className="w-full">
                        <a 
                          href={buyNowUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid={`button-buy-${product.id}`}
                        >
                          <ShoppingBag className="w-4 h-4 mr-1" />
                          Quick Buy
                        </a>
                      </Button>
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
                  backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')`,
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
    <footer className="bg-card border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            <span className="font-semibold">{BUSINESS_INFO.name}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a 
              href={`tel:${BUSINESS_INFO.phone}`} 
              className="hover:text-foreground flex items-center gap-1"
              data-testid="link-phone-footer"
            >
              <Phone className="w-4 h-4" />
              {BUSINESS_INFO.phoneDisplay}
            </a>
            <a 
              href={BUSINESS_INFO.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground flex items-center gap-1"
              data-testid="link-location-footer"
            >
              <MapPin className="w-4 h-4" />
              New Barrackpore, Kolkata
            </a>
          </div>
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
      aria-label="Chat on WhatsApp"
      data-testid="button-whatsapp"
    >
      <SiWhatsapp className="w-7 h-7 text-white" />
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close popup"
          data-testid="button-close-popup"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-4">
            <SiWhatsapp className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#1a365d] mb-2">
            Want to Learn About Gemstones?
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Connect with our gemstone experts on WhatsApp for personalized guidance on finding the perfect stone for you.
          </p>
          <Button
            onClick={handleConnect}
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
      <Header />
      <main className="flex-1">
        <HeroSection />
        <QuickInfoBar />
        <ProductsSection />
        <LocationSection />
        <BusinessHoursSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
      <WelcomePopup />
    </div>
  );
}