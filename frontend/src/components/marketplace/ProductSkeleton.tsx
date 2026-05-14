"use client";

export default function ProductSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-white/20 dark:border-white/5 bg-card/40 backdrop-blur-md shadow-premium h-full">
      <div className="relative aspect-[4/5] bg-muted animate-pulse" />
      <div className="flex flex-1 flex-col p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-2 w-20 bg-muted animate-pulse rounded-full" />
          <div className="h-6 w-full bg-muted animate-pulse rounded-lg" />
          <div className="h-6 w-2/3 bg-muted animate-pulse rounded-lg" />
        </div>
        <div className="mt-auto space-y-4">
          <div className="flex items-baseline gap-2">
            <div className="h-8 w-32 bg-muted animate-pulse rounded-lg" />
            <div className="h-4 w-16 bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="h-14 w-full bg-muted animate-pulse rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
