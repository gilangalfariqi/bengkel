"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 max-w-sm"
      >
        <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-black text-foreground">Terjadi Kesalahan</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Halaman ini mengalami masalah. Coba muat ulang atau kembali ke beranda.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="btn btn-primary flex items-center gap-2 mx-auto"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Coba Lagi
          </button>
          <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Kembali ke Beranda →
          </a>
        </div>
      </motion.div>
    </div>
  );
}
