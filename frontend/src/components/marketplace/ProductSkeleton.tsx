"use client";

export default function ProductSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm h-full">
      {/* Image */}
      <div className="relative aspect-square animate-shimmer" />

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 space-y-2">
        {/* Brand + Rating row */}
        <div className="flex items-center justify-between">
          <div className="h-2 w-14 rounded bg-gray-100 animate-shimmer" />
          <div className="h-2 w-12 rounded bg-gray-100 animate-shimmer" />
        </div>
        {/* Name */}
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded bg-gray-100 animate-shimmer" />
          <div className="h-3 w-2/3 rounded bg-gray-100 animate-shimmer" />
        </div>
        {/* Price */}
        <div className="mt-auto pt-1 space-y-2">
          <div className="h-4 w-24 rounded bg-gray-100 animate-shimmer" />
          <div className="h-9 w-full rounded-xl bg-gray-100 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
