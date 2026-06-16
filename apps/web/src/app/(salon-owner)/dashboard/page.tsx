"use client";

import { useState } from "react";
import { BarChart3, Calendar, Users, TrendingUp, Star, Clock, CheckCircle2, XCircle, ChevronRight, Scissors } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge }  from "@/components/ui/Badge";
import { cn, formatINR, formatTime } from "@/lib/utils";

type DashTab = "overview"|"bookings"|"services"|"analytics";

const STATS = [
  { label:"Today's Revenue",  value:"₹18,400", change:"+12%", up:true,  icon:TrendingUp, color:"text-brand-500",  bg:"bg-brand-500/10"  },
  { label:"Bookings Today",   value:"14",       change:"+3",   up:true,  icon:Calendar,   color:"text-accent-teal",bg:"bg-accent-teal/10" },
  { label:"Avg. Rating",      value:"4.9 ★",    change:"+0.1", up:true,  icon:Star,       color:"text-yellow-400", bg:"bg-yellow-500/10" },
  { label:"New Customers",    value:"6",        change:"-2",   up:false, icon:Users,      color:"text-accent-rose",bg:"bg-accent-rose/10" },
];

const TODAY_BOOKINGS = [
  { id:"b1", customer:"Priya Shah",   service:"Haircut + Facial",  time:"10:00", stylist:"Riya",  status:"confirmed" as const, amount:3000 },
  { id:"b2", customer:"Ananya K.",    service:"Keratin Treatment",  time:"11:30", stylist:"Riya",  status:"in_progress" as const, amount:5500 },
  { id:"b3", customer:"Rahul M.",     service:"Beard Grooming",     time:"13:00", stylist:"Aryan", status:"confirmed" as const, amount:800  },
  { id:"b4", customer:"Sneha T.",     service:"Balayage",           time:"14:00", stylist:"Riya",  status:"confirmed" as const, amount:4999 },
  { id:"b5", customer:"Kiran B.",     service:"Swedish Massage",    time:"15:30", stylist:"Priya", status:"confirmed" as const, amount:2500 },
  { id:"b6", customer:"Meera J.",     service:"Classic Facial",     time:"16:00", stylist:"Priya", status:"cancelled" as const, amount:1800 },
];

const WEEK_REVENUE = [
  { day:"Mon", amount:12400 },
  { day:"Tue", amount:9800  },
  { day:"Wed", amount:15200 },
  { day:"Thu", amount:11000 },
  { day:"Fri", amount:18900 },
  { day:"Sat", amount:24500 },
  { day:"Sun", amount:18400 },
];

const STATUS_CONFIG = {
  confirmed:   { label:"Confirmed",    variant:"success" as const, icon:<CheckCircle2 size={13}/> },
  in_progress: { label:"In Progress",  variant:"gold"    as const, icon:<Clock size={13}/> },
  completed:   { label:"Done",         variant:"muted"   as const, icon:<CheckCircle2 size={13}/> },
  cancelled:   { label:"Cancelled",    variant:"rose"    as const, icon:<XCircle size={13}/> },
};

const maxRevenue = Math.max(...WEEK_REVENUE.map(d => d.amount));

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashTab>("overview");

  const TABS: { id: DashTab; label: string }[] = [
    { id:"overview",  label:"Overview" },
    { id:"bookings",  label:"Bookings" },
    { id:"services",  label:"Services" },
    { id:"analytics", label:"Analytics" },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Sidebar ────────────────────────────────── */}
      <aside className="fixed left-0 top-0 bottom-0 w-60 bg-surface-card border-r border-surface-border flex flex-col hidden lg:flex z-50">
        <div className="p-5 border-b border-surface-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center">
              <Scissors size={16} className="text-black rotate-45"/>
            </div>
            <span className="font-display font-bold text-lg">Glamr <span className="text-ink-muted font-normal text-sm">Business</span></span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id:"overview",  label:"Overview",   icon:<BarChart3 size={16}/> },
            { id:"bookings",  label:"Bookings",   icon:<Calendar size={16}/> },
            { id:"services",  label:"Services",   icon:<Scissors size={16}/> },
            { id:"analytics", label:"Analytics",  icon:<TrendingUp size={16}/> },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as DashTab)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeTab === item.id
                  ? "bg-brand-500/15 text-brand-400 border border-brand-500/20"
                  : "text-ink-muted hover:text-ink-primary hover:bg-surface-raised"
              )}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-black text-sm font-bold">MS</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-primary truncate">Mirrors Salon</p>
              <p className="text-xs text-ink-muted">Bandra West</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────── */}
      <div className="lg:ml-60 p-6 md:p-8">
        {/* Mobile tab bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 lg:hidden">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap shrink-0 transition-all",
                activeTab === tab.id ? "bg-brand-500/15 border-brand-500/40 text-brand-400" : "border-surface-border text-ink-muted"
              )}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ─────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display font-black text-2xl mb-1">Good morning, Mirrors Salon 👋</h1>
              <p className="text-ink-muted text-sm">Here&apos;s how you&apos;re doing today.</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map(({ label, value, change, up, icon:Icon, color, bg }) => (
                <div key={label} className="card p-5 space-y-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bg)}>
                    <Icon size={18} className={color}/>
                  </div>
                  <div>
                    <p className="text-xs text-ink-muted">{label}</p>
                    <p className="font-display font-black text-2xl text-ink-primary mt-0.5">{value}</p>
                    <p className={cn("text-xs font-medium mt-1", up ? "text-green-400" : "text-red-400")}>
                      {up ? "▲" : "▼"} {change} vs yesterday
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue chart */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-ink-primary">Weekly Revenue</h2>
                <Badge variant="gold">This Week: {formatINR(WEEK_REVENUE.reduce((s,d)=>s+d.amount,0))}</Badge>
              </div>
              <div className="flex items-end gap-3 h-32">
                {WEEK_REVENUE.map(({ day, amount }) => {
                  const pct  = (amount / maxRevenue) * 100;
                  const isToday = day === "Sun";
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs text-ink-muted">{formatINR(amount, true)}</span>
                      <div className="w-full rounded-t-lg transition-all relative overflow-hidden" style={{ height:`${pct}%`, minHeight:8 }}>
                        <div className={cn("absolute inset-0 rounded-t-lg", isToday ? "bg-brand-500" : "bg-surface-muted")} />
                      </div>
                      <span className={cn("text-xs font-medium", isToday ? "text-brand-400" : "text-ink-muted")}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's bookings preview */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-ink-primary">Today&apos;s Appointments</h2>
                <button onClick={() => setActiveTab("bookings")} className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
                  View all <ChevronRight size={13}/>
                </button>
              </div>
              <div className="space-y-3">
                {TODAY_BOOKINGS.slice(0,4).map(booking => {
                  const cfg = STATUS_CONFIG[booking.status];
                  return (
                    <div key={booking.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface-raised border border-surface-border">
                      <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-black text-xs font-bold shrink-0">
                        {booking.customer.split(" ").map(n=>n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink-primary truncate">{booking.customer}</p>
                        <p className="text-xs text-ink-muted truncate">{booking.service} · {booking.stylist}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-medium text-ink-primary">{formatTime(booking.time)}</p>
                        <Badge variant={cfg.variant} className="mt-1">{cfg.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── BOOKINGS ─────────────────────────────── */}
        {activeTab === "bookings" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h1 className="font-display font-black text-2xl">Today&apos;s Bookings</h1>
              <Badge variant="gold">{TODAY_BOOKINGS.length} total</Badge>
            </div>

            <div className="space-y-3">
              {TODAY_BOOKINGS.map(booking => {
                const cfg = STATUS_CONFIG[booking.status];
                return (
                  <div key={booking.id} className="card p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-gradient-brand flex items-center justify-center text-black font-bold shrink-0">
                          {booking.customer.split(" ").map(n=>n[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink-primary">{booking.customer}</p>
                          <p className="text-sm text-ink-secondary">{booking.service}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-ink-muted">
                            <span className="flex items-center gap-1"><Clock size={11}/> {formatTime(booking.time)}</span>
                            <span>· Stylist: {booking.stylist}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-ink-primary">{formatINR(booking.amount)}</span>
                        <Badge variant={cfg.variant}>{cfg.icon} {cfg.label}</Badge>
                        {booking.status === "confirmed" && (
                          <Button variant="primary" size="sm">Start</Button>
                        )}
                        {booking.status === "in_progress" && (
                          <Button variant="outline" size="sm">Complete</Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SERVICES ─────────────────────────────── */}
        {activeTab === "services" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h1 className="font-display font-black text-2xl">Services</h1>
              <Button variant="primary" size="sm">+ Add Service</Button>
            </div>

            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border">
                    {["Service","Category","Duration","Price","Status",""].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {[
                    { name:"Haircut & Blowdry",  cat:"Hair",  dur:"60 min", price:1200, active:true  },
                    { name:"Global Colour",       cat:"Hair",  dur:"2h",     price:3500, active:true  },
                    { name:"Keratin Treatment",   cat:"Hair",  dur:"3h",     price:5500, active:true  },
                    { name:"Classic Facial",      cat:"Skin",  dur:"60 min", price:1800, active:true  },
                    { name:"Hydrafacial",         cat:"Skin",  dur:"75 min", price:3500, active:false },
                    { name:"Swedish Massage",     cat:"Spa",   dur:"60 min", price:2500, active:true  },
                  ].map(svc => (
                    <tr key={svc.name} className="hover:bg-surface-raised transition-colors">
                      <td className="px-5 py-3.5 font-medium text-ink-primary">{svc.name}</td>
                      <td className="px-5 py-3.5"><Badge variant="muted">{svc.cat}</Badge></td>
                      <td className="px-5 py-3.5 text-ink-secondary">{svc.dur}</td>
                      <td className="px-5 py-3.5 font-semibold text-ink-primary">{formatINR(svc.price)}</td>
                      <td className="px-5 py-3.5"><Badge variant={svc.active ? "success" : "muted"} dot={svc.active}>{svc.active?"Active":"Hidden"}</Badge></td>
                      <td className="px-5 py-3.5">
                        <button className="text-xs text-brand-400 hover:text-brand-300">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ANALYTICS ────────────────────────────── */}
        {activeTab === "analytics" && (
          <div className="space-y-5">
            <h1 className="font-display font-black text-2xl">Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label:"Total Revenue (March)", value:"₹3,24,000", sub:"↑ 18% vs Feb" },
                { label:"Total Bookings",         value:"187",       sub:"↑ 22 vs Feb" },
                { label:"Repeat Customers",       value:"64%",       sub:"Industry avg: 45%" },
              ].map(({label, value, sub}) => (
                <div key={label} className="card p-5">
                  <p className="text-sm text-ink-muted">{label}</p>
                  <p className="font-display font-black text-3xl text-ink-primary mt-1">{value}</p>
                  <p className="text-xs text-green-400 mt-1">{sub}</p>
                </div>
              ))}
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-ink-primary mb-4">Top Services by Revenue</h3>
              <div className="space-y-4">
                {[
                  { name:"Keratin Treatment", revenue:88000, pct:100, bookings:16 },
                  { name:"Balayage",          revenue:75000, pct:85,  bookings:15 },
                  { name:"Haircut & Blowdry", revenue:54000, pct:61,  bookings:45 },
                  { name:"Hydrafacial",       revenue:42000, pct:48,  bookings:12 },
                  { name:"Swedish Massage",   revenue:37500, pct:43,  bookings:15 },
                ].map(svc => (
                  <div key={svc.name}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-ink-secondary">{svc.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-ink-muted text-xs">{svc.bookings} bookings</span>
                        <span className="font-semibold text-ink-primary">{formatINR(svc.revenue)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-surface-raised rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full transition-all" style={{width:`${svc.pct}%`}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}