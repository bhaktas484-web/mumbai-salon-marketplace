
"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Star, Settings, Heart, Bell, LogOut, BadgeCheck, ChevronRight } from "lucide-react";
import { Navbar }  from "@/components/layout/Navbar";
import { Footer }  from "@/components/layout/Footer";
import { Button }  from "@/components/ui/Button";
import { Badge }   from "@/components/ui/Badge";
import { cn, formatINR, formatTime } from "@/lib/utils";

type ProfileTab = "bookings" | "favourites" | "reviews" | "settings";

const MOCK_BOOKINGS = [
  { id:"b1", salonName:"Mirrors Salon & Spa", area:"Bandra", service:"Haircut & Blowdry + Facial", date:"15 Mar 2024", time:"11:00", status:"confirmed" as const, total:3000, canCancel:true },
  { id:"b2", salonName:"Enrich Salon",         area:"Juhu",   service:"Keratin Treatment",           date:"08 Mar 2024", time:"14:00", status:"completed" as const, total:5500, canCancel:false },
  { id:"b3", salonName:"Green Trends",         area:"Andheri",service:"Balayage",                    date:"20 Feb 2024", time:"10:30", status:"completed" as const, total:4999, canCancel:false },
  { id:"b4", salonName:"YLG Salon",            area:"Powai",  service:"Classic Facial",              date:"10 Feb 2024", time:"16:00", status:"cancelled" as const, total:1800, canCancel:false },
];

const MOCK_FAVOURITES = [
  { id:"f1", name:"Mirrors Salon & Spa", area:"Bandra West",  rating:4.9, reviews:1243, price:800,  img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80", slug:"mirrors-salon-bandra" },
  { id:"f2", name:"Enrich Salon",        area:"Juhu",         rating:4.7, reviews:892,  price:500,  img:"https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&q=80", slug:"enrich-salon-juhu" },
];

const STATUS_CONFIG = {
  confirmed: { label:"Upcoming",  variant:"success" as const, dot:true  },
  completed: { label:"Completed", variant:"muted"   as const, dot:false },
  cancelled: { label:"Cancelled", variant:"rose"    as const, dot:false },
};

const TABS: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
  { id:"bookings",    label:"My Bookings",   icon:<Calendar size={15}/> },
  { id:"favourites",  label:"Saved",         icon:<Heart size={15}/> },
  { id:"reviews",     label:"My Reviews",    icon:<Star size={15}/> },
  { id:"settings",    label:"Settings",      icon:<Settings size={15}/> },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("bookings");
  const [filter, setFilter] = useState<"all"|"confirmed"|"completed"|"cancelled">("all");

  const filtered = filter === "all" ? MOCK_BOOKINGS : MOCK_BOOKINGS.filter(b => b.status === filter);

  return (
    <>
      <Navbar />
      <main className="pt-[var(--navbar-height)] min-h-screen">
        <div className="container-app py-10">

          {/* ── Profile header ───────────────────────── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-brand flex items-center justify-center text-black font-display font-black text-2xl shrink-0">
              PS
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-black text-2xl text-ink-primary">Priya Shah</h1>
                <BadgeCheck size={20} className="text-brand-500" />
              </div>
              <p className="text-ink-muted text-sm">priya@gmail.com · Mumbai</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Badge variant="gold">✦ 320 Loyalty Points</Badge>
                <Badge variant="muted">4 Bookings</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" leftIcon={<Settings size={14}/>}>
              Edit Profile
            </Button>
          </div>

          {/* ── Tabs ─────────────────────────────────── */}
          <div className="flex gap-1 border-b border-surface-border mb-8 overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-all whitespace-nowrap shrink-0",
                  activeTab === tab.id
                    ? "border-brand-500 text-brand-400"
                    : "border-transparent text-ink-muted hover:text-ink-primary"
                )}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* ── BOOKINGS ─────────────────────────────── */}
          {activeTab === "bookings" && (
            <div>
              {/* Filter pills */}
              <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                {(["all","confirmed","completed","cancelled"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap shrink-0 capitalize",
                      filter === f
                        ? "bg-brand-500/15 border-brand-500/40 text-brand-400"
                        : "border-surface-border text-ink-muted hover:text-ink-primary"
                    )}>
                    {f === "all" ? "All Bookings" : f}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {filtered.map(booking => {
                  const cfg = STATUS_CONFIG[booking.status];
                  return (
                    <div key={booking.id} className="card p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-semibold text-ink-primary">{booking.salonName}</h3>
                            <Badge variant={cfg.variant} dot={cfg.dot}>{cfg.label}</Badge>
                          </div>
                          <p className="text-sm text-ink-secondary">{booking.service}</p>
                          <div className="flex flex-wrap gap-4 mt-3 text-xs text-ink-muted">
                            <span className="flex items-center gap-1.5"><Calendar size={12}/> {booking.date}</span>
                            <span className="flex items-center gap-1.5"><Clock size={12}/> {formatTime(booking.time)}</span>
                            <span className="flex items-center gap-1.5"><MapPin size={12}/> {booking.area}</span>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
                          <span className="font-bold text-lg text-ink-primary">{formatINR(booking.total)}</span>
                          <div className="flex gap-2">
                            {booking.status === "completed" && (
                              <Button variant="outline" size="sm" leftIcon={<Star size={12}/>}>Review</Button>
                            )}
                            {booking.canCancel && (
                              <Button variant="destructive" size="sm">Cancel</Button>
                            )}
                            <Link href={`/booking/${booking.id}`} className="btn btn-ghost btn-sm text-ink-muted">
                              Details <ChevronRight size={12}/>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="text-center py-16 text-ink-muted">
                    <Calendar size={40} className="mx-auto mb-4 opacity-30" />
                    <p className="font-medium">No bookings found</p>
                    <Button variant="primary" size="md" className="mt-4" asChild>
                      <Link href="/explore">Book a Salon</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── FAVOURITES ───────────────────────────── */}
          {activeTab === "favourites" && (
            <div>
              {MOCK_FAVOURITES.length === 0 ? (
                <div className="text-center py-16 text-ink-muted">
                  <Heart size={40} className="mx-auto mb-4 opacity-30"/>
                  <p>No saved salons yet</p>
                  <Button variant="primary" size="md" className="mt-4" asChild><Link href="/explore">Explore Salons</Link></Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {MOCK_FAVOURITES.map(salon => (
                    <Link key={salon.id} href={`/salon/${salon.slug}`} className="group card block">
                      <div className="relative h-44 overflow-hidden">
                        <img src={salon.img} alt={salon.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <button type="button"
  aria-label="Close" onClick={e => e.preventDefault()} className="absolute top-3 right-3 w-8 h-8 glass rounded-full flex items-center justify-center">
                          <Heart size={14} className="fill-accent-rose text-accent-rose"/>
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-display font-bold text-ink-primary group-hover:text-brand-400 transition-colors">{salon.name}</h3>
                        <p className="text-xs text-ink-muted mt-1 flex items-center gap-1"><MapPin size={11}/>{salon.area}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Star size={13} className="fill-brand-500 text-brand-500"/>
                            <span className="font-semibold text-ink-primary">{salon.rating}</span>
                            <span className="text-ink-muted">({salon.reviews})</span>
                          </div>
                          <span className="text-sm font-bold text-ink-primary">From {formatINR(salon.price)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── REVIEWS ──────────────────────────────── */}
          {activeTab === "reviews" && (
            <div className="text-center py-16 text-ink-muted">
              <Star size={40} className="mx-auto mb-4 opacity-30"/>
              <p className="font-medium">No reviews yet</p>
              <p className="text-sm mt-1">After completing a booking, you can leave a review.</p>
            </div>
          )}

          {/* ── SETTINGS ─────────────────────────────── */}
          {activeTab === "settings" && (
            <div className="max-w-lg space-y-4">
              {[
                { icon:<Bell size={18}/>,   title:"Notifications",   desc:"Manage SMS and email alerts",    href:"#" },
                { icon:<Heart size={18}/>,  title:"Preferences",     desc:"Areas, services & gender filter",href:"#" },
                { icon:<Settings size={18}/>,title:"Account",        desc:"Password, phone, email",         href:"#" },
              ].map(item => (
                <Link key={item.title} href={item.href} className="card p-5 flex items-center gap-4 hover:border-brand-500/30 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-surface-raised flex items-center justify-center text-ink-muted group-hover:text-brand-400 transition-colors shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-ink-primary">{item.title}</p>
                    <p className="text-xs text-ink-muted">{item.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-ink-muted group-hover:text-brand-400 transition-colors"/>
                </Link>
              ))}

              <div className="divider"/>

              <button className="w-full flex items-center gap-4 p-5 rounded-2xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all group text-left">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
                  <LogOut size={18}/>
                </div>
                <div>
                  <p className="font-semibold text-sm text-red-400">Sign Out</p>
                  <p className="text-xs text-red-400/60">Sign out of your account</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}