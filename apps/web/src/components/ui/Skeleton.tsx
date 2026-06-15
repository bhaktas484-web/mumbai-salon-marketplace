import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function Skeleton({ className, rounded = "md", ...props }: SkeletonProps) {
  const roundedMap = {
    sm: "rounded", md: "rounded-md", lg: "rounded-lg",
    xl: "rounded-xl", "2xl": "rounded-2xl", full: "rounded-full",
  };
  return (
    <div
      className={cn(
        "skeleton animate-shimmer",
        roundedMap[rounded],
        className
      )}
      {...props}
    />
  );
}

export function SalonCardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <Skeleton className="h-52 w-full" rounded="sm" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" rounded="full" />
          <Skeleton className="h-6 w-20" rounded="full" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-24" rounded="full" />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="space-y-4 max-w-2xl">
      <Skeleton className="h-12 w-3/4" rounded="lg" />
      <Skeleton className="h-12 w-1/2" rounded="lg" />
      <Skeleton className="h-6 w-2/3" rounded="md" />
      <Skeleton className="h-14 w-80" rounded="full" />
    </div>
  );
}