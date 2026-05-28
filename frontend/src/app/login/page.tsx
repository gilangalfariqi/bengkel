"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowRight, Mail, Lock } from "lucide-react";

import { login } from "@/data/api/authApi";
import { useAuthStore } from "@/presentation/stores/authStore";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState("/catalog");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const red = params.get("redirect");
    if (red) {
      setRedirectTo(red);
    }
  }, []);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      const res = await login({ email: email.trim(), password });
      if (res.success && res.data) {
        setAuth({ user: res.data.user, token: res.data.access_token });
        toast.success("Berhasil masuk!");
        router.push(redirectTo);
      } else {
        setError(res.message || "Email atau password salah.");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div aria-hidden className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="card p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-5 hover:bg-primary hover:text-white transition-all">
              <span className="text-lg font-black italic">BP</span>
            </Link>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Selamat Datang Kembali</h1>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Masuk ke akun BengkelPro Anda
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="field-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field-input pl-10"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="field-label mb-0">Password</label>
                <Link href="#" className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors">
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field-input pl-10 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-xs text-red-400 font-semibold"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={!canSubmit}
              whileTap={{ scale: canSubmit ? 0.97 : 1 }}
              className="group w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-[11px] font-black uppercase tracking-widest text-white shadow-glow hover:shadow-[0_0_24px_rgba(225,29,72,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Memproses...</>
              ) : (
                <>Masuk <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-xs text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="text-primary font-bold hover:text-primary/80 transition-colors">
                Daftar sekarang
              </Link>
            </p>
            <div className="border-t border-border/50 pt-3">
              <a
                href={`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/admin`}
                className="text-[10px] font-bold text-muted-foreground/60 hover:text-muted-foreground uppercase tracking-widest transition-colors"
              >
                Admin Panel →
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
