"use client";

import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Wrench,
  Car,
  Zap,
  CircleDot,
  Settings2,
} from "lucide-react";

export interface CategoryItem {
  id: number | null;
  name: string;
  icon: React.ElementType;
}

export const CATEGORY_LIST: CategoryItem[] = [
  { id: null,  name: "Semua",    icon: LayoutGrid },
  { id: 1,     name: "Mesin",    icon: Wrench     },
  { id: 2,     name: "Body Part",icon: Car        },
  { id: 3,     name: "Kelistrikan", icon: Zap     },
  { id: 4,     name: "Ban & Velg",  icon: CircleDot },
  { id: 5,     name: "Aksesoris",   icon: Settings2 },
];

interface CategoryScrollProps {
  selected: number | null;
  onChange: (id: number | null) => void;
  className?: string;
}

export default function CategoryScroll({
  selected,
  onChange,
  className,
}: CategoryScrollProps) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto no-scrollbar px-4 py-2",
        className
      )}
    >
      {CATEGORY_LIST.map((cat) => {
        const isActive = selected === cat.id;
        const Icon = cat.icon;

        return (
          <button
            key={cat.name}
            type="button"
            onClick={() => onChange(cat.id)}
            className={cn(
              "flex items-center gap-1.5 shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border",
              isActive
                ? "bg-primary text-white border-primary shadow-glow"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary/40 hover:text-primary"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
