"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowRight, Mail, Lock, User, Phone } from "lucide-react";

import { register } from "@/data/api/authApi";
import { useAuthStore } from "@/presentation/stores/authStore";
import { toast } from "sonner";

type FormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState<FormState>({
    name: "", email: "", phone: "", password: "", passwordConfirm: "",
  });
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

  const setField = (key: keyof FormState, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const canSubmit =
    form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.password.length >= 8 &&
    form.password === form.passwordConfirm &&
    !loading;

  const passMatch = form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;
  const passMismatch = form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      const res = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        password_confirmation: form.passwordConfirm,
      });

      if (res.success && res.data) {
        setAuth({ user: res.data.user, token: res.data.access_token });
        toast.success("Akun berhasil dibuat!");
        router.push(redirectTo);
      } else {
        setError(res.message || "Pendaftaran gagal. Periksa kembali data Anda.");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
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
            <h1 className="text-2xl font-black text-foreground tracking-tight">Buat Akun Baru</h1>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Bergabung dengan BengkelPro — gratis
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="field-label">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input id="reg-name" type="text" autoComplete="name" value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className="field-input pl-10" placeholder="Nama lengkap Anda" required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="field-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input id="reg-email" type="email" autoComplete="email" value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className="field-input pl-10" placeholder="nama@email.com" required />
              </div>
            </div>

            {/* Phone (optional) */}
            <div>
              <label htmlFor="reg-phone" className="field-label">
                No. HP <span className="text-muted-foreground/50">(opsional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input id="reg-phone" type="tel" autoComplete="tel" inputMode="tel" value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className="field-input pl-10" placeholder="08xxxxxxxxxx" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="field-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input id="reg-password" type={showPass ? "text" : "password"}
                  autoComplete="new-password" value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  className="field-input pl-10 pr-12" placeholder="Min. 8 karakter" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.password.length > 0 && form.password.length < 8 && (
                <p className="field-error">Password minimal 8 karakter</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="field-label">Konfirmasi Password</label>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none transition-colors ${passMatch ? "text-emerald-400" : passMismatch ? "text-red-400" : "text-muted-foreground"}`} />
                <input id="reg-confirm" type={showPass ? "text" : "password"}
                  autoComplete="new-password" value={form.passwordConfirm}
                  onChange={(e) => setField("passwordConfirm", e.target.value)}
                  className={`field-input pl-10 ${passMismatch ? "border-red-500/50" : passMatch ? "border-emerald-500/50" : ""}`}
                  placeholder="Ulangi password" required />
              </div>
              {passMismatch && <p className="field-error">Password tidak cocok</p>}
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
                <><Loader2 className="h-4 w-4 animate-spin" />Membuat akun...</>
              ) : (
                <>Daftar Sekarang <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary font-bold hover:text-primary/80 transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
