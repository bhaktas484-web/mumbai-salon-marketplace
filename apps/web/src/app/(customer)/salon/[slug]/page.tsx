"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Phone, Globe, Instagram, Clock, BadgeCheck,
  Star, Share2, Heart, ArrowLeft, Zap, 
} from "lucide-react";
import { Navbar }      from "@/components/layout/Navbar";
import { Footer }      from "@/components/layout/Footer";
import { Button }      from "@/components/ui/Button";
import { Badge }       from "@/components/ui/Badge";
import { StarRating }  from "@/components/ui/StarRating";
import { cn, formatINR, formatDuration, formatTime } from "@/lib/utils";
import type { Salon } from "@/types/salon";

/* ── Mock data (replace with fetch in production) ─────────── */
const MOCK_SALON: Salon = {
  id: "1", slug: "mirrors-salon-bandra",
  name: "Mirrors Salon & Spa", tagline: "Where luxury meets artistry",
  description: "Mumbai's most celebrated luxury salon, Mirrors has been setting the benchmark for premium beauty experiences since 2008. Nestled in the heart of Bandra West, our award-winning team of stylists and therapists deliver world-class results in an atmosphere of calm sophistication.",
  tier: "Luxury", gender: "Unisex",
  location: { lat: 19.0596, lng: 72.8295, address: "14, Linking Road, Bandra West", landmark: "Near Bandra Station", area: "Bandra", pincode: "400050" },
  images: [
    { id: "1", url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=85", alt: "Salon interior", isPrimary: true },
    { id: "2", url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", alt: "Hair styling", isPrimary: false },
    { id: "3", url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80", alt: "Nail art", isPrimary: false },
    { id: "4", url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", alt: "Facial treatment", isPrimary: false },
  ],
  coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=85",
  phone: "+91 98200 12345", email: "hello@mirrorssalon.in",
  website: "https://mirrorssalon.in", instagramHandle: "mirrorssalonmumbai",
  workingHours: {
    monday:    { open: "10:00", close: "20:00", isClosed: false },
    tuesday:   { open: "10:00", close: "20:00", isClosed: false },
    wednesday: { open: "10:00", close: "20:00", isClosed: false },
    thursday:  { open: "10:00", close: "20:00", isClosed: false },
    friday:    { open: "10:00", close: "21:00", isClosed: false },
    saturday:  { open: "09:00", close: "21:00", isClosed: false },
    sunday:    { open: "10:00", close: "18:00", isClosed: false },
  },
  serviceGroups: [
    {
      category: "Hair",
      services: [
        { id: "h1", name: "Haircut & Blowdry", category: "Hair", durationMinutes: 60, price: 1200, gender: "Unisex", isPopular: true },
        { id: "h2", name: "Global Hair Colour", category: "Hair", durationMinutes: 120, price: 3500, discountedPrice: 2999, gender: "Unisex" },
        { id: "h3", name: "Keratin Treatment", category: "Hair", durationMinutes: 180, price: 5500, gender: "Unisex", isPopular: true },
        { id: "h4", name: "Balayage", category: "Hair", durationMinutes: 150, price: 6000, discountedPrice: 4999, gender: "Women" },
      ],
    },
    {
      category: "Skin",
      services: [
        { id: "s1", name: "Classic Facial", category: "Skin", durationMinutes: 60, price: 1800, gender: "Unisex", isPopular: true },
        { id: "s2", name: "Hydrafacial", category: "Skin", durationMinutes: 75, price: 3500, gender: "Unisex" },
        { id: "s3", name: "Anti-Ageing Facial", category: "Skin", durationMinutes: 90, price: 4500, gender: "Women" },
      ],
    },
    {
      category: "Spa & Massage",
      services: [
        { id: "m1", name: "Swedish Massage", category: "Spa & Massage", durationMinutes: 60, price: 2500, gender: "Unisex", isPopular: true },
        { id: "m2", name: "Deep Tissue Massage", category: "Spa & Massage", durationMinutes: 90, price: 3800, gender: "Unisex" },
        { id: "m3", name: "Aromatherapy", category: "Spa & Massage", durationMinutes: 75, price: 3200, gender: "Unisex" },
      ],
    },
  ],
  stylists: [
    { id: "st1", name: "Riya Shah", specialties: ["Balayage","Keratin"], experience: 8, rating: 4.9, reviewCount: 312 },
    { id: "st2", name: "Aryan Mehta", specialties: ["Men's Cut","Beard"], experience: 6, rating: 4.8, reviewCount: 198 },
    { id: "st3", name: "Priya Nair", specialties: ["Facials","Bridal"], experience: 10, rating: 4.9, reviewCount: 445 },
  ],
  rating: {
    overall: 4.9, cleanliness: 5.0, service: 4.9, valueForMoney: 4.6, ambiance: 4.8,
    totalReviews: 1243,
    distribution: { 5: 980, 4: 210, 3: 40, 2: 10, 1: 3 },
  },
  amenities: ["Parking", "AC", "WiFi", "Card Payment", "UPI", "Locker Room", "Beverages", "Wheelchair Access"],
  tags: ["Top Rated", "Trending", "Bridal Specialist"],
  isVerified: true, isOpen: true,
  nextAvailableSlot: "2024-03-15T11:00:00",
  createdAt: "2023-01-01", updatedAt: "2024-03-01",
};

const REVIEWS = [
  { id: "r1", userId: "u1", userName: "Priya S.", rating: 5, comment: "Absolutely loved my experience at Mirrors! Riya did an amazing balayage — exactly what I wanted. The ambiance is top notch and the staff is so welcoming.", createdAt: "2024-03-10", isVerified: true, serviceUsed: "Balayage" },
  { id: "r2", userId: "u2", userName: "Rahul M.", rating: 5, comment: "Best haircut I've had in Mumbai. Aryan understood exactly what I wanted and delivered perfectly. Will definitely be back.", createdAt: "2024-03-08", isVerified: true, serviceUsed: "Haircut" },
  { id: "r3", userId: "u3", userName: "Ananya K.", rating: 4, comment: "Great facial, my skin felt amazing after. Only reason for 4 stars is the wait time was a bit longer than expected. But the quality makes up for it!", createdAt: "2024-03-05", isVerified: true, serviceUsed: "Hydrafacial" },
];

const DAY_SLOTS = ["10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","17:00","17:30","18:00","18:30","19:00"];

export default function SalonDetailPage() {
  const salon = MOCK_SALON;
  const [activeTab,     setActiveTab]     = useState<"services"|"reviews"|"info">("services");
  const [activeCategory,setActiveCategory]= useState(0);
  const [wishlisted,    setWishlisted]    = useState(false);
  const [selectedSlot,  setSelectedSlot]  = useState<string|null>(null);
  const [expandedHours, setExpandedHours] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (id: string) =>
    setSelectedServices(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const TABS = [
    { id: "services", label: "Services" },
    { id: "reviews",  label: `Reviews (${salon.rating.totalReviews.toLocaleString("en-IN")})` },
    { id: "info",     label: "Info & Hours" },
  ] as const;

  const DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"] as const;
  const DAY_LABELS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  return (
    <>
      <Navbar />
      <main className="pt-[var(--navbar-height)]">

        {/* ── Gallery ──────────────────────────────────── */}
        <div className="relative">
          <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-[420px] md:h-[500px]">
            {/* Primary large image */}
            <div className="col-span-4 md:col-span-2 row-span-2 relative overflow-hidden rounded-tl-none rounded-tr-none md:rounded-bl-2xl">
              <Image src={salon.images[0]!.url} alt={salon.images[0]!.alt} fill sizes="50vw" className="object-cover" priority />
            </div>
            {/* Secondary images */}
            {salon.images.slice(1, 4).map((img, i) => (
              <div key={img.id} className={cn("relative overflow-hidden hidden md:block", i === 1 && "rounded-tr-2xl")} >
                <Image src={img.url} alt={img.alt} fill sizes="25vw" className="object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
              </div>
            ))}
            {/* Mobile: single cover */}
            <div className="col-span-4 relative overflow-hidden md:hidden">
              <Image src={salon.coverImage} alt={salon.name} fill sizes="100vw" className="object-cover" priority />
            </div>
          </div>

          {/* Back + actions overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <Link href="/explore" className="glass border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 text-sm font-medium text-white hover:bg-white/10 transition-all">
              <ArrowLeft size={16} /> Back
            </Link>
            <div className="flex items-center gap-2">
             <button
  type="button"
  aria-label="Share salon"
  className="glass border border-white/10 rounded-xl w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
>
  <Share2 size={16} aria-hidden="true" />
</button>

<button
  type="button"
  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
  onClick={() => setWishlisted((p) => !p)}
  className={cn(
    "glass border rounded-xl w-10 h-10 flex items-center justify-center transition-all",
    wishlisted
      ? "border-accent-rose/50 bg-accent-rose/20"
      : "border-white/10 hover:bg-white/10"
  )}
>
  <Heart size={16} aria-hidden="true" />
</button>
            </div>
          </div>
        </div>

        {/* ── Main content ─────────────────────────────── */}
        <div className="container-app py-8">
          <div className="flex gap-10 flex-col lg:flex-row">

            {/* ── Left: Details ────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="gold">✦ {salon.tier}</Badge>
                    <Badge variant="muted">{salon.gender}</Badge>
                    {salon.isVerified && <Badge variant="teal"><BadgeCheck size={11} /> Verified</Badge>}
                    {salon.isOpen
                      ? <Badge variant="success" dot>Open now</Badge>
                      : <Badge variant="rose" dot>Closed</Badge>
                    }
                  </div>
                  <h1 className="font-display font-black text-3xl md:text-4xl text-ink-primary">{salon.name}</h1>
                  {salon.tagline && <p className="text-ink-muted mt-1">{salon.tagline}</p>}

                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <StarRating rating={salon.rating.overall} reviewCount={salon.rating.totalReviews} size="md" />
                    <span className="text-sm text-ink-muted flex items-center gap-1.5">
                      <MapPin size={13} /> {salon.location.area}, {salon.location.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab nav */}
              <div className="flex border-b border-surface-border mb-6">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all",
                      activeTab === tab.id
                        ? "border-brand-500 text-brand-400"
                        : "border-transparent text-ink-muted hover:text-ink-primary"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── SERVICES TAB ─────────────────────────── */}
              {activeTab === "services" && (
                <div>
                  {/* Category pills */}
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
                    {salon.serviceGroups.map((g, i) => (
                      <button
                        key={g.category}
                        onClick={() => setActiveCategory(i)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0",
                          activeCategory === i
                            ? "bg-brand-500/15 border-brand-500/40 text-brand-400"
                            : "border-surface-border text-ink-muted hover:text-ink-primary hover:border-surface-muted"
                        )}
                      >
                        {g.category}
                      </button>
                    ))}
                  </div>

                  {/* Service list */}
                  <div className="space-y-3">
                    {salon.serviceGroups[activeCategory]?.services.map(service => {
                      const selected = selectedServices.includes(service.id);
                      return (
                        <div
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all",
                            selected
                              ? "border-brand-500 bg-brand-500/8"
                              : "border-surface-border bg-surface-card hover:border-surface-muted"
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-sm text-ink-primary">{service.name}</h4>
                              {service.isPopular && <Badge variant="rose">Popular</Badge>}
                              {service.discountedPrice && (
                                <Badge variant="gold">{Math.round(((service.price - service.discountedPrice) / service.price) * 100)}% off</Badge>
                              )}
                            </div>
                            <p className="text-xs text-ink-muted mt-1">{formatDuration(service.durationMinutes)}</p>
                          </div>
                          <div className="flex items-center gap-4 shrink-0 ml-4">
                            <div className="text-right">
                              {service.discountedPrice ? (
                                <>
                                  <p className="font-bold text-ink-primary">{formatINR(service.discountedPrice)}</p>
                                  <p className="text-xs text-ink-disabled line-through">{formatINR(service.price)}</p>
                                </>
                              ) : (
                                <p className="font-bold text-ink-primary">{formatINR(service.price)}</p>
                              )}
                            </div>
                            <div className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                              selected ? "bg-brand-500 border-brand-500" : "border-surface-muted"
                            )}>
                              {selected && <span className="text-black text-xs font-bold">✓</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── REVIEWS TAB ──────────────────────────── */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Rating overview */}
                  <div className="card p-6">
                    <div className="flex gap-8 flex-wrap">
                      <div className="text-center">
                        <p className="font-display font-black text-6xl text-ink-primary">{salon.rating.overall.toFixed(1)}</p>
                        <StarRating rating={salon.rating.overall} showValue={false} size="md" className="justify-center mt-2" />
                        <p className="text-xs text-ink-muted mt-1">{salon.rating.totalReviews.toLocaleString("en-IN")} reviews</p>
                      </div>
                      <div className="flex-1 min-w-48 space-y-2">
                        {([5,4,3,2,1] as const).map(n => {
                          const pct = Math.round((salon.rating.distribution[n] / salon.rating.totalReviews) * 100);
                          return (
                            <div key={n} className="flex items-center gap-3 text-xs">
                              <span className="text-ink-muted w-4 text-right">{n}</span>
                              <Star size={10} className="fill-brand-500 text-brand-500 shrink-0" />
                              <div className="flex-1 h-1.5 bg-surface-raised rounded-full overflow-hidden">
                                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-ink-muted w-8">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="space-y-2 text-sm">
                        {[
                          { label: "Cleanliness",    val: salon.rating.cleanliness },
                          { label: "Service",         val: salon.rating.service },
                          { label: "Value",           val: salon.rating.valueForMoney },
                          { label: "Ambiance",        val: salon.rating.ambiance },
                        ].map(({ label, val }) => (
                          <div key={label} className="flex items-center gap-3">
                            <span className="text-ink-muted w-24">{label}</span>
                            <div className="w-24 h-1.5 bg-surface-raised rounded-full overflow-hidden">
                              <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(val/5)*100}%` }} />
                            </div>
                            <span className="text-ink-primary font-semibold">{val.toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Review cards */}
                  {REVIEWS.map(review => (
                    <div key={review.id} className="card p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-black text-xs font-bold">
                            {review.userName.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-ink-primary flex items-center gap-1.5">
                              {review.userName}
                              {review.isVerified && <BadgeCheck size={13} className="text-brand-500" />}
                            </p>
                            <p className="text-xs text-ink-muted">{new Date(review.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} showValue={false} size="xs" />
                      </div>
                      <p className="text-sm text-ink-secondary leading-relaxed">{review.comment}</p>
                      {review.serviceUsed && <Badge variant="muted">{review.serviceUsed}</Badge>}
                    </div>
                  ))}
                </div>
              )}

              {/* ── INFO TAB ─────────────────────────────── */}
              {activeTab === "info" && (
                <div className="space-y-6">
                  {/* Contact */}
                  <div className="card p-5 space-y-3">
                    <h3 className="font-semibold text-ink-primary">Contact</h3>
                    <div className="space-y-2.5">
                      <a href={`tel:${salon.phone}`} className="flex items-center gap-3 text-sm text-ink-secondary hover:text-brand-400 transition-colors">
                        <Phone size={15} className="text-ink-muted" /> {salon.phone}
                      </a>
                      {salon.website && (
                        <a href={salon.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-ink-secondary hover:text-brand-400 transition-colors">
                          <Globe size={15} className="text-ink-muted" /> {salon.website.replace("https://", "")}
                        </a>
                      )}
                      {salon.instagramHandle && (
                        <a href={`https://instagram.com/${salon.instagramHandle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-ink-secondary hover:text-brand-400 transition-colors">
                          <Instagram size={15} className="text-ink-muted" /> @{salon.instagramHandle}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="card p-5 space-y-3">
                    <h3 className="font-semibold text-ink-primary">Location</h3>
                    <p className="text-sm text-ink-secondary flex items-start gap-2">
                      <MapPin size={15} className="text-ink-muted mt-0.5 shrink-0" />
                      {salon.location.address}, {salon.location.area}, Mumbai — {salon.location.pincode}
                      {salon.location.landmark && <span className="block text-ink-muted">Near {salon.location.landmark}</span>}
                    </p>
                    <div className="h-40 bg-surface-raised rounded-xl flex items-center justify-center text-ink-muted text-sm border border-surface-border">
                      📍 Map view (embed Google Maps here)
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-ink-primary flex items-center gap-2">
                        <Clock size={15} className="text-ink-muted" /> Working Hours
                      </h3>
                      <button onClick={() => setExpandedHours(p=>!p)} className="text-xs text-brand-400">
                        {expandedHours ? "Collapse" : "Expand"}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(expandedHours ? DAYS : (["saturday","sunday"] as const)).map((day, i) => {
                        const hours = salon.workingHours[day];
                        return (
                          <div key={day} className="flex items-center justify-between text-sm">
                            <span className="text-ink-muted w-24">{DAY_LABELS[expandedHours ? i : (day === "saturday" ? 5 : 6)]}</span>
                            {hours.isClosed
                              ? <span className="text-red-400">Closed</span>
                              : <span className="text-ink-secondary">{formatTime(hours.open)} – {formatTime(hours.close)}</span>
                            }
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="card p-5 space-y-3">
                    <h3 className="font-semibold text-ink-primary">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {salon.amenities.map(a => <Badge key={a} variant="muted">{a}</Badge>)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Booking sticky card ───────────── */}
            <div className="lg:w-80 shrink-0">
              <div className="sticky top-24 card p-5 space-y-5">
                <div>
                  <p className="text-sm text-ink-muted">Starting from</p>
                  <p className="font-display font-black text-3xl text-ink-primary">₹800</p>
                </div>

                {/* Quick slot picker */}
                <div>
                  <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Available Today</p>
                  <div className="grid grid-cols-3 gap-2">
                    {DAY_SLOTS.slice(0, 9).map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "py-2 rounded-xl text-xs font-medium border transition-all",
                          selectedSlot === slot
                            ? "bg-brand-500 border-brand-500 text-black"
                            : "border-surface-border text-ink-secondary hover:border-brand-500/50 hover:text-brand-400"
                        )}
                      >
                        {formatTime(slot)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected services summary */}
                {selectedServices.length > 0 && (
                  <div className="border border-surface-border rounded-xl p-3 space-y-2">
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Selected</p>
                    {selectedServices.map(id => {
                      const svc = salon.serviceGroups.flatMap(g => g.services).find(s => s.id === id);
                      if (!svc) return null;
                      return (
                        <div key={id} className="flex items-center justify-between text-sm">
                          <span className="text-ink-secondary truncate mr-2">{svc.name}</span>
                          <span className="font-semibold text-ink-primary shrink-0">{formatINR(svc.discountedPrice ?? svc.price)}</span>
                        </div>
                      );
                    })}
                    <div className="border-t border-surface-border pt-2 flex justify-between text-sm font-bold">
                      <span className="text-ink-primary">Total</span>
                      <span className="text-brand-400">
                        {formatINR(
                          selectedServices.reduce((sum, id) => {
                            const svc = salon.serviceGroups.flatMap(g => g.services).find(s => s.id === id);
                            return sum + (svc ? (svc.discountedPrice ?? svc.price) : 0);
                          }, 0)
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  leftIcon={<Zap size={16} />}
                  asChild
                >
                  <Link href={`/salon/${salon.slug}/book`}>
                    {selectedServices.length > 0 ? "Book Selected Services" : "Book an Appointment"}
                  </Link>
                </Button>

                <p className="text-xs text-ink-muted text-center">Free cancellation up to 2 hours before</p>

                {/* Stylists preview */}
                <div>
                  <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Our Experts</p>
                  <div className="space-y-3">
                    {salon.stylists.slice(0, 2).map(stylist => (
                      <div key={stylist.id} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-black text-xs font-bold shrink-0">
                          {stylist.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink-primary truncate">{stylist.name}</p>
                          <p className="text-xs text-ink-muted truncate">{stylist.specialties.join(", ")}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star size={11} className="fill-brand-500 text-brand-500" />
                          <span className="text-xs font-semibold text-ink-primary">{stylist.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}