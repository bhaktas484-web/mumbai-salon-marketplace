"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, CheckCircle2, CreditCard, Zap, X } from "lucide-react";
import { Navbar }    from "@/components/layout/Navbar";
import { Button }    from "@/components/ui/Button";
import { Badge }     from "@/components/ui/Badge";
import { cn, formatINR, formatDuration, formatTime } from "@/lib/utils";

type Step = "services" | "datetime" | "confirm" | "payment";

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: "services", label: "Services",  icon: <Zap size={14} /> },
  { id: "datetime", label: "Date & Time", icon: <Calendar size={14} /> },
  { id: "confirm",  label: "Confirm",   icon: <CheckCircle2 size={14} /> },
  { id: "payment",  label: "Payment",   icon: <CreditCard size={14} /> },
];

const MOCK_SERVICES = [
  { id: "h1", name: "Haircut & Blowdry",  price: 1200, durationMinutes: 60,  category: "Hair" },
  { id: "h3", name: "Keratin Treatment",  price: 5500, durationMinutes: 180, category: "Hair" },
  { id: "s1", name: "Classic Facial",     price: 1800, durationMinutes: 60,  category: "Skin" },
  { id: "m1", name: "Swedish Massage",    price: 2500, durationMinutes: 60,  category: "Spa"  },
];

const DATES = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i);
  return {
    value: d.toISOString().split("T")[0]!,
    label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short" }),
    day:   d.toLocaleDateString("en-IN", { weekday:"short" }),
    date:  d.getDate(),
    month: d.toLocaleDateString("en-IN", { month:"short" }),
  };
});

const SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","17:00","17:30","18:00","18:30","19:00","19:30"];
const UNAVAILABLE = ["09:30","11:00","14:00","17:00"];

const PAYMENT_METHODS = [
  { id: "upi",         label: "UPI",           icon: "📱", desc: "Google Pay, PhonePe, Paytm" },
  { id: "card",        label: "Card",           icon: "💳", desc: "Credit / Debit card" },
  { id: "net_banking", label: "Net Banking",    icon: "🏦", desc: "All major banks" },
  { id: "pay_later",   label: "Pay at Salon",   icon: "🏠", desc: "Pay when you arrive" },
];

export default function BookingPage() {
  const [step,            setStep]            = useState<Step>("services");
  const [selectedSvcs,    setSelectedSvcs]    = useState<string[]>(["h1"]);
  const [selectedDate,    setSelectedDate]    = useState<string>(DATES[0]!.value);
  const [selectedSlot,    setSelectedSlot]    = useState<string | null>(null);
  const [paymentMethod,   setPaymentMethod]   = useState<string>("upi");
  const [coupon,          setCoupon]          = useState("");
  const [couponApplied,   setCouponApplied]   = useState(false);
  const [notes,           setNotes]           = useState("");
  const [booked,          setBooked]          = useState(false);

  const stepIndex  = STEPS.findIndex(s => s.id === step);
  const toggleSvc  = (id: string) => setSelectedSvcs(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const selected   = MOCK_SERVICES.filter(s => selectedSvcs.includes(s.id));
  const subtotal   = selected.reduce((s, x) => s + x.price, 0);
  const discount   = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const tax        = Math.round((subtotal - discount) * 0.18);
  const total      = subtotal - discount + tax;
  const totalMins  = selected.reduce((s, x) => s + x.durationMinutes, 0);

  const goNext = () => {
    const order: Step[] = ["services","datetime","confirm","payment"];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) setStep(order[idx + 1]!);
  };
  const goPrev = () => {
    const order: Step[] = ["services","datetime","confirm","payment"];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]!);
  };

  if (booked) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center">
        <CheckCircle2 size={40} className="text-green-400" />
      </div>
      <div>
        <h2 className="font-display font-black text-3xl mb-2">Booking Confirmed! 🎉</h2>
        <p className="text-ink-muted">Your appointment at <span className="text-ink-primary font-semibold">Mirrors Salon</span> is confirmed.</p>
        <p className="text-ink-muted mt-1">Booking ID: <span className="text-brand-400 font-mono font-semibold">GLM-2403-7823</span></p>
      </div>
      <div className="card p-5 text-left w-full max-w-sm space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-ink-muted">Date</span><span className="text-ink-primary font-medium">{DATES.find(d => d.value === selectedDate)?.label}</span></div>
        <div className="flex justify-between"><span className="text-ink-muted">Time</span><span className="text-ink-primary font-medium">{selectedSlot ? formatTime(selectedSlot) : "—"}</span></div>
        <div className="flex justify-between"><span className="text-ink-muted">Total Paid</span><span className="text-brand-400 font-bold">{formatINR(total)}</span></div>
      </div>
      <Button variant="primary" size="lg" asChild>
        <Link href="/profile">View My Bookings</Link>
      </Button>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="pt-[var(--navbar-height)] min-h-screen">
        <div className="container-app py-8 max-w-4xl">

          {/* ── Back link ──────────────────────────────── */}
          <Link href="/salon/mirrors-salon-bandra" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink-primary transition-colors mb-6">
            <ArrowLeft size={15} /> Back to salon
          </Link>

          <h1 className="font-display font-black text-3xl mb-8">
            Book at <span className="text-gradient-gold">Mirrors Salon</span>
          </h1>

          {/* ── Step indicator ─────────────────────────── */}
          <div className="flex items-center justify-between mb-10 relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-surface-border -z-0" />
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all font-bold text-sm",
                  i < stepIndex  ? "bg-brand-500 border-brand-500 text-black"
                  : i === stepIndex ? "bg-surface border-brand-500 text-brand-400"
                  : "bg-surface border-surface-border text-ink-disabled"
                )}>
                  {i < stepIndex ? "✓" : s.icon}
                </div>
                <span className={cn("text-xs font-medium hidden sm:block", i === stepIndex ? "text-brand-400" : i < stepIndex ? "text-ink-secondary" : "text-ink-disabled")}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* ── Left: Step content ─────────────────── */}
            <div className="flex-1 min-w-0">

              {/* STEP 1: Services */}
              {step === "services" && (
                <div className="space-y-4">
                  <h2 className="font-display font-bold text-xl mb-4">Select Services</h2>
                  {MOCK_SERVICES.map(svc => {
                    const sel = selectedSvcs.includes(svc.id);
                    return (
                      <div key={svc.id} onClick={() => toggleSvc(svc.id)} className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all",
                        sel ? "border-brand-500 bg-brand-500/8" : "border-surface-border bg-surface-card hover:border-surface-muted"
                      )}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-ink-primary">{svc.name}</span>
                            <Badge variant="muted">{svc.category}</Badge>
                          </div>
                          <p className="text-xs text-ink-muted mt-1">{formatDuration(svc.durationMinutes)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-ink-primary">{formatINR(svc.price)}</span>
                          <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", sel ? "bg-brand-500 border-brand-500" : "border-surface-muted")}>
                            {sel && <span className="text-black text-xs font-bold">✓</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* STEP 2: Date & Time */}
              {step === "datetime" && (
                <div className="space-y-6">
                  <h2 className="font-display font-bold text-xl">Pick a Date</h2>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {DATES.map(d => (
                      <button key={d.value} onClick={() => { setSelectedDate(d.value); setSelectedSlot(null); }}
                        className={cn(
                          "flex flex-col items-center min-w-[72px] p-3 rounded-2xl border transition-all shrink-0",
                          selectedDate === d.value
                            ? "border-brand-500 bg-brand-500/12 text-brand-400"
                            : "border-surface-border text-ink-secondary hover:border-surface-muted"
                        )}>
                        <span className="text-xs font-medium">{d.day}</span>
                        <span className="font-display font-bold text-xl">{d.date}</span>
                        <span className="text-xs">{d.month}</span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <h2 className="font-display font-bold text-xl mb-4">Pick a Time</h2>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {SLOTS.map(slot => {
                        const unavail = UNAVAILABLE.includes(slot);
                        const sel     = selectedSlot === slot;
                        return (
                          <button key={slot} onClick={() => !unavail && setSelectedSlot(slot)} disabled={unavail}
                            className={cn(
                              "py-2.5 rounded-xl text-xs font-medium border transition-all",
                              sel     ? "bg-brand-500 border-brand-500 text-black"
                              : unavail ? "border-surface-border text-ink-disabled opacity-40 cursor-not-allowed line-through"
                              : "border-surface-border text-ink-secondary hover:border-brand-500/50 hover:text-brand-400"
                            )}>
                            {formatTime(slot)}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-ink-muted mt-3">⚡ Crossed-out slots are unavailable</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-ink-secondary block mb-2">Notes for salon (optional)</label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="E.g. I prefer a female stylist, I have sensitive skin…"
                      rows={3}
                      className="input resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Confirm */}
              {step === "confirm" && (
                <div className="space-y-5">
                  <h2 className="font-display font-bold text-xl">Review Booking</h2>

                  <div className="card p-5 space-y-4">
                    <h3 className="font-semibold text-ink-primary">Appointment Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-ink-muted flex items-center gap-2"><Calendar size={13} /> Date</span>
                        <span className="font-medium text-ink-primary">{DATES.find(d => d.value === selectedDate)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-muted flex items-center gap-2"><Clock size={13} /> Time</span>
                        <span className="font-medium text-ink-primary">{selectedSlot ? formatTime(selectedSlot) : "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-muted">Duration</span>
                        <span className="font-medium text-ink-primary">{formatDuration(totalMins)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card p-5 space-y-3">
                    <h3 className="font-semibold text-ink-primary">Services</h3>
                    {selected.map(svc => (
                      <div key={svc.id} className="flex justify-between text-sm">
                        <span className="text-ink-secondary">{svc.name}</span>
                        <span className="font-medium text-ink-primary">{formatINR(svc.price)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon */}
                  <div className="card p-5 space-y-3">
                    <h3 className="font-semibold text-ink-primary">Coupon Code</h3>
                    <div className="flex gap-2">
                      <input
                        value={coupon}
                        onChange={e => setCoupon(e.target.value.toUpperCase())}
                        placeholder="Enter code (e.g. GLAMR10)"
                        className="input flex-1"
                        disabled={couponApplied}
                      />
                      <Button
                        variant={couponApplied ? "ghost" : "outline"}
                        size="md"
                        onClick={() => { if (couponApplied) { setCouponApplied(false); setCoupon(""); } else if (coupon) setCouponApplied(true); }}
                      >
                        {couponApplied ? <><X size={13} /> Remove</> : "Apply"}
                      </Button>
                    </div>
                    {couponApplied && <p className="text-xs text-green-400">✓ 10% discount applied!</p>}
                  </div>

                  {notes && (
                    <div className="card p-5">
                      <h3 className="font-semibold text-ink-primary mb-2">Your Notes</h3>
                      <p className="text-sm text-ink-secondary">{notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Payment */}
              {step === "payment" && (
                <div className="space-y-5">
                  <h2 className="font-display font-bold text-xl">Payment</h2>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map(pm => (
                      <div key={pm.id} onClick={() => setPaymentMethod(pm.id)} className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all",
                        paymentMethod === pm.id
                          ? "border-brand-500 bg-brand-500/8"
                          : "border-surface-border bg-surface-card hover:border-surface-muted"
                      )}>
                        <span className="text-2xl">{pm.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-ink-primary">{pm.label}</p>
                          <p className="text-xs text-ink-muted">{pm.desc}</p>
                        </div>
                        <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", paymentMethod === pm.id ? "bg-brand-500 border-brand-500" : "border-surface-muted")}>
                          {paymentMethod === pm.id && <span className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-ink-muted text-center">🔒 Payments secured by Razorpay. Your card details are never stored.</p>
                </div>
              )}

              {/* ── Navigation ─────────────────────────── */}
              <div className="flex gap-3 mt-8">
                {stepIndex > 0 && (
                  <Button variant="outline" size="lg" onClick={goPrev} className="flex-1 sm:flex-none sm:px-8">
                    Back
                  </Button>
                )}
                {step !== "payment" ? (
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    disabled={
                      (step === "services" && selectedSvcs.length === 0) ||
                      (step === "datetime" && (!selectedDate || !selectedSlot))
                    }
                    onClick={goNext}
                  >
                    Continue <ChevronRightIcon />
                  </Button>
                ) : (
                  <Button variant="primary" size="lg" className="flex-1" leftIcon={<CreditCard size={16} />} onClick={() => setBooked(true)}>
                    Pay {formatINR(total)}
                  </Button>
                )}
              </div>
            </div>

            {/* ── Right: Order summary ────────────────── */}
            <div className="lg:w-72 shrink-0">
              <div className="sticky top-24 card p-5 space-y-4">
                <h3 className="font-semibold text-ink-primary">Order Summary</h3>

                {selected.length === 0
                  ? <p className="text-sm text-ink-muted">No services selected</p>
                  : selected.map(svc => (
                    <div key={svc.id} className="flex justify-between text-sm">
                      <span className="text-ink-secondary truncate mr-2">{svc.name}</span>
                      <span className="font-medium text-ink-primary shrink-0">{formatINR(svc.price)}</span>
                    </div>
                  ))
                }

                {selected.length > 0 && (
                  <>
                    <div className="divider" />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-ink-secondary">
                        <span>Subtotal</span><span>{formatINR(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-400">
                          <span>Discount (10%)</span><span>−{formatINR(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-ink-muted">
                        <span>GST (18%)</span><span>{formatINR(tax)}</span>
                      </div>
                    </div>
                    <div className="divider" />
                    <div className="flex justify-between font-bold">
                      <span className="text-ink-primary">Total</span>
                      <span className="text-brand-400 text-lg">{formatINR(total)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-ink-muted">
                      <span>Duration</span><span>{formatDuration(totalMins)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}