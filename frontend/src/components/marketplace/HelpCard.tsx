"use client";

import { Headphones, Phone } from "lucide-react";

interface HelpCardProps {
  className?: string;
}

export default function HelpCard({ className }: HelpCardProps) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3 ${className ?? ""}`}
    >
      {/* Icon */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-rose-100">
        <Headphones className="h-5 w-5 text-primary" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 leading-tight">
          Butuh bantuan?
        </p>
        <p className="text-xs text-gray-500 mt-0.5 leading-tight">
          Spesialis kami siap membantu Anda menemukan part yang tepat.
        </p>
      </div>

      {/* CTA */}
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-white shadow-glow hover:bg-primary/90 transition-colors"
      >
        <Phone className="h-3 w-3" />
        Kontak
      </a>
    </div>
  );
}
