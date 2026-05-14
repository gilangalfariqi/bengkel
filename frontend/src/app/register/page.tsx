"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, User } from "lucide-react";

import { register, type RegisterPayload } from "@/services/api/auth";
import { useAuthStore } from "@/stores/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return name.trim().length > 0 && email.trim().length > 0 && password.length >= 8 && password === passwordConfirm && !loading;
  }, [name, email, password, passwordConfirm, loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const payload: RegisterPayload = {
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirm,
      };

      const res = await register(payload);
      if (res.success && res.data) {
        setAuth({ user: res.data.user, token: res.data.access_token });
        router.push("/catalog");
      } else {
        setError(res.message || "Registration failed. Please check your details.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#fafafa]">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558981403-c5f91cbba527?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-[0.03] grayscale pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg"
      >
        <div className="bg-white rounded-[3rem] shadow-premium overflow-hidden border">
          <div className="p-8 md:p-12">
            <div className="text-center space-y-4 mb-10">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-2">
                <User className="h-10 w-10" />
              </div>
              <h1 className="text-4xl font-black tracking-tight uppercase">Join Us.</h1>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
                Create your account to start shopping
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4" htmlFor="name">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-16 pl-14 pr-6 rounded-2xl bg-secondary/50 border-transparent outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-medium"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-16 pl-14 pr-6 rounded-2xl bg-secondary/50 border-transparent outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-medium"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4" htmlFor="password">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-16 pl-14 pr-6 rounded-2xl bg-secondary/50 border-transparent outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-medium"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4" htmlFor="passwordConfirm">
                    Confirm
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <input
                      id="passwordConfirm"
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      className="w-full h-16 pl-14 pr-6 rounded-2xl bg-secondary/50 border-transparent outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-medium"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-primary text-xs font-bold text-center"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full h-16 flex items-center justify-center gap-3 rounded-2xl bg-foreground text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 transition-all hover:bg-primary hover:scale-[1.02] active:scale-95 disabled:opacity-50 group"
              >
                {loading ? "Creating Account..." : "Register Now"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-xs font-medium text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-black uppercase tracking-widest hover:underline ml-1">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
