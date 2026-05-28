"use client";

import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  className?: string;
}

export default function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl bg-card border border-border",
        className,
      )}
    >
      {/* Image skeleton */}
      <div className="relative aspect-product bg-surface-elevated overflow-hidden">
        <div className="absolute inset-0 animate-shimmer-dark" />
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col gap-2 p-3">
        {/* Brand */}
        <div className="h-2.5 w-16 rounded-full animate-shimmer-dark" />
        {/* Name line 1 */}
        <div className="h-3.5 w-full rounded-full animate-shimmer-dark" />
        {/* Name line 2 */}
        <div className="h-3.5 w-3/4 rounded-full animate-shimmer-dark" />

        <div className="mt-1 pt-2 border-t border-border/50 space-y-2">
          {/* Price */}
          <div className="h-4 w-24 rounded-full animate-shimmer-dark" />
          {/* Button */}
          <div className="h-9 w-full rounded-xl animate-shimmer-dark" />
        </div>
      </div>
    </div>
  );
}
