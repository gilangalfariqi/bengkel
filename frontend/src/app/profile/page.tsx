"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, Save, Loader2, LogOut, Eye, EyeOff, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { useAuthStore } from "@/presentation/stores/authStore";
import type { AuthUser } from "@/domain/entities/auth";
import { http } from "@/data/api/httpClient";
import { cn } from "@/lib/utils";

type Tab = "info" | "security";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isHydrated, clearAuth, setAuth, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("info");

  // Profile form
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saving, setSaving] = useState(false);

  // Password form
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    if (isHydrated && !user) router.push("/login");
  }, [user, isHydrated, router]);

  useEffect(() => {
    if (user) { setName(user.name); setPhone(user.phone ?? ""); }
  }, [user]);

  if (!isHydrated || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await http.put("/api/auth/profile", { name, phone });
      if (res.success) {
        if (token && res.data) setAuth({ user: res.data as AuthUser, token });
        toast.success("Profil berhasil diperbarui");
      } else {
        toast.error(res.message ?? "Gagal memperbarui profil");
      }
    } catch {
      toast.error("Terjadi kesalahan koneksi");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }
    if (newPw.length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }
    setChangingPw(true);
    try {
      const res = await http.put("/api/auth/change-password", {
        current_password: currentPw,
        password: newPw,
        password_confirmation: confirmPw,
      });
      if (res.success) {
        toast.success("Password berhasil diubah");
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
      } else {
        const errText = res.errors
          ? Object.values(res.errors).flat().join(", ")
          : res.message;
        toast.error(errText ?? "Gagal mengubah password");
      }
    } catch {
      toast.error("Terjadi kesalahan koneksi");
    } finally {
      setChangingPw(false);
    }
  }

  function handleLogout() {
    clearAuth();
    toast("Berhasil keluar", { duration: 2000 });
    router.push("/login");
  }

  const TABS: { id: Tab; label: string; Icon: typeof User }[] = [
    { id: "info",     label: "Info Pribadi", Icon: User },
    { id: "security", label: "Keamanan",     Icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-12 text-foreground">
      <div className="container mx-auto px-4 py-6 max-w-2xl">

        {/* ── User header card ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5 flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-black text-foreground">{user.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{user.email}</div>
              <div className="mt-1">
                <span className={cn("badge", user.role === "admin" ? "badge-red" : "badge-green")}>
                  {user.role === "admin" ? "Admin" : "Pelanggan"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/8 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>
        </motion.div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link
            href="/catalog"
            className="card p-4 flex items-center justify-between hover:border-primary/30 transition-all group"
          >
            <div>
              <div className="text-xs font-black text-foreground">Katalog</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Jelajahi produk</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <Link
            href="/wishlist"
            className="card p-4 flex items-center justify-between hover:border-primary/30 transition-all group"
          >
            <div>
              <div className="text-xs font-black text-foreground">Wishlist</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Produk tersimpan</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>

        {/* ── Tabs ─────────────────────────────────────────── */}
        <div className="card overflow-hidden">
          {/* Tab headers */}
          <div className="flex border-b border-border/60">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all relative cursor-pointer",
                  activeTab === id ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {activeTab === id && (
                  <motion.span
                    layoutId="profile-tab-indicator"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-5"
            >
              {activeTab === "info" ? (
                <form onSubmit={handleSaveProfile} className="space-y-4" noValidate>
                  {/* Email (readonly) */}
                  <div>
                    <label htmlFor="profile-email" className="field-label">Alamat Email</label>
                    <input
                      id="profile-email"
                      type="email"
                      value={user.email}
                      disabled
                      className="field-input opacity-50 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-muted-foreground/60 mt-1 font-medium">
                      Email tidak dapat diubah
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label htmlFor="profile-name" className="field-label">Nama Lengkap</label>
                    <input
                      id="profile-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="field-input"
                      placeholder="Nama lengkap Anda"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="profile-phone" className="field-label">
                      No. HP / WhatsApp
                    </label>
                    <input
                      id="profile-phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="field-input"
                      placeholder="081234567890"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={saving || !name.trim()}
                    whileTap={{ scale: 0.97 }}
                    className="flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-primary text-[11px] font-black uppercase tracking-widest text-white shadow-glow hover:shadow-[0_0_24px_rgba(225,29,72,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Simpan Perubahan
                  </motion.button>
                </form>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4" noValidate>
                  {/* Current pw */}
                  <div>
                    <label htmlFor="cur-pw" className="field-label">Password Saat Ini</label>
                    <div className="relative">
                      <input
                        id="cur-pw"
                        type={showPw ? "text" : "password"}
                        autoComplete="current-password"
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        className="field-input pr-12"
                        placeholder="Password lama"
                        required
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New pw */}
                  <div>
                    <label htmlFor="new-pw" className="field-label">Password Baru</label>
                    <input
                      id="new-pw"
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      className="field-input"
                      placeholder="Min. 8 karakter"
                      required
                      minLength={8}
                    />
                  </div>

                  {/* Confirm pw */}
                  <div>
                    <label htmlFor="confirm-pw" className="field-label">Konfirmasi Password Baru</label>
                    <input
                      id="confirm-pw"
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      className={cn(
                        "field-input",
                        confirmPw.length > 0 && confirmPw !== newPw && "border-red-500/50",
                        confirmPw.length > 0 && confirmPw === newPw && "border-emerald-500/50",
                      )}
                      placeholder="Ulangi password baru"
                      required
                      minLength={8}
                    />
                    {confirmPw.length > 0 && confirmPw !== newPw && (
                      <p className="field-error">Password tidak cocok</p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={changingPw || !currentPw || !newPw || !confirmPw}
                    whileTap={{ scale: 0.97 }}
                    className="flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-secondary border border-border text-[11px] font-black uppercase tracking-widest text-foreground hover:border-primary/30 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {changingPw ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    Ubah Password
                  </motion.button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
