import Link from "next/link";

const AREAS    = ["Bandra","Juhu","Colaba","Worli","Andheri","Lower Parel","Powai","Malad"];
const SERVICES = ["Hair","Skin & Facial","Nails","Makeup","Spa & Massage","Bridal","Waxing","Men's Grooming"];
const COMPANY  = [
  { label:"About Us",         href:"/about"    },
  { label:"For Salon Owners", href:"/partners" },
  { label:"Blog",             href:"/blog"     },
  { label:"Careers",          href:"/careers"  },
  { label:"Contact",          href:"/contact"  },
];

export function Footer() {
  return (
    <footer style={{ borderTop:"1px solid var(--border)", background:"var(--surface-2)" }}>
      <div className="container" style={{ paddingTop:48, paddingBottom:28 }}>

        {/* Top grid */}
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, marginBottom:40 }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", marginBottom:14 }}>
              <div style={{
                width:30, height:30, borderRadius:8, background:"var(--gold)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:14, transform:"rotate(-10deg)"
              }}>✂</div>
              <span style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:18, color:"var(--text-1)" }}>
                Glam<span style={{ color:"var(--gold)" }}>r</span>
              </span>
            </Link>
            <p style={{ fontSize:13, color:"var(--text-3)", lineHeight:1.7, maxWidth:260, marginBottom:20 }}>
              Mumbai&apos;s premier salon marketplace. Book top-rated salons instantly, reliably, beautifully.
            </p>
            <div style={{ display:"flex", gap:8 }}>
              {["📸","🐦","📘","▶️"].map((icon, i) => (
                <div key={i} style={{
                  width:34, height:34, borderRadius:8,
                  border:"1px solid var(--border-2)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:15, cursor:"pointer"
                }}>{icon}</div>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.09em", color:"var(--text-3)", fontWeight:600, marginBottom:16 }}>
              Explore
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {AREAS.map(a => (
                <Link key={a} href={`/explore?area=${a}`} style={{ fontSize:13, color:"var(--text-2)", textDecoration:"none" }}>
                  {a} Salons
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.09em", color:"var(--text-3)", fontWeight:600, marginBottom:16 }}>
              Services
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {SERVICES.map(s => (
                <Link key={s} href={`/explore?category=${encodeURIComponent(s)}`} style={{ fontSize:13, color:"var(--text-2)", textDecoration:"none" }}>
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.09em", color:"var(--text-3)", fontWeight:600, marginBottom:16 }}>
              Company
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {COMPANY.map(({ label, href }) => (
                <Link key={label} href={href} style={{ fontSize:13, color:"var(--text-2)", textDecoration:"none" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop:"1px solid var(--border)", paddingTop:24,
          display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12
        }}>
          <span style={{ fontSize:12, color:"var(--text-3)" }}>
            © {new Date().getFullYear()} Glamr Technologies Pvt. Ltd. · Made with ❤️ in Mumbai
          </span>
          <div style={{ display:"flex", gap:20 }}>
            {["Privacy","Terms","Refunds"].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} style={{ fontSize:12, color:"var(--text-3)", textDecoration:"none" }}>
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}