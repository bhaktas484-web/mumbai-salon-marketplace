import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Star, Shield, Clock, Zap, Sparkles, Users, Scissors } from "lucide-react";
import { Navbar }  from "@/components/layout/Navbar";
import { Footer }  from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Glamr — Mumbai's Salon Marketplace",
  description: "Book top-rated salons across Mumbai. Real-time slots, verified reviews, instant confirmations.",
};

/* ── Data ─────────────────────────────────────────────────── */
const CATEGORIES = [
  { icon: "✂️", label: "Hair" },
  { icon: "✨", label: "Skin & Facial" },
  { icon: "💅", label: "Nails" },
  { icon: "💄", label: "Makeup" },
  { icon: "💆", label: "Spa & Massage" },
  { icon: "👰", label: "Bridal" },
  { icon: "🪒", label: "Men's Grooming" },
  { icon: "🧖", label: "Waxing" },
];

const SALONS = [
  { name: "Mirrors Salon & Spa",  area: "Bandra West",   rating: 4.9, reviews: 1243, price: 800,  tier: "Luxury",   tag: "gold",  slug: "mirrors-salon-bandra",  emoji: "💇‍♀️", open: true },
  { name: "Enrich Salon",         area: "Juhu",           rating: 4.7, reviews: 892,  price: 500,  tier: "Premium",  tag: "teal",  slug: "enrich-salon-juhu",     emoji: "💆‍♀️", open: true },
  { name: "Green Trends",         area: "Andheri West",  rating: 4.6, reviews: 654,  price: 350,  tier: "Standard", tag: "rose",  slug: "green-trends-andheri",  emoji: "💅",    open: true },
];

const AREAS = [
  { name: "Bandra",      emoji: "🌊", count: 142 },
  { name: "Juhu",        emoji: "🏖️", count: 89  },
  { name: "Colaba",      emoji: "🏛️", count: 76  },
  { name: "Worli",       emoji: "🌉", count: 94  },
  { name: "Andheri",     emoji: "🏙️", count: 203 },
  { name: "Lower Parel", emoji: "🏢", count: 118 },
  { name: "Powai",       emoji: "🏞️", count: 67  },
  { name: "Santacruz",   emoji: "✈️", count: 55  },
];

const STATS = [
  { value: "1,200+", label: "Verified Salons",   icon: Scissors },
  { value: "4.8 ★",  label: "Average Rating",    icon: Star     },
  { value: "50k+",   label: "Happy Customers",   icon: Users    },
  { value: "2 min",  label: "Avg. Booking Time", icon: Zap      },
];

const WHY = [
  { icon: "🛡️", title: "Verified & Trusted",   desc: "Every salon is physically inspected and hygiene-checked before listing.", bg: "var(--gold-dim)" },
  { icon: "⚡",  title: "Real-time Slots",       desc: "Live availability — no phone calls, no waiting. Instant confirmation.", bg: "var(--teal-dim)" },
  { icon: "💰",  title: "Best Prices",           desc: "Price-match guarantee across Mumbai. Exclusive member deals weekly.", bg: "var(--rose-dim)" },
  { icon: "✨",  title: "Curated Picks",         desc: "From quick cuts to luxury spa days — every listing is quality-checked.", bg: "var(--violet-dim)" },
];

const REVIEWS = [
  { initials: "PS", name: "Priya S.",  area: "Bandra",  text: "Booked a last-minute facial and got a slot within 2 hours. The salon was exactly as described. Glamr is a lifesaver!", service: "Facial Treatment" },
  { initials: "RM", name: "Rahul M.", area: "Powai",   text: "Found the best beard grooming studio near me. Prices are transparent, no hidden charges. Will definitely use again.", service: "Beard & Grooming" },
  { initials: "AK", name: "Ananya K.", area: "Colaba",  text: "Booked my bridal package through Glamr — the salon was top-notch and the whole experience was seamless!", service: "Bridal Makeup" },
];

/* ── Page ─────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ═══════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════ */}
        <section style={{ paddingTop: "var(--nav-height)", background: "var(--surface)" }}>
          <div className="container" style={{ paddingTop: 72, paddingBottom: 64 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

              {/* Left */}
              <div>
                {/* Eyebrow */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "5px 14px", borderRadius: 99,
                  border: "1px solid var(--gold-border)",
                  background: "var(--gold-dim)",
                  fontSize: 12, color: "var(--gold)", fontWeight: 600,
                  marginBottom: 24
                }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--gold)", display:"inline-block", animation:"pulseDot 2s infinite" }} />
                  Mumbai&apos;s #1 Salon Marketplace
                </div>

                {/* H1 */}
                <h1 style={{ fontSize: "clamp(40px,5vw,56px)", fontWeight:800, letterSpacing:"-0.04em", lineHeight:1.1, marginBottom:20 }}>
                  Look your best,{" "}
                  <em style={{ fontStyle:"normal", color:"var(--gold)" }}>anywhere</em>{" "}
                  in Mumbai
                </h1>

                <p style={{ fontSize:17, color:"var(--text-2)", lineHeight:1.7, marginBottom:36, maxWidth:440 }}>
                  Discover and book top-rated salons, spas &amp; beauty studios. Real-time slots. Verified reviews. Instant confirmation.
                </p>

                {/* Search bar */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "var(--surface-3)",
                  border: "1px solid var(--border-2)",
                  borderRadius: 14, padding: "6px 6px 6px 18px",
                  marginBottom: 20
                }}>
                  <span style={{ fontSize:18, color:"var(--text-3)" }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search salons, services, areas…"
                    style={{
                      flex:1, background:"none", border:"none", outline:"none",
                      color:"var(--text-1)", fontSize:15, fontFamily:"inherit"
                    }}
                  />
                  <button style={{
                    background:"var(--gold)", color:"#000", border:"none",
                    borderRadius:10, padding:"10px 22px", fontWeight:700,
                    fontSize:14, cursor:"pointer", whiteSpace:"nowrap"
                  }}>
                    Search
                  </button>
                </div>

                {/* Quick chips */}
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                  <span style={{ fontSize:12, color:"var(--text-3)", display:"flex", alignItems:"center", gap:4 }}>
                    <MapPin size={13} /> Popular:
                  </span>
                  {["Bandra","Juhu","Colaba","Andheri","Worli"].map(a => (
                    <Link key={a} href={`/explore?area=${a}`} style={{
                      padding:"5px 12px", borderRadius:99,
                      border:"1px solid var(--border)",
                      background:"var(--surface-3)",
                      color:"var(--text-2)", fontSize:12,
                      transition:"all 0.15s"
                    }}>
                      {a}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right: Floating cards */}
              <div style={{ position:"relative", height:440 }}>

                {/* Main salon card */}
                <div style={{
                  position:"absolute", top:0, right:0, width:280,
                  background:"var(--surface-3)",
                  border:"1px solid var(--border-2)",
                  borderRadius:20, overflow:"hidden",
                  boxShadow:"0 24px 64px rgba(0,0,0,0.5)"
                }}>
                  <div style={{
                    height:160, background:"linear-gradient(135deg,#1a1000,#3d2b00)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:70, position:"relative"
                  }}>
                    <span style={{position:"relative",zIndex:1}}>💇‍♀️</span>
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 60%)" }} />
                    <div style={{
                      position:"absolute", top:10, left:10,
                      background:"var(--gold)", color:"#000",
                      fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:6
                    }}>✦ LUXURY</div>
                  </div>
                  <div style={{ padding:"14px 16px" }}>
                    <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Mirrors Salon &amp; Spa</div>
                    <div style={{ fontSize:12, color:"var(--text-2)", marginBottom:10, display:"flex",alignItems:"center",gap:4 }}>
                      <MapPin size={11}/> Bandra West
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                        <span style={{ color:"var(--gold)", fontSize:12 }}>★★★★★</span>
                        <span style={{ fontSize:12, fontWeight:600 }}>4.9</span>
                        <span style={{ fontSize:11, color:"var(--text-3)" }}>(1,243)</span>
                      </div>
                      <span style={{ fontSize:12, color:"var(--text-2)" }}>From <strong style={{color:"var(--text-1)"}}>₹800</strong></span>
                    </div>
                    <button style={{
                      width:"100%", marginTop:12, background:"var(--gold)",
                      color:"#000", border:"none", borderRadius:10,
                      padding:10, fontWeight:700, fontSize:13, cursor:"pointer"
                    }}>⚡ Book Now</button>
                  </div>
                </div>

                {/* Stats mini card */}
                <div style={{
                  position:"absolute", bottom:80, left:0, width:190,
                  background:"var(--surface-3)",
                  border:"1px solid var(--border-2)",
                  borderRadius:20, padding:"14px 16px",
                  boxShadow:"0 24px 64px rgba(0,0,0,0.5)"
                }}>
                  <div style={{ fontSize:10, color:"var(--text-3)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>This Month</div>
                  <div style={{ fontSize:28, fontWeight:800, color:"var(--text-1)", letterSpacing:-1 }}>12,480</div>
                  <div style={{ fontSize:12, color:"var(--text-2)", marginTop:2 }}>bookings completed</div>
                  <div style={{ height:3, background:"var(--surface-5)", borderRadius:2, marginTop:12, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:"80%", background:"var(--gold)", borderRadius:2 }} />
                  </div>
                </div>

                {/* Review mini card */}
                <div style={{
                  position:"absolute", bottom:0, right:30, width:210,
                  background:"var(--surface-3)",
                  border:"1px solid var(--border-2)",
                  borderRadius:20, padding:"14px 16px",
                  boxShadow:"0 24px 64px rgba(0,0,0,0.5)"
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <div style={{
                      width:32, height:32, borderRadius:"50%",
                      background:"var(--gold-dim)", border:"1px solid var(--gold-border)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:12, fontWeight:700, color:"var(--gold)", flexShrink:0
                    }}>PS</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600 }}>Priya S.</div>
                      <div style={{ color:"var(--gold)", fontSize:10 }}>★★★★★</div>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:"var(--text-2)", lineHeight:1.5, fontStyle:"italic" }}>
                    &ldquo;Booked in 2 minutes. Best salon experience!&rdquo;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            STATS
        ═══════════════════════════════════════════ */}
        <div style={{ borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", background:"var(--surface-2)" }}>
          <div className="container">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", padding:"28px 0" }}>
              {STATS.map(({ value, label }, i) => (
                <div key={label} style={{
                  textAlign:"center", padding:"0 24px",
                  borderRight: i < 3 ? "1px solid var(--border)" : "none"
                }}>
                  <div style={{ fontSize:30, fontWeight:800, letterSpacing:-1, color:"var(--text-1)", marginBottom:4 }}>{value}</div>
                  <div style={{ fontSize:12, color:"var(--text-3)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            CATEGORIES
        ═══════════════════════════════════════════ */}
        <section className="section-pad" style={{ background:"var(--surface)" }}>
          <div className="container">
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:32 }}>
              <div>
                <div className="eyebrow">Browse Services</div>
                <h2 className="section-title">What are you <em>looking for?</em></h2>
              </div>
              <Link href="/explore" style={{ fontSize:13, color:"var(--text-2)", display:"flex", alignItems:"center", gap:4 }}>
                View all →
              </Link>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:10 }}>
              {CATEGORIES.map(({ icon, label }) => (
                <Link key={label} href={`/explore?category=${encodeURIComponent(label)}`} style={{
                  display:"flex", flexDirection:"column", alignItems:"center", gap:10,
                  padding:"18px 10px", borderRadius:"var(--radius-lg)",
                  border:"1px solid var(--border)", background:"var(--surface-2)",
                  cursor:"pointer", textAlign:"center", transition:"all 0.2s",
                  textDecoration:"none"
                }}>
                  <span style={{ fontSize:28 }}>{icon}</span>
                  <span style={{ fontSize:11, color:"var(--text-2)", fontWeight:500, lineHeight:1.3 }}>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FEATURED SALONS
        ═══════════════════════════════════════════ */}
        <section className="section-pad bg-alt">
          <div className="container">
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:32 }}>
              <div>
                <div className="eyebrow">Hand-picked</div>
                <h2 className="section-title">Featured <em>Salons</em></h2>
              </div>
              <Link href="/explore?tag=featured" style={{ fontSize:13, color:"var(--text-2)" }}>See all →</Link>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
              {SALONS.map((salon) => (
                <Link key={salon.slug} href={`/salon/${salon.slug}`} style={{ textDecoration:"none" }}>
                  <div className="card" style={{ cursor:"pointer" }}>
                    {/* Thumb */}
                    <div style={{
                      height:200, display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:80, position:"relative",
                      background: salon.tag === "gold" ? "linear-gradient(135deg,#1a1000,#3d2b00)"
                        : salon.tag === "teal" ? "linear-gradient(135deg,#001a12,#003d28)"
                        : "linear-gradient(135deg,#1a000a,#3d0019)"
                    }}>
                      <span style={{ position:"relative", zIndex:1 }}>{salon.emoji}</span>
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 55%)" }} />

                      {/* Badges */}
                      <div style={{ position:"absolute", top:12, left:12, display:"flex", gap:6 }}>
                        <span className={`badge badge-${salon.tag}`} style={{ fontSize:10 }}>
                          {salon.tier === "Luxury" ? "✦ Luxury" : salon.tier}
                        </span>
                      </div>

                      {/* Open pill */}
                      <div style={{ position:"absolute", bottom:10, left:12 }}>
                        <div className="open-pill">
                          <div className="open-dot" />
                          Open now
                        </div>
                      </div>

                      {/* Wishlist */}
                      <div style={{
                        position:"absolute", top:12, right:12,
                        width:32, height:32, borderRadius:"50%",
                        background:"rgba(0,0,0,0.5)", backdropFilter:"blur(8px)",
                        border:"1px solid rgba(255,255,255,0.1)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:14
                      }}>🤍</div>
                    </div>

                    {/* Info */}
                    <div style={{ padding:"16px" }}>
                      <div style={{ fontWeight:700, fontSize:16, marginBottom:4, color:"var(--text-1)" }}>{salon.name}</div>
                      <div style={{ fontSize:12, color:"var(--text-2)", marginBottom:10, display:"flex", alignItems:"center", gap:4 }}>
                        <MapPin size={11} /> {salon.area}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ color:"var(--gold)", fontSize:12 }}>{'★'.repeat(Math.floor(salon.rating))}{'☆'.repeat(5-Math.floor(salon.rating))}</span>
                        <span style={{ fontSize:13, fontWeight:600, color:"var(--text-1)" }}>{salon.rating}</span>
                        <span style={{ fontSize:11, color:"var(--text-3)" }}>({salon.reviews.toLocaleString("en-IN")})</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:14 }}>
                        <div>
                          <div style={{ fontSize:10, color:"var(--text-3)" }}>Starting at</div>
                          <div style={{ fontSize:18, fontWeight:700, color:"var(--text-1)" }}>₹{salon.price}</div>
                        </div>
                        <button style={{
                          display:"flex", alignItems:"center", gap:5,
                          padding:"8px 16px", background:"var(--gold)", color:"#000",
                          border:"none", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer"
                        }}>
                          ⚡ Book
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            WHY GLAMR
        ═══════════════════════════════════════════ */}
        <section className="section-pad" style={{ background:"var(--surface)" }}>
          <div className="container">
            <div style={{ textAlign:"center", marginBottom:52 }}>
              <div className="eyebrow">Why Glamr</div>
              <h2 className="section-title">The smarter way to <em>book beauty</em></h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
              {WHY.map(({ icon, title, desc, bg }) => (
                <div key={title} style={{
                  padding:24, borderRadius:"var(--radius-lg)",
                  border:"1px solid var(--border)", background:"var(--surface-2)"
                }}>
                  <div style={{
                    width:44, height:44, borderRadius:12,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:20, marginBottom:16, background: bg
                  }}>{icon}</div>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:8, color:"var(--text-1)" }}>{title}</div>
                  <div style={{ fontSize:13, color:"var(--text-2)", lineHeight:1.65 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            AREAS
        ═══════════════════════════════════════════ */}
        <section className="section-pad bg-alt">
          <div className="container">
            <div style={{ marginBottom:32 }}>
              <div className="eyebrow">By Location</div>
              <h2 className="section-title">Explore by <em>Neighbourhood</em></h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              {AREAS.map(({ name, emoji, count }) => (
                <Link key={name} href={`/explore?area=${name}`} style={{
                  display:"flex", flexDirection:"column", alignItems:"center", gap:8,
                  padding:20, borderRadius:"var(--radius-lg)",
                  border:"1px solid var(--border)", background:"var(--surface-2)",
                  cursor:"pointer", textAlign:"center", transition:"all 0.2s",
                  textDecoration:"none"
                }}>
                  <span style={{ fontSize:28 }}>{emoji}</span>
                  <span style={{ fontWeight:700, fontSize:14, color:"var(--text-1)" }}>{name}</span>
                  <span style={{ fontSize:11, color:"var(--text-3)" }}>{count} salons</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            TESTIMONIALS
        ═══════════════════════════════════════════ */}
        <section className="section-pad" style={{ background:"var(--surface)" }}>
          <div className="container">
            <div style={{ textAlign:"center", marginBottom:48 }}>
              <div className="eyebrow">Reviews</div>
              <h2 className="section-title">Mumbaikars <em>love Glamr</em></h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
              {REVIEWS.map(({ initials, name, area, text, service }) => (
                <div key={name} style={{
                  padding:22, borderRadius:"var(--radius-lg)",
                  border:"1px solid var(--border)", background:"var(--surface-2)"
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                    <div style={{
                      width:40, height:40, borderRadius:"50%", flexShrink:0,
                      background:"var(--gold-dim)", border:"1px solid var(--gold-border)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:13, fontWeight:700, color:"var(--gold)"
                    }}>{initials}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:14, color:"var(--text-1)" }}>{name}</div>
                      <div style={{ fontSize:11, color:"var(--text-3)", display:"flex", alignItems:"center", gap:3 }}>
                        <MapPin size={10} /> {area}
                      </div>
                    </div>
                    <span style={{ color:"var(--gold)", fontSize:11 }}>★★★★★</span>
                  </div>
                  <p style={{ fontSize:13, color:"var(--text-2)", lineHeight:1.65, fontStyle:"italic" }}>
                    &ldquo;{text}&rdquo;
                  </p>
                  <div style={{
                    marginTop:12, display:"inline-block", fontSize:10,
                    padding:"3px 8px", borderRadius:5,
                    background:"var(--surface-4)", color:"var(--text-3)"
                  }}>{service}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CTA
        ═══════════════════════════════════════════ */}
        <section style={{ padding:"0 var(--page-pad) 80px" }}>
          <div style={{ maxWidth:"var(--max-width)", margin:"0 auto" }}>
            <div style={{
              background:"var(--gold)", borderRadius:"var(--radius-2xl)",
              padding:"60px", textAlign:"center", position:"relative", overflow:"hidden"
            }}>
              <div style={{
                position:"absolute", top:-40, right:-40, width:200, height:200,
                borderRadius:"50%", background:"rgba(255,255,255,0.1)"
              }} />
              <div style={{
                position:"absolute", bottom:-60, left:-20, width:260, height:260,
                borderRadius:"50%", background:"rgba(0,0,0,0.06)"
              }} />
              <div style={{ position:"relative", zIndex:1 }}>
                <h2 style={{
                  fontSize:"clamp(28px,4vw,38px)", fontWeight:800, color:"#000",
                  letterSpacing:"-0.04em", marginBottom:12
                }}>Ready for your glow-up? ✨</h2>
                <p style={{ fontSize:16, color:"rgba(0,0,0,0.6)", marginBottom:32 }}>
                  Join 50,000+ Mumbaikars who book on Glamr
                </p>
                <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
                  <Link href="/signup" style={{
                    padding:"13px 28px", background:"#000", color:"var(--gold)",
                    border:"none", borderRadius:10, fontWeight:700, fontSize:15,
                    cursor:"pointer", textDecoration:"none"
                  }}>
                    Sign up free →
                  </Link>
                  <Link href="/explore" style={{
                    padding:"13px 28px", background:"rgba(0,0,0,0.1)", color:"#000",
                    border:"1px solid rgba(0,0,0,0.2)", borderRadius:10,
                    fontWeight:600, fontSize:15, cursor:"pointer", textDecoration:"none"
                  }}>
                    Browse Salons
                  </Link>
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