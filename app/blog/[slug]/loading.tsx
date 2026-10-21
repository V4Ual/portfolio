import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ChevronLeft } from "lucide-react";

export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-x-hidden bg-ambient-mesh">
      {/* Site Header */}
      <Navigation />

      {/* Main Article Skeleton */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 w-full space-y-8 animate-pulse">
        {/* Back Link Skeleton */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-4 h-4 bg-muted/60 rounded" />
          <div className="h-4 w-28 bg-muted/60 rounded-md" />
        </div>

        {/* Category & Time */}
        <div className="flex items-center gap-3">
          <div className="h-6 w-24 bg-accent/20 rounded-full" />
          <div className="h-4 w-20 bg-muted/50 rounded-md" />
          <div className="h-4 w-16 bg-muted/50 rounded-md" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-3">
          <div className="h-10 sm:h-14 bg-muted/80 rounded-2xl w-11/12" />
          <div className="h-10 sm:h-14 bg-muted/80 rounded-2xl w-3/4" />
        </div>

        {/* Author / Date / Share Row */}
        <div className="flex items-center justify-between py-4 border-y border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted/70" />
            <div className="space-y-1.5">
              <div className="h-4 w-28 bg-muted/70 rounded-md" />
              <div className="h-3 w-20 bg-muted/40 rounded-md" />
            </div>
          </div>
          <div className="h-9 w-24 bg-muted/50 rounded-xl" />
        </div>

        {/* Cover Image Skeleton */}
        <div className="w-full h-64 sm:h-96 bg-card/60 border border-border/60 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>

        {/* Article Text Paragraph Skeletons */}
        <div className="space-y-4 pt-4">
          <div className="h-5 bg-muted/60 rounded-md w-full" />
          <div className="h-5 bg-muted/60 rounded-md w-11/12" />
          <div className="h-5 bg-muted/60 rounded-md w-4/5" />
          <div className="h-5 bg-muted/50 rounded-md w-full" />
        </div>

        {/* Code Block Skeleton */}
        <div className="h-44 bg-card/70 border border-border/60 rounded-2xl p-5 space-y-2">
          <div className="h-4 w-32 bg-muted/60 rounded-md mb-4" />
          <div className="h-3 bg-muted/40 rounded-md w-3/4" />
          <div className="h-3 bg-muted/40 rounded-md w-1/2" />
          <div className="h-3 bg-muted/40 rounded-md w-5/6" />
        </div>

        {/* Further Text Skeleton */}
        <div className="space-y-4">
          <div className="h-5 bg-muted/60 rounded-md w-full" />
          <div className="h-5 bg-muted/60 rounded-md w-5/6" />
          <div className="h-5 bg-muted/50 rounded-md w-3/4" />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
