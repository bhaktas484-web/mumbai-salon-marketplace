import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "gold" | "rose" | "teal" | "muted" | "success" | "warning";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold:    "bg-brand-500/15 text-brand-400 border-brand-500/20",
  rose:    "bg-accent-rose/12 text-accent-rose border-accent-rose/20",
  teal:    "bg-accent-teal/12 text-accent-teal border-accent-teal/20",
  muted:   "bg-surface-raised text-ink-muted border-surface-border",
  success: "bg-green-500/12 text-green-400 border-green-500/20",
  warning: "bg-yellow-500/12 text-yellow-400 border-yellow-500/20",
};

const dotClasses: Record<BadgeVariant, string> = {
  gold:    "bg-brand-400",
  rose:    "bg-accent-rose",
  teal:    "bg-accent-teal",
  muted:   "bg-ink-muted",
  success: "bg-green-400",
  warning: "bg-yellow-400",
};

export function Badge({ variant = "muted", dot, children, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5",
        "rounded-full text-xs font-semibold tracking-wide border",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotClasses[variant])} />
      )}
      {children}
    </span>
  );
}