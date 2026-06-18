"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Grid3X3, List, X, ChevronDown } from "lucide-react";
import { Navbar }       from "@/components/layout/Navbar";
import { Footer }       from "@/components/layout/Footer";
import { SearchBar }    from "@/components/shared/SearchBar";
import { SalonCard }    from "@/components/salon/SalonCard";
import { Button }       from "@/components/ui/Button";
import { Badge }        from "@/components/ui/Badge";
import { SalonCardSkeleton } from "@/components/ui/Skeleton";
import { useSalons }    from "@/hooks/useSalons";
import type { SalonFilters, MumbaiArea, ServiceCategory, SalonTier } from "@/types/salon";
import { cn }           from "@/lib/utils";

const AREAS: MumbaiArea[]        = ["Bandra","Juhu","Andheri","Colaba","Worli","Lower Parel","Powai","Malad","Dadar","Santacruz","Borivali","Thane","Chembur"];
const CATEGORIES: ServiceCategory[] = ["Hair","Skin","Nails","Makeup","Spa & Massage","Bridal","Beard & Grooming","Threading & Waxing"];
const TIERS: SalonTier[]         = ["Standard","Premium","Luxury"];
const SORT_OPTIONS               = [
  { value: "rating",     label: "Top Rated"   },
  { value: "distance",   label: "Nearest"     },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "newest",     label: "Newest"      },
] as const;

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const [filters, setFilters]       = useState<SalonFilters>({});
  const [viewMode, setViewMode]     = useState<"grid" | "list">("grid");
  const [, setFiltersOpen] = useState(false);

  /* Sync filters from URL */
  useEffect(() => {
    const area     = searchParams.getAll("area") as MumbaiArea[];
    const category = searchParams.getAll("category") as ServiceCategory[];
    const tier     = searchParams.getAll("tier") as SalonTier[];
    setFilters({ area, category, tier });
  }, [searchParams]);

  const { salons, isLoading, total, hasMore, fetchNext } = useSalons({ filters, pageSize: 12 });

  const activeFilterCount =
    (filters.area?.length ?? 0) +
    (filters.category?.length ?? 0) +
    (filters.tier?.length ?? 0) +
    (filters.isOpen ? 1 : 0);

  const toggleFilter = <K extends keyof SalonFilters>(key: K, value: string) => {
    setFilters((prev) => {
      const arr = (prev[key] as string[] | undefined) ?? [];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  return (
    <>
      <Navbar />
      <main className="pt-[var(--navbar-height)] min-h-screen">

        {/* ── Search header ─────────────────────────────── */}
        <div className="border-b border-surface-border bg-surface-card">
          <div className="container-app py-5">
            <SearchBar className="max-w-2xl" />
          </div>
        </div>

        <div className="container-app py-8">
          <div className="flex gap-8">

            {/* ── Sidebar filters (desktop) ────────────── */}
            <aside className="hidden lg:block w-64 shrink-0 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-ink-primary">Filters</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => setFilters({})}
                    className="text-xs text-brand-400 hover:text-brand-300"
                  >
                    Clear all ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Open now */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.isOpen ?? false}
                    onChange={(e) => setFilters((p) => ({ ...p, isOpen: e.target.checked  }))}
                    className="w-4 h-4 accent-brand-500"
                  />
                  <span className="text-sm text-ink-secondary">Open now</span>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </label>
              </div>

              {/* Areas */}
              <FilterGroup
                title="Area"
                items={AREAS}
                selected={filters.area ?? []}
                onToggle={(v) => toggleFilter("area", v)}
              />

              {/* Categories */}
              <FilterGroup
                title="Service"
                items={CATEGORIES}
                selected={filters.category ?? []}
                onToggle={(v) => toggleFilter("category", v)}
              />

              {/* Tier */}
              <FilterGroup
                title="Tier"
                items={TIERS}
                selected={filters.tier ?? []}
                onToggle={(v) => toggleFilter("tier", v)}
              />
            </aside>

            {/* ── Main grid ────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <div>
                  {isLoading
                    ? <p className="text-sm text-ink-muted">Loading salons…</p>
                    : <p className="text-sm text-ink-secondary"><span className="font-semibold text-ink-primary">{total.toLocaleString("en-IN")}</span> salons found</p>
                  }
                </div>

                <div className="flex items-center gap-2">
                  {/* Sort */}
                  <div className="relative">
                    <select
                     aria-label="Sort salons"
                      value={filters.sortBy ?? "rating"}
onChange={(e) =>
  setFilters((p) => ({
    ...p,
    sortBy: e.target.value as
      | "rating"
      | "price_asc"
      | "price_desc"
      | "distance"
      | "newest",
  }))
}                      className="appearance-none input py-2 pr-8 pl-3 text-sm w-44 cursor-pointer"
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
                  </div>

                  {/* Mobile filter btn */}
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<SlidersHorizontal size={14} />}
                    onClick={() => setFiltersOpen(true)}
                    className="lg:hidden"
                  >
                    Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                  </Button>

                  {/* View toggle */}
                  <div className="flex border border-surface-border rounded-xl overflow-hidden">
                    {(["grid", "list"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={cn(
                          "px-3 py-2 transition-colors",
                          viewMode === mode ? "bg-brand-500/15 text-brand-400" : "text-ink-muted hover:text-ink-primary"
                        )}
                      >
                        {mode === "grid" ? <Grid3X3 size={15} /> : <List size={15} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {[...(filters.area ?? []), ...(filters.category ?? []), ...(filters.tier ?? [])].map((f) => (
                    <Badge key={f} variant="gold" className="cursor-pointer gap-2" onClick={() => {
                      if (AREAS.includes(f as MumbaiArea))        toggleFilter("area", f);
                      else if (CATEGORIES.includes(f as ServiceCategory)) toggleFilter("category", f);
                      else if (TIERS.includes(f as SalonTier))   toggleFilter("tier", f);
                    }}>
                      {f} <X size={10} />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Salon grid */}
              <div className={cn(
                "grid gap-5",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              )}>
                {isLoading && salons.length === 0
                  ? Array.from({ length: 6 }).map((_, i) => <SalonCardSkeleton key={i} />)
                  : salons.map((salon, i) => (
                      <SalonCard key={salon.id} salon={salon} priority={i < 3} />
                    ))
                }
              </div>

              {/* Load more */}
              {hasMore && !isLoading && (
                <div className="text-center mt-10">
                  <Button variant="outline" size="lg" onClick={fetchNext}>
                    Load more salons
                  </Button>
                </div>
              )}
              {isLoading && salons.length > 0 && (
                <div className="text-center mt-8 text-ink-muted text-sm">Loading more…</div>
              )}
              {!hasMore && salons.length > 0 && (
                <p className="text-center mt-10 text-sm text-ink-disabled">
                  You&apos;ve seen all {total} salons ✓
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ── Filter group sub-component ──────────────────────────── */
function FilterGroup({
  title, items, selected, onToggle,
}: {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const show = expanded ? items : items.slice(0, 5);

  return (
    <div className="space-y-3">
      <button
        className="flex items-center justify-between w-full text-sm font-semibold text-ink-primary"
        onClick={() => setExpanded((p) => !p)}
      >
        {title}
        <ChevronDown size={14} className={cn("transition-transform", expanded && "rotate-180")} />
      </button>
      <div className="space-y-2">
        {show.map((item) => (
          <label key={item} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
              className="w-4 h-4 accent-brand-500"
            />
            <span className="text-sm text-ink-secondary group-hover:text-ink-primary transition-colors">
              {item}
            </span>
          </label>
        ))}
        {items.length > 5 && (
          <button
            onClick={() => setExpanded((p) => !p)}
            className="text-xs text-brand-400 hover:text-brand-300 mt-1"
          >
            {expanded ? "Show less" : `+${items.length - 5} more`}
          </button>
        )}
      </div>
    </div>
  );
}