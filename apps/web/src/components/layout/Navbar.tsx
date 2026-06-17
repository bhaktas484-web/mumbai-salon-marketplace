"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MapPin, ChevronDown, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Explore",  href: "/explore" },
  { label: "Near Me",  href: "/explore?sort=distance" },
  { label: "Trending", href: "/explore?tag=trending" },
  { label: "Bridal",   href: "/explore?category=Bridal" },
];

export function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-[200] transition-all duration-300",
          scrolled ? "glass shadow-md" : "bg-transparent"
        )}
        style={{ height: "var(--nav-height)" }}
      >
        <div className="container h-full flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div
              className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-black text-[17px] transition-transform group-hover:scale-105"
              style={{ background: "var(--gold)", transform: "rotate(-10deg)" }}
            >
              ✂
            </div>
            <span className="font-display font-extrabold text-[20px] tracking-[-0.5px]" style={{ color: "var(--text-1)" }}>
              Glam<span style={{ color: "var(--gold)" }}>r</span>
            </span>
          </Link>

          {/* Location pill */}
          <button className={cn(
            "hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-150",
            "border bg-surface-3 hover:border-gold"
          )}
            style={{ borderColor: "var(--border-2)", color: "var(--text-2)" }}
          >
            <MapPin size={13} style={{ color: "var(--gold)" }} />
            <span className="font-medium">Mumbai</span>
            <ChevronDown size={12} />
          </button>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                  pathname === link.href
                    ? "text-gold bg-gold-dim"
                    : "text-ink-2 hover:text-ink-1 hover:bg-surface-3"
                )}
                style={{
                  color: pathname === link.href ? "var(--gold)" : undefined,
                  background: pathname === link.href ? "var(--gold-dim)" : undefined,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden md:flex items-center px-4 py-[7px] rounded-lg text-sm font-medium border transition-all duration-150 hover:border-gold"
              style={{ color: "var(--text-2)", borderColor: "var(--border-2)" }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="hidden md:flex items-center px-[18px] py-[7px] rounded-lg text-sm font-semibold text-black transition-all hover:brightness-110"
              style={{ background: "var(--gold)" }}
            >
              Sign up free
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-all"
              style={{ color: "var(--text-2)", background: mobileOpen ? "var(--surface-3)" : undefined }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[199] lg:hidden transition-all duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className={cn(
            "absolute top-[var(--nav-height)] inset-x-0 glass border-b transition-transform duration-300",
            mobileOpen ? "translate-y-0" : "-translate-y-4"
          )}
          style={{ borderColor: "var(--border-2)" }}
        >
          <div className="container py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ color: pathname === link.href ? "var(--gold)" : "var(--text-2)" }}
              >
                {link.label}
              </Link>
            ))}
            <div className="divider" />
            <div className="flex flex-col gap-2">
              <Link href="/login" className="btn btn-outline btn-md w-full text-center">Log in</Link>
              <Link href="/signup" className="btn btn-gold btn-md w-full text-center">Sign up free</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}