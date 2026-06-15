import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Scissors, Sparkles, Users, Star, ArrowRight,
  MapPin, Shield, Clock, Zap,
} from "lucide-react";
import { Navbar }     from "@/components/layout/Navbar";
import { Footer }     from "@/components/layout/Footer";
import { SearchBar }  from "@/components/shared/SearchBar";
import { Button }     from "@/components/ui/Button";
import { Badge }      from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Glamr — Mumbai's Salon Marketplace",
  description: "Book top-rated salons across Mumbai. Real-time slots, verified reviews, instant confirmations.",
};

/* ── Static data ────────────────────────────────────────────── */

const CATEGORIES = [
  { icon: "✂️", label: "Hair",            href: "/explore?category=Hair" },
  { icon: "✨", label: "Skin & Facial",   href: "/explore?category=Skin" },
  { icon: "💅", label: "Nails",           href: "/explore?category=Nails" },
  { icon: "💄", label: "Makeup",          href: "/explore?category=Makeup" },
  { icon: "💆", label: "Spa & Massage",   href: "/explore?category=Spa+%26+Massage" },
  { icon: "👰", label: "Bridal",          href: "/explore?category=Bridal" },
  { icon: "🪒", label: "Men's Grooming",  href: "/explore?category=Beard+%26+Grooming" },
  { icon: "🧖", label: "Waxing",          href: "/explore?category=Threading+%26+Waxing" },
];

const AREAS = [
  { name: "Bandra",       emoji: "🌊", count: 142 },
  { name: "Juhu",         emoji: "🏖️", count: 89  },
  { name: "Colaba",       emoji: "🏛️", count: 76  },
  { name: "Worli",        emoji: "🌉", count: 94  },
  { name: "Andheri",      emoji: "🏙️", count: 203 },
  { name: "Lower Parel",  emoji: "🏢", count: 118 },
  { name: "Powai",        emoji: "🏞️", count: 67  },
  { name: "Santacruz",    emoji: "✈️", count: 55  },
];

const STATS = [
  { value: "1,200+", label: "Verified Salons",  icon: Scissors },
  { value: "4.8★",   label: "Avg. Rating",      icon: Star     },
  { value: "50k+",   label: "Happy Customers",  icon: Users    },
  { value: "2 min",  label: "Avg. Booking Time",icon: Zap      },
];

const WHY_GLAMR = [
  {
    icon: Shield,
    title: "Verified & Trusted",
    desc:  "Every salon is physically inspected and hygiene-checked before listing.",
    color: "text-brand-500",
    bg:    "bg-brand-500/10",
  },
  {
    icon: Clock,
    title: "Real-time Slots",
    desc:  "Live availability — no calls, no waiting. Book and get instant confirmation.",
    color: "text-accent-teal",
    bg:    "bg-accent-teal/10",
  },
  {
    icon: Zap,
    title: "Best Prices",
    desc:  "Price-match guarantee across Mumbai. Exclusive member discounts every week.",
    color: "text-accent-rose",
    bg:    "bg-accent-rose/10",
  },
  {
    icon: Sparkles,
    title: "Curated Experiences",
    desc:  "From budget-friendly cuts to luxury spa days — find exactly what you want.",
    color: "text-purple-400",
    bg:    "bg-purple-500/10",
  },
];

const FEATURED_SALONS = [
  {
    name: "Mirrors Salon & Spa",
    area: "Bandra West",
    rating: 4.9,
    reviews: 1243,
    tag: "Luxury",
    img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
    slug: "mirrors-salon-bandra",
    price: 800,
  },
  {
    name: "Enrich Salon",
    area: "Juhu",
    rating: 4.7,
    reviews: 892,
    tag: "Premium",
    img: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80",
    slug: "enrich-salon-juhu",
    price: 500,
  },
  {
    name: "Green Trends",
    area: "Andheri West",
    rating: 4.6,
    reviews: 654,
    tag: "Trending",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    slug: "green-trends-andheri",
    price: 350,
  },
];

const TESTIMONIALS = [
  {
    name:    "Priya S.",
    area:    "Bandra",
    avatar:  "PS",
    rating:  5,
    comment: "Booked a last-minute facial and got a slot within 2 hours. The salon was exactly as described. Glamr is a lifesaver!",
    service: "Facial Treatment",
  },
  {
    name:    "Rahul M.",
    area:    "Powai",
    avatar:  "RM",
    rating:  5,
    comment: "Found the best beard grooming studio near me. Prices are transparent, no hidden charges. Will use again for sure.",
    service: "Beard & Grooming",
  },
  {
    name:    "Ananya K.",
    area:    "Colaba",
    avatar:  "AK",
    rating:  5,
    comment: "Booked my bridal package through Glamr — the salon was top-notch and the whole experience was seamless!",
    service: "Bridal Makeup",
  },
];

/* ── Page ───────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ════════════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════════════ */}
        <section className="relative min-h-[90vh] flex items-center pt-[var(--navbar-height)] overflow-hidden">
          {/* Background mesh */}
          <div className="absolute inset-0 bg-mesh-gold" aria-hidden />
          <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-brand-500/5 blur-3xl" aria-hidden />
          <div className="absolute bottom-0 -left-32 w-80 h-80 rounded-full bg-accent-rose/5 blur-3xl" aria-hidden />

          <div className="container-app relative z-10 py-20">
            <div className="max-w-3xl">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 mb-8 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-sm font-medium text-brand-400">Mumbai&apos;s #1 Salon Marketplace</span>
              </div>

              {/* Headline */}
              <h1 className="font-display font-black mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
                Look Your Best,{" "}
                <span className="text-gradient-gold">Anywhere</span>{" "}
                in Mumbai
              </h1>

              <p className="text-xl text-ink-secondary leading-relaxed mb-10 max-w-2xl animate-slide-up" style={{ animationDelay: "200ms" }}>
                Discover and book top-rated salons, spas & beauty studios across the city.
                Real-time slots. Verified reviews. Instant confirmation.
              </p>

              {/* Search bar */}
              <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
                <SearchBar size="hero" className="max-w-2xl" />
              </div>

              {/* Quick area chips */}
              <div className="flex flex-wrap gap-2 mt-5 animate-slide-up" style={{ animationDelay: "400ms" }}>
                <span className="text-sm text-ink-muted flex items-center gap-1.5">
                  <MapPin size={14} /> Popular:
                </span>
                {["Bandra", "Juhu", "Colaba", "Andheri", "Worli"].map((area) => (
                  <Link
                    key={area}
                    href={`/explore?area=${area}`}
                    className="px-3 py-1.5 rounded-full border border-surface-border bg-surface-raised text-sm text-ink-secondary hover:border-brand-500/50 hover:text-brand-400 transition-all"
                  >
                    {area}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            STATS STRIP
        ════════════════════════════════════════════════════ */}
        <section className="border-y border-surface-border bg-surface-card">
          <div className="container-app py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-surface-border">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center gap-2 md:py-2">
                  <div className="flex items-center gap-2 text-brand-500">
                    <Icon size={20} />
                    <span className="font-display font-bold text-3xl text-ink-primary">{value}</span>
                  </div>
                  <span className="text-sm text-ink-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            CATEGORIES
        ════════════════════════════════════════════════════ */}
        <section className="section">
          <div className="container-app">
            <div className="flex items-end justify-between mb-10">
              <div>
                <Badge variant="gold" className="mb-3">Browse Services</Badge>
                <h2 className="font-display font-bold text-3xl md:text-4xl">
                  What are you{" "}
                  <span className="text-gradient-gold">looking for?</span>
                </h2>
              </div>
              <Button variant="ghost" size="sm" asChild rightIcon={<ArrowRight size={14} />}>
                <Link href="/explore">View all</Link>
              </Button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
              {CATEGORIES.map(({ icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-surface-border bg-surface-card hover:border-brand-500/40 hover:bg-brand-500/5 transition-all duration-200 hover:-translate-y-1"
                >
                  <span className="text-3xl">{icon}</span>
                  <span className="text-xs font-medium text-ink-secondary group-hover:text-brand-400 text-center leading-tight transition-colors">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            FEATURED SALONS
        ════════════════════════════════════════════════════ */}
        <section className="section bg-surface-card border-y border-surface-border">
          <div className="container-app">
            <div className="flex items-end justify-between mb-10">
              <div>
                <Badge variant="rose" dot className="mb-3">Hand-picked</Badge>
                <h2 className="font-display font-bold text-3xl md:text-4xl">
                  Featured <span className="text-gradient-gold">Salons</span>
                </h2>
                <p className="text-ink-secondary mt-2">Top-rated experiences across Mumbai</p>
              </div>
              <Button variant="outline" size="sm" asChild rightIcon={<ArrowRight size={14} />}>
                <Link href="/explore?tag=featured">See all</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURED_SALONS.map((salon, i) => (
                <Link key={salon.slug} href={`/salon/${salon.slug}`} className="group block card">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={salon.img}
                      alt={salon.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={i === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge variant={salon.tag === "Luxury" ? "gold" : salon.tag === "Premium" ? "teal" : "rose"}>
                        {salon.tag === "Luxury" ? "✦ " : ""}{salon.tag}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-lg text-ink-primary group-hover:text-brand-400 transition-colors">
                      {salon.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-ink-muted">
                      <MapPin size={12} /> {salon.area}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5">
                        <Star size={14} className="fill-brand-500 text-brand-500" />
                        <span className="text-sm font-semibold text-ink-primary">{salon.rating}</span>
                        <span className="text-xs text-ink-muted">({salon.reviews.toLocaleString("en-IN")})</span>
                      </div>
                      <span className="text-sm font-bold text-ink-primary">
                        From ₹{salon.price}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            AREAS
        ════════════════════════════════════════════════════ */}
        <section className="section">
          <div className="container-app">
            <div className="mb-10">
              <Badge variant="teal" className="mb-3">By Location</Badge>
              <h2 className="font-display font-bold text-3xl md:text-4xl">
                Explore by <span className="text-gradient-gold">Neighbourhood</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {AREAS.map(({ name, emoji, count }) => (
                <Link
                  key={name}
                  href={`/explore?area=${name}`}
                  className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-surface-border bg-surface-card hover:border-brand-500/40 hover:bg-brand-500/5 transition-all duration-200 hover:-translate-y-1 text-center"
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-sm font-semibold text-ink-primary group-hover:text-brand-400 transition-colors">
                    {name}
                  </span>
                  <span className="text-xs text-ink-muted">{count} salons</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            WHY GLAMR
        ════════════════════════════════════════════════════ */}
        <section className="section bg-surface-card border-y border-surface-border">
          <div className="container-app">
            <div className="text-center mb-14">
              <Badge variant="muted" className="mb-3">Why Glamr</Badge>
              <h2 className="font-display font-bold text-3xl md:text-4xl">
                The smarter way to{" "}
                <span className="text-gradient-gold">book beauty</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {WHY_GLAMR.map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="card p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
                    <Icon size={24} className={color} />
                  </div>
                  <h3 className="font-display font-bold text-xl">{title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            TESTIMONIALS
        ════════════════════════════════════════════════════ */}
        <section className="section">
          <div className="container-app">
            <div className="text-center mb-14">
              <Badge variant="gold" className="mb-3">Reviews</Badge>
              <h2 className="font-display font-bold text-3xl md:text-4xl">
                Mumbaikars <span className="text-gradient-gold">love Glamr</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map(({ name, area, avatar, rating, comment, service }) => (
                <div key={name} className="card p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-black font-bold text-sm shrink-0">
                      {avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-ink-primary">{name}</p>
                      <p className="text-xs text-ink-muted flex items-center gap-1">
                        <MapPin size={10} />{area}
                      </p>
                    </div>
                    <div className="ml-auto flex">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-brand-500 text-brand-500" />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-ink-secondary leading-relaxed">&ldquo;{comment}&rdquo;</p>

                  <Badge variant="muted" className="text-xs">{service}</Badge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            CTA BANNER
        ════════════════════════════════════════════════════ */}
        <section className="section">
          <div className="container-app">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 md:p-16 text-center">
              <div className="absolute inset-0 bg-mesh-gold opacity-30" aria-hidden />
              <div className="relative z-10">
                <h2 className="font-display font-black text-3xl md:text-5xl text-black mb-4">
                  Ready for your glow-up?
                </h2>
                <p className="text-black/70 text-lg mb-8 max-w-md mx-auto">
                  Join 50,000+ Mumbaikars who book their beauty appointments on Glamr.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    size="xl"
                    asChild
                    className="border-black/20 text-black bg-black/10 hover:bg-black/20 hover:border-black/30"
                  >
                    <Link href="/explore">Browse Salons</Link>
                  </Button>
                  <Button
                    size="xl"
                    asChild
                    className="bg-black text-white hover:bg-black/80"
                  >
                    <Link href="/signup">Sign up free →</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}