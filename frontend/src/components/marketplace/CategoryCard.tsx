"use client";

import { motion } from "framer-motion";
import { type LucideIcon, ArrowUpRight } from "lucide-react";
import Link from "next/link";


export default function CategoryCard({
  title,
  href,
  icon: Icon,
}: {
  title: string;
  href: string;
  icon: LucideIcon;
  categoryKey?: string;
}) {
  return (
    <Link href={href} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[2.5rem] border border-white/20 dark:border-white/5 bg-card/40 backdrop-blur-md p-8 shadow-premium transition-all duration-500 hover:shadow-glow hover:-translate-y-2"
      >
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all duration-700 group-hover:scale-150" />
        
        <div className="relative flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-secondary/50 backdrop-blur-md text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-3 shadow-sm">
              <Icon className="h-8 w-8" />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full glass opacity-0 -translate-y-2 translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:bg-primary/10 group-hover:text-primary">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-black tracking-tighter leading-none">{title}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] group-hover:text-primary transition-colors">
                Explore Dept.
              </span>
              <div className="h-[1px] w-0 bg-primary group-hover:w-8 transition-all duration-500" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

