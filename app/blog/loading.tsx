import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Sparkles } from "lucide-react";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-x-hidden bg-ambient-mesh">
      {/* Site Header */}
      <Navigation />

      {/* Main Skeleton Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 w-full space-y-10 sm:space-y-12">
        {/* Hero Header Skeleton */}
        <header className="space-y-4 text-center sm:text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-spin" style={{ animationDuration: "3s" }} />
            <span>Loading Articles...</span>
          </div>

          <div className="h-10 sm:h-12 bg-muted/60 rounded-xl w-3/4 max-w-md animate-pulse" />
          <div className="h-5 bg-muted/40 rounded-lg w-full max-w-xl animate-pulse" />
        </header>

        {/* Filter and Search Bar Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
          <div className="h-11 bg-card/60 rounded-xl w-full sm:w-80 border border-border/50 animate-pulse" />
          <div className="flex gap-2 w-full sm:w-auto overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-20 bg-muted/50 rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* 6-Card Grid Skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden flex flex-col justify-between p-5 space-y-4 animate-pulse shadow-xs"
            >
              {/* Card Image Skeleton */}
              <div className="h-44 bg-muted/60 rounded-xl w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
              </div>

              {/* Tag & Reading Time */}
              <div className="flex justify-between items-center">
                <div className="h-5 w-20 bg-accent/20 rounded-md" />
                <div className="h-4 w-16 bg-muted/50 rounded-md" />
              </div>

              {/* Title & Excerpt */}
              <div className="space-y-2">
                <div className="h-5 bg-muted/70 rounded-md w-11/12" />
                <div className="h-5 bg-muted/70 rounded-md w-3/4" />
                <div className="h-4 bg-muted/40 rounded-md w-full pt-1" />
                <div className="h-4 bg-muted/40 rounded-md w-4/5" />
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-border/40 flex justify-between items-center">
                <div className="h-4 w-24 bg-muted/50 rounded-md" />
                <div className="h-4 w-16 bg-accent/30 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
