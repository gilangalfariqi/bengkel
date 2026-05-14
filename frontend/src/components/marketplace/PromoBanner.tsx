"use client";

import { motion } from "framer-motion";
import { Zap, Timer } from "lucide-react";
import Link from "next/link";

export default function PromoBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-[2.5rem] bg-[#0d0d0d] p-8 md:p-12 shadow-2xl"
    >
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-6 max-w-xl">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
              <Zap className="h-3 w-3 fill-white" /> Limited Offer
            </div>
            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
              <Timer className="h-3 w-3" /> Ends in: 05:24:12
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Summer Performance <span className="text-primary">Upgrade.</span>
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              Get up to <span className="text-white font-bold">45% discount</span> on premium exhaust systems and suspension kits. Elevate your ride today.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          <Link
            href="/catalog"
            className="inline-flex h-16 items-center justify-center rounded-full bg-white px-10 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-primary hover:text-white hover:scale-105 active:scale-95 shadow-xl"
          >
            Claim Now
          </Link>
          <Link
            href="/catalog"
            className="inline-flex h-16 items-center justify-center rounded-full border border-white/20 bg-white/5 px-10 text-sm font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/10"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

