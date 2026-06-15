import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

const sizeMap = { xs: 10, sm: 12, md: 14, lg: 18 };
const textMap = { xs: "text-2xs", sm: "text-xs", md: "text-sm", lg: "text-base" };

export function StarRating({
  rating,
  maxStars = 5,
  size = "sm",
  showValue = true,
  reviewCount,
  className,
}: StarRatingProps) {
  const px = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled   = i < Math.floor(rating);
          const partial  = !filled && i < rating;
          return (
            <span key={i} className="relative inline-block" style={{ width: px, height: px }}>
              {/* Empty star */}
              <Star size={px} className="text-surface-muted fill-surface-muted" />
              {/* Filled overlay */}
              {(filled || partial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: partial ? `${(rating % 1) * 100}%` : "100%" }}
                >
                  <Star size={px} className="text-brand-500 fill-brand-500" />
                </span>
              )}
            </span>
          );
        })}
      </div>

      {showValue && (
        <span className={cn("font-semibold text-ink-primary", textMap[size])}>
          {rating.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className={cn("text-ink-muted", textMap[size])}>
          ({reviewCount.toLocaleString("en-IN")})
        </span>
      )}
    </div>
  );
}