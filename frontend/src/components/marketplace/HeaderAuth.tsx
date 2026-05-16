"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, LogOut, Package, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export default function HeaderAuth() {
  const { user, isHydrated, clearAuth } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isHydrated) return null; // Avoid hydration mismatch

  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden sm:flex h-9 items-center justify-center rounded-xl bg-primary px-5 text-xs font-bold text-white hover:bg-primary/90 shadow-glow"
      >
        Login
      </Link>
    );
  }

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <div className="relative hidden sm:block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-9 px-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-3 py-2 mb-2 border-b border-gray-50">
            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
          >
            <User className="w-4 h-4" />
            Pengaturan Profil
          </Link>
          
          <Link
            href="/orders"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
          >
            <Package className="w-4 h-4" />
            Riwayat Pesanan
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
