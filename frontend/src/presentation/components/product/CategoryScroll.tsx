"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: null,  label: "Semua" },
  { id: 1,     label: "Mesin" },
  { id: 2,     label: "Body Part" },
  { id: 3,     label: "Kelistrikan" },
  { id: 4,     label: "Ban & Velg" },
  { id: 5,     label: "Aksesoris" },
  { id: 6,     label: "Oli & Cairan" },
];

interface CategoryScrollProps {
  selected: number | null;
  onChange: (id: number | null) => void;
}

export default function CategoryScroll({ selected, onChange }: CategoryScrollProps) {
  const router = useRouter();
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll selected chip into view
  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-2">
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.id;
          return (
            <button
              key={cat.id ?? "all"}
              ref={isActive ? activeRef : undefined}
              type="button"
              onClick={() => onChange(cat.id)}
              className={cn(
                "shrink-0 inline-flex items-center h-8 px-4 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap border transition-all duration-200 tap-highlight-none cursor-pointer",
                isActive
                  ? "bg-primary text-white border-primary shadow-glow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-border-strong hover:text-foreground",
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
