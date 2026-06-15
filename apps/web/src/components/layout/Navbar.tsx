"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, MapPin, Bell, ChevronDown, Scissors } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Explore",   href: "/explore" },
  { label: "Near Me",   href: "/explore?sort=distance" },
  { label: "Trending",  href: "/explore?tag=trending" },
  { label: "Bridal",    href: "/explore?category=Bridal" },
];

export function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [area,         setArea]         = useState("Mumbai");
  const pathname = usePathname();

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-[200] transition-all duration-300",
          scrolled
            ? "glass border-b border-surface-border shadow-md"
            : "bg-transparent"
        )}
        style={{ height: "var(--navbar-height)" }}
      >
        <div className="container-app h-full flex items-center justify-between gap-4">

          {/* ── Logo ──────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-gold group-hover:scale-105 transition-transform">
              <Scissors size={16} className="text-black rotate-45" />
            </div>
            <span className="font-display font-bold text-xl text-ink-primary">
              Glam<span className="text-gradient-gold">r</span>
            </span>
          </Link>

          {/* ── Location pill (desktop) ───────────────────── */}
          <button
            className={cn(
              "hidden md:flex items-center gap-2 px-3 py-2 rounded-xl",
              "border border-surface-border bg-surface-raised hover:border-brand-500/50",
              "text-sm text-ink-secondary hover:text-ink-primary transition-all duration-150"
            )}
          >
            <MapPin size={14} className="text-brand-500" />
            <span className="font-medium">{area}</span>
            <ChevronDown size={12} />
          </button>

          {/* ── Nav links (desktop) ───────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                  pathname === link.href
                    ? "text-brand-500 bg-brand-500/10"
                    : "text-ink-secondary hover:text-ink-primary hover:bg-surface-raised"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Right actions ─────────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* Search icon (mobile) */}
            <Link
              href="/explore"
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-raised transition-all"
            >
              <Search size={18} />
            </Link>

            {/* Notifications (authenticated users) */}
            <button  aria-label="Notifications" className="hidden md:flex w-9 h-9 items-center justify-center rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-raised transition-all relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-rose border border-surface" />
            </button>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface-raised transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ─────────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-[199] lg:hidden transition-all duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={cn(
            "absolute top-[var(--navbar-height)] inset-x-0 glass border-b border-surface-border",
            "transition-transform duration-300 ease-spring",
            mobileOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <div className="container-app py-4 flex flex-col gap-1">
            {/* Location */}
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-surface-border bg-surface-raised mb-2 text-sm text-ink-secondary">
              <MapPin size={14} className="text-brand-500" />
              <span className="font-medium">{area}</span>
              <ChevronDown size={12} className="ml-auto" />
            </button>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  pathname === link.href
                    ? "text-brand-500 bg-brand-500/10"
                    : "text-ink-secondary hover:text-ink-primary hover:bg-surface-raised"
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="divider" />

            <div className="flex flex-col gap-2 pt-1">
              <Button variant="outline" size="md" asChild className="w-full">
                <Link href="/login">Log in</Link>
              </Button>
              <Button variant="primary" size="md" asChild className="w-full">
                <Link href="/signup">Sign up free</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}