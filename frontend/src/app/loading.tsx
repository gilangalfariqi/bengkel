export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        {/* Logo spinner */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-xl bg-primary/20 animate-pulse" />
          <div className="absolute inset-0 rounded-xl border-2 border-primary/30 animate-spin-slow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-black italic text-primary">BP</span>
          </div>
        </div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
          Memuat...
        </div>
      </div>
    </div>
  );
}
