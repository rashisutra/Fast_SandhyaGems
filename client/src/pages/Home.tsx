import { Phone, MapPin, Clock, ExternalLink, Navigation, Store, Award, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BUSINESS_INFO = {
  name: "Sandhya Gems Corner",
  tagline: "Your Trusted Neighborhood Jeweler Since Generations",
  phone: "+919007746465",
  phoneDisplay: "+91 9007-746-465",
  address: {
    street: "Shop No 2A, New Barrackpore Post Office Market",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700131",
    landmark: "Near New Barrackpore Post Office",
  },
  mapUrl: "https://www.google.com/maps/search/?api=1&query=New+Barrackpore+Post+Office+Market+Kolkata+700131",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.5!2d88.376!3d22.792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQ3JzMxLjIiTiA4OMKwMjInMzUuNCJF!5e0!3m2!1sen!2sin!4v1234567890",
  shopifyUrl: "https://sandhyagems.in",
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

function getDayIndex(dayName: string): number {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days.indexOf(dayName);
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

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Store className="w-6 h-6 text-primary" />
          <span className="font-semibold text-lg">{BUSINESS_INFO.name}</span>
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
  const scrollToLocation = () => {
    document.getElementById("location")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center pt-16">
      {/* Hero background - replace with actual store photo */}
      <div 
        className="absolute inset-0 bg-amber-800"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark wash overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          {BUSINESS_INFO.name}
        </h1>
        <p className="text-lg md:text-xl text-amber-100 mb-6 max-w-2xl mx-auto">
          {BUSINESS_INFO.tagline}
        </p>
        <div className="flex items-center justify-center gap-2 text-amber-100 mb-8">
          <MapPin className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm md:text-base">{BUSINESS_INFO.address.street}, {BUSINESS_INFO.address.city} - {BUSINESS_INFO.address.pincode}</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-amber-900 hover:bg-amber-50 border-white min-w-[180px]">
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
          onClick={scrollToLocation}
          className="mt-12 text-amber-200"
          aria-label="Scroll to see more"
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
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mr-2 ${isOpen ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
                {isOpen ? "Open Now" : "Closed"}
              </span>
              <span className="text-sm">Today: {hours}</span>
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

function LocationSection() {
  return (
    <section id="location" className="py-12 md:py-16 bg-background scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Visit Our Store</h2>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="aspect-video rounded-xl overflow-hidden border border-border bg-muted">
              <iframe
                src={BUSINESS_INFO.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sandhya Gems Corner Location Map"
                data-testid="iframe-map"
              ></iframe>
            </div>
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
    <section className="py-12 md:py-16 bg-muted/30">
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
                      className={`flex items-center justify-between px-4 py-3 ${isToday ? 'bg-primary/5' : ''}`}
                      data-testid={`hours-${schedule.day.toLowerCase()}`}
                    >
                      <span className={`font-medium ${isToday ? 'text-primary' : ''}`}>
                        {schedule.day}
                        {isToday && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Today</span>}
                      </span>
                      <span className={`${schedule.isShort ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
                        {schedule.hours}
                        {schedule.isShort && <span className="ml-1 text-xs">(Short Day)</span>}
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
    <section className="py-12 md:py-16 bg-background">
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
    <section className="py-12 md:py-16 bg-gradient-to-b from-amber-900 to-amber-950">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Explore Our Full Collection
        </h2>
        <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
          Browse our extensive collection of gold, silver, and diamond jewelry. 
          From traditional designs to contemporary pieces, find the perfect jewelry for every occasion.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-amber-900 hover:bg-amber-50 min-w-[200px]">
            <a 
              href={BUSINESS_INFO.shopifyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              data-testid="button-shop-online"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Visit Online Store
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 min-w-[200px]">
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

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <QuickInfoBar />
        <LocationSection />
        <BusinessHoursSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}