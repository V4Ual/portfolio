export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        {/* Animated glowing loader */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-accent/20 blur-xl animate-pulse" />
          <div className="w-12 h-12 rounded-2xl border-2 border-accent border-t-transparent animate-spin" />
          <div className="absolute w-6 h-6 rounded-lg bg-accent/20 animate-ping" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-bold tracking-tight text-foreground">
            Vishal Sharma
          </p>
          <p className="text-xs text-muted-foreground animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}
