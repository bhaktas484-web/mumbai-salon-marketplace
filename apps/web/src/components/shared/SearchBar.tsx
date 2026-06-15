"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const POPULAR_SEARCHES = [
  "Hair colouring Bandra","Bridal makeup Colaba","Keratin treatment Juhu",
  "Men's haircut Andheri","Nail art Worli","Facial Lower Parel",
];
const TRENDING_AREAS = ["Bandra","Juhu","Colaba","Andheri","Worli","Lower Parel","Powai"];

interface SearchBarProps {
  size?: "default" | "hero";
  placeholder?: string;
  className?: string;
}

export function SearchBar({ size = "default", placeholder, className }: SearchBarProps) {
  const [query,      setQuery]      = useState("");
  const [focused,    setFocused]    = useState(false);
  const [recents,    setRecents]    = useState<string[]>([]);
  const inputRef  = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router    = useRouter();

  /* Load recent searches */
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("glamr:recent_searches") ?? "[]") as string[];
      setRecents(stored.slice(0, 5));
    } catch { /* ignore */ }
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (term: string) => {
    const q = term.trim();
    if (!q) return;
    // Persist recent
    const updated = [q, ...recents.filter((r) => r !== q)].slice(0, 5);
    localStorage.setItem("glamr:recent_searches", JSON.stringify(updated));
    setRecents(updated);
    setFocused(false);
    setQuery(q);
    router.push(`/explore?q=${encodeURIComponent(q)}`);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch(query);
    if (e.key === "Escape") { setFocused(false); inputRef.current?.blur(); }
  };

  const showDropdown = focused && !query;
  const showResults  = focused && query.length > 1;

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      {/* Input wrapper */}
      <div
        className={cn(
          "flex items-center gap-3 bg-surface-raised border rounded-2xl px-4 transition-all duration-200",
          size === "hero" ? "h-16 text-base" : "h-12 text-sm",
          focused
            ? "border-brand-500 ring-4 ring-brand-500/12 shadow-glow-gold"
            : "border-surface-border hover:border-surface-muted"
        )}
      >
        <Search
          size={size === "hero" ? 22 : 18}
          className={cn("shrink-0 transition-colors", focused ? "text-brand-500" : "text-ink-muted")}
        />

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKey}
          placeholder={placeholder ?? "Search salons, services, areas…"}
          className="flex-1 bg-transparent outline-none text-ink-primary placeholder:text-ink-disabled font-body"
        />

        {query && (
          <button
           aria-label="Clear search"
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="shrink-0 text-ink-muted hover:text-ink-primary transition-colors"
          >
            <X size={16} />
          </button>
        )}

        {/* Search button */}
        <button
          onClick={() => handleSearch(query)}
          className={cn(
            "shrink-0 px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-150",
            "bg-brand-500 text-black hover:bg-brand-400 hover:shadow-glow-gold"
          )}
        >
          Search
        </button>
      </div>

      {/* Dropdown */}
      {(showDropdown || showResults) && (
        <div className="absolute top-full left-0 right-0 mt-2 glass border border-surface-border rounded-2xl shadow-lg overflow-hidden z-[300] animate-slide-down">
          {/* Recent searches */}
          {showDropdown && recents.length > 0 && (
            <div className="p-3">
              <p className="text-xs font-semibold text-ink-disabled uppercase tracking-widest px-2 mb-2">Recent</p>
              {recents.map((r) => (
                <button
                  key={r}
                  onClick={() => handleSearch(r)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-ink-secondary hover:text-ink-primary hover:bg-surface-raised transition-all text-left"
                >
                  <Clock size={14} className="text-ink-disabled shrink-0" />
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Popular in Mumbai */}
          {showDropdown && (
            <div className="border-t border-surface-border p-3">
              <p className="text-xs font-semibold text-ink-disabled uppercase tracking-widest px-2 mb-2">Popular in Mumbai</p>
              {POPULAR_SEARCHES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-ink-secondary hover:text-ink-primary hover:bg-surface-raised transition-all text-left"
                >
                  <Search size={14} className="text-ink-disabled shrink-0" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Area quick links */}
          {showDropdown && (
            <div className="border-t border-surface-border p-3">
              <p className="text-xs font-semibold text-ink-disabled uppercase tracking-widest px-2 mb-2">Browse by Area</p>
              <div className="flex flex-wrap gap-2 px-2">
                {TRENDING_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => router.push(`/explore?area=${area}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-raised border border-surface-border text-xs font-medium text-ink-secondary hover:border-brand-500/50 hover:text-brand-400 transition-all"
                  >
                    <MapPin size={11} />
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}