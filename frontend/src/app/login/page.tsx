"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

import { login, type LoginPayload } from "@/services/api/auth";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && !loading;
  }, [email, password, loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const payload: LoginPayload = {
        email: email.trim(),
        password,
      };

      const res = await login(payload);
      if (res.success && res.data) {
        setAuth({ user: res.data.user, token: res.data.access_token });
        router.push("/catalog");
      } else {
        setError(res.message || "Invalid credentials. Please try again.");
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
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h1 className="text-4xl font-black tracking-tight uppercase">Welcome Back.</h1>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
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

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="password">
                    Password
                  </label>
                  <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                    Forgot?
                  </Link>
                </div>
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
                {loading ? "Verifying..." : "Sign In"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="mt-10 text-center space-y-4">
              <p className="text-xs font-medium text-muted-foreground">
Don&apos;t have an account?
                <Link href="/register" className="text-primary font-black uppercase tracking-widest hover:underline ml-1">
                  Create Account
                </Link>
              </p>
              
              <div className="pt-4 border-t border-dashed">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Administrator?{" "}
                  <a 
                    href={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/admin`} 
                    className="text-foreground hover:text-primary transition-colors ml-1"
                  >
                    Go to Admin Panel
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
