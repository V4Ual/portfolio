"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setCompletion(
          Number((currentProgress / scrollHeight).toFixed(3)) * 100
        );
      }
    };

    window.addEventListener("scroll", updateScrollCompletion);
    return () => window.removeEventListener("scroll", updateScrollCompletion);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] bg-transparent z-50 pointer-events-none"
      role="progressbar"
      aria-valuenow={completion}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-accent via-cyan-400 to-primary transition-all duration-150 ease-out shadow-xs shadow-accent/50"
        style={{ width: `${completion}%` }}
      />
    </div>
  );
}
