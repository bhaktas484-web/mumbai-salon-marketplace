import Link from "next/link";
import { Scissors, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const AREAS = ["Bandra","Juhu","Andheri","Colaba","Worli","Lower Parel","Powai","Malad","Dadar","Santacruz"];
const SERVICES = ["Hair","Skin & Facial","Nails","Makeup","Spa & Massage","Bridal","Threading & Waxing","Beard & Grooming"];
const COMPANY = [
  { label: "About Us",        href: "/about" },
  { label: "For Salon Owners",href: "/partners" },
  { label: "Blog",            href: "/blog" },
  { label: "Careers",         href: "/careers" },
  { label: "Press",           href: "/press" },
  { label: "Contact",         href: "/contact" },
];
const LEGAL = [
  { label: "Privacy Policy",   href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy",    href: "/cookies" },
  { label: "Refund Policy",    href: "/refunds" },
];
const SOCIAL = [
  { icon: Instagram, href: "https://instagram.com/glamrin", label: "Instagram" },
  { icon: Twitter,   href: "https://twitter.com/glamrin",   label: "Twitter" },
  { icon: Facebook,  href: "https://facebook.com/glamrin",  label: "Facebook" },
  { icon: Youtube,   href: "https://youtube.com/@glamrin",  label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-card mt-24">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* ── Brand col ────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2 w-fit group">
              <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center">
                <Scissors size={18} className="text-black rotate-45" />
              </div>
              <span className="font-display font-bold text-2xl">
                Glam<span className="text-gradient-gold">r</span>
              </span>
            </Link>

            <p className="text-sm text-ink-muted leading-relaxed max-w-xs">
              Mumbai&apos;s premier salon marketplace. Book top-rated salons and beauty studios 
              across the city — instantly, reliably, beautifully.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-surface-raised border border-surface-border flex items-center justify-center text-ink-muted hover:text-brand-500 hover:border-brand-500/50 transition-all duration-150"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* App download badges */}
            <div className="flex items-center gap-3 pt-1">
              <a href="#" className="px-4 py-2.5 rounded-xl bg-surface-raised border border-surface-border text-xs font-medium text-ink-secondary hover:border-brand-500/40 hover:text-ink-primary transition-all">
                📱 iOS App
              </a>
              <a href="#" className="px-4 py-2.5 rounded-xl bg-surface-raised border border-surface-border text-xs font-medium text-ink-secondary hover:border-brand-500/40 hover:text-ink-primary transition-all">
                🤖 Android App
              </a>
            </div>
          </div>

          {/* ── Explore by area ───────────────────────────── */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-ink-primary">Explore by Area</h4>
            <ul className="space-y-2.5">
              {AREAS.map((area) => (
                <li key={area}>
                  <Link
                    href={`/explore?area=${area}`}
                    className="text-sm text-ink-muted hover:text-brand-400 transition-colors"
                  >
                    Salons in {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services ──────────────────────────────────── */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-ink-primary">Services</h4>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s}>
                  <Link
                    href={`/explore?category=${encodeURIComponent(s)}`}
                    className="text-sm text-ink-muted hover:text-brand-400 transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company ───────────────────────────────────── */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-ink-primary">Company</h4>
            <ul className="space-y-2.5">
              {COMPANY.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-ink-muted hover:text-brand-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────── */}
      <div className="border-t border-surface-border">
        <div className="container-app py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-disabled text-center sm:text-left">
            © {new Date().getFullYear()} Glamr Technologies Pvt. Ltd. · Made with ❤️ in Mumbai
          </p>
          <div className="flex items-center gap-5">
            {LEGAL.map(({ label, href }) => (
              <Link key={label} href={href} className="text-xs text-ink-disabled hover:text-ink-muted transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}