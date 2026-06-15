"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Clock, BadgeCheck, Zap } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { cn, formatINR, formatDistance } from "@/lib/utils";
import type { SalonListing } from "@/types/salon";

interface SalonCardProps {
  salon: SalonListing;
  priority?: boolean;
  className?: string;
}

const TIER_BADGE: Record<string, { variant: "gold" | "rose" | "teal" | "muted"; label: string }> = {
  Luxury:   { variant: "gold",  label: "✦ Luxury" },
  Premium:  { variant: "teal",  label: "Premium" },
  Standard: { variant: "muted", label: "Standard" },
};

export function SalonCard({ salon, priority = false, className }: SalonCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const tier = TIER_BADGE[salon.tier] ?? TIER_BADGE.Standard!;

  return (
    <Link href={`/salon/${salon.slug}`} className={cn("group block", className)}>
      <article className="card h-full flex flex-col">

        {/* ── Cover image ──────────────────────────────────── */}
        <div className="relative h-52 overflow-hidden bg-surface-raised">
          <Image
            src={salon.coverImage}
            alt={salon.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* ── Top badges ─────────────────────────────────── */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {salon.tags.includes("Trending") && (
              <Badge variant="rose" dot>Trending</Badge>
            )}
            {salon.tags.includes("New") && (
              <Badge variant="teal" dot>New</Badge>
            )}
            <Badge variant={tier.variant}>{tier.label}</Badge>
          </div>

          {/* Wishlist btn */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted((p) => !p); }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center",
              "glass border border-white/10 transition-all duration-200",
              "hover:scale-110 hover:border-accent-rose/50",
              wishlisted && "bg-accent-rose/20 border-accent-rose/50"
            )}
          >
            <Heart
              size={16}
              className={cn(
                "transition-colors",
                wishlisted ? "fill-accent-rose text-accent-rose" : "text-white"
              )}
            />
          </button>

          {/* Open / Closed pill */}
          <div className="absolute bottom-3 left-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                salon.isOpen
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", salon.isOpen ? "bg-green-400 animate-pulse" : "bg-red-400")} />
              {salon.isOpen ? "Open now" : "Closed"}
            </span>
          </div>

          {/* Verified check */}
          {salon.isVerified && (
            <div className="absolute bottom-3 right-3">
              <span className="inline-flex items-center gap-1 text-xs text-brand-400 font-medium">
                <BadgeCheck size={14} className="fill-brand-500/20" /> Verified
              </span>
            </div>
          )}
        </div>

        {/* ── Content ──────────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-4 gap-3">

          {/* Name + area */}
          <div>
            <h3 className="font-display font-bold text-lg text-ink-primary leading-tight group-hover:text-brand-400 transition-colors line-clamp-1">
              {salon.name}
            </h3>
            {salon.tagline && (
              <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">{salon.tagline}</p>
            )}
          </div>

          {/* Rating */}
          <StarRating
            rating={salon.rating.overall}
            reviewCount={salon.rating.totalReviews}
            size="sm"
          />

          {/* Location + distance */}
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <MapPin size={12} className="text-ink-disabled shrink-0" />
            <span className="line-clamp-1">{salon.location.area}</span>
            {salon.location.landmark && (
              <span className="text-ink-disabled">· {salon.location.landmark}</span>
            )}
            {salon.distanceKm !== undefined && (
              <>
                <span className="text-surface-muted">·</span>
                <span className="text-brand-400 font-medium">{formatDistance(salon.distanceKm)}</span>
              </>
            )}
          </div>

          {/* Gender badge */}
          <div className="flex items-center gap-1.5">
            <Badge variant="muted">{salon.gender}</Badge>
            {salon.tags.includes("Top Rated") && (
              <Badge variant="gold">⭐ Top Rated</Badge>
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-1 mt-auto">
            <div>
              <span className="text-xs text-ink-muted">Starting at</span>
              <p className="font-bold text-base text-ink-primary">
                {formatINR(salon.startingPrice)}
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={(e) => e.preventDefault()}
              leftIcon={<Zap size={13} />}
              className="shrink-0"
            >
              Book Now
            </Button>
          </div>
        </div>
      </article>
    </Link>
  );
}