"use client";

import React, { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function PageProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or searchParams change, mark loading complete
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept click on internal links to start progress immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      // Only handle internal links without new tabs or hash-only links
      if (
        !href ||
        targetAttr === "_blank" ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        (href.startsWith("http") && !href.startsWith(window.location.origin))
      ) {
        return;
      }

      // Check if navigating to a different page/path
      const url = new URL(target.href, window.location.href);
      const isCurrentPage =
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash !== "";

      if (isCurrentPage) {
        // Just a hash jump on the same page, do not trigger full page loader
        return;
      }

      // If navigating to different path, trigger loader
      if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
        setLoading(true);
        setProgress(20);
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  // Animate progress incrementally while loading
  useEffect(() => {
    if (!loading) return;

    const step1 = setTimeout(() => setProgress((prev) => (prev < 40 ? 40 : prev)), 100);
    const step2 = setTimeout(() => setProgress((prev) => (prev < 65 ? 65 : prev)), 300);
    const step3 = setTimeout(() => setProgress((prev) => (prev < 85 ? 85 : prev)), 700);
    const step4 = setTimeout(() => setProgress((prev) => (prev < 92 ? 92 : prev)), 1500);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(step4);
    };
  }, [loading]);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none select-none transition-opacity duration-300"
      style={{ opacity: loading ? 1 : 0 }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label="Page loading progress"
    >
      {/* Top progress bar with glowing tip */}
      <div
        className="h-[3px] bg-gradient-to-r from-accent via-primary to-accent transition-all duration-200 ease-out shadow-[0_0_12px_rgba(var(--accent-rgb,59,130,246),0.8)]"
        style={{
          width: `${progress}%`,
        }}
      >
        {/* Glowing leading light */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-white/60 blur-xs" />
      </div>

      {/* Floating mini indicator badge */}
      <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/90 border border-accent/40 shadow-xl backdrop-blur-md text-xs font-semibold text-foreground animate-in fade-in slide-in-from-top-2 duration-200">
        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
        <span>Loading...</span>
      </div>
    </div>
  );
}
