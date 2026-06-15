import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:     string;
  error?:     string;
  hint?:      string;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, onRightIconClick, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-secondary">
            {label}
            {props.required && <span className="text-accent-rose ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-surface-raised border border-surface-border rounded-xl",
              "px-4 py-3 text-sm text-ink-primary font-body placeholder:text-ink-disabled",
              "transition-all duration-150 outline-none",
              "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/12",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/12",
              leftIcon  && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary transition-colors"
              tabIndex={-1}
            >
              {rightIcon}
            </button>
          )}
        </div>

        {error && <p className="text-xs text-red-400 flex items-center gap-1">⚠ {error}</p>}
        {hint && !error && <p className="text-xs text-ink-muted">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";