import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
 
type Variant = "primary" | "outline" | "ghost" | "destructive" | "brand-outline";
type Size    = "sm" | "md" | "lg" | "xl" | "icon";
 
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   Variant;
  size?:      Size;
  /** Render as child element via Radix Slot (e.g. wrap a Next.js Link) */
  asChild?:   boolean;
  loading?:   boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
}
 
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-black font-semibold hover:bg-brand-400 hover:shadow-glow-gold hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "border border-surface-border text-ink-primary hover:border-brand-500 hover:text-brand-500 hover:bg-brand-500/5",
  ghost:
    "text-ink-secondary hover:bg-surface-raised hover:text-ink-primary",
  destructive:
    "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
  "brand-outline":
    "border border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-black",
};
 
const sizeClasses: Record<Size, string> = {
  sm:   "h-8 px-4 text-xs gap-1.5",
  md:   "h-10 px-5 text-sm gap-2",
  lg:   "h-12 px-7 text-base gap-2",
  xl:   "h-14 px-9 text-lg gap-2.5",
  icon: "h-10 w-10 p-0",
};
 
const baseClasses =
  "inline-flex items-center justify-center rounded-full font-body " +
  "transition-all duration-200 ease-smooth whitespace-nowrap select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-surface " +
  "disabled:opacity-45 disabled:pointer-events-none";
 
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const resolvedClass = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    );
 
    // ── asChild mode: delegate to Slot (e.g. <Link>)
    // Do NOT pass disabled/loading to Slot — it merges into child element
    // and React.Fragment cannot accept those props.
    // Icons are not rendered in asChild mode to keep the child a single element.
    if (asChild) {
      return (
        <Slot ref={ref} className={resolvedClass} {...props}>
          {children}
        </Slot>
      );
    }
 
    // ── Native <button> mode
    const isDisabled = disabled || loading;
 
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={resolvedClass}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {children}
          </span>
        ) : (
          <>
            {leftIcon  && <span className="shrink-0 inline-flex">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0 inline-flex">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
 