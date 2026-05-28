"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, LogOut, Package, ChevronDown, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/presentation/stores/authStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function HeaderAuth() {
  const { user, isHydrated, clearAuth } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (!isHydrated) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden sm:flex h-8 items-center justify-center rounded-xl bg-primary px-4 text-[10px] font-black uppercase tracking-widest text-white shadow-glow-sm hover:shadow-glow transition-all"
      >
        Masuk
      </Link>
    );
  }

  function handleLogout() {
    clearAuth();
    setIsOpen(false);
    toast("Berhasil keluar");
    router.push("/login");
  }

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <div className="relative hidden sm:block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-8 px-2.5 rounded-xl border border-border bg-card hover:border-border-strong transition-all"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="h-5 w-5 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
          <span className="text-[8px] font-black text-primary">{initial}</span>
        </div>
        <span className="text-[11px] font-bold text-foreground max-w-[80px] truncate hidden md:block">
          {user?.name ? user.name.split(" ")[0] : ""}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 w-52 glass rounded-2xl shadow-modal border border-border z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border/60">
              <p className="text-xs font-black text-foreground truncate">{user?.name || ""}</p>
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">{user?.email || ""}</p>
            </div>

            <div className="p-1.5">
              {[
                { href: "/profile", label: "Pengaturan Profil", Icon: Settings },
                { href: "/orders",  label: "Riwayat Pesanan",   Icon: Package },
              ].map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              ))}

              <div className="border-t border-border/50 mt-1.5 pt-1.5">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[11px] font-bold text-red-400 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Keluar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
