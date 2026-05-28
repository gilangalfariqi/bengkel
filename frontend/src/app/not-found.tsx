import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6 max-w-md">
        {/* 404 display */}
        <div className="relative">
          <div className="text-[8rem] font-black text-foreground/5 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-2xl font-black italic text-primary">BP</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-black text-foreground">Halaman Tidak Ditemukan</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Kembali ke Beranda
          </Link>
          <Link href="/catalog" className="btn btn-ghost">
            Lihat Katalog
          </Link>
        </div>
      </div>
    </div>
  );
}
