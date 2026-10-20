"use client";

import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

interface ArticleCodeEnhancerProps {
  children: React.ReactNode;
}

export function ArticleCodeEnhancer({ children }: ArticleCodeEnhancerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const preElements = containerRef.current.querySelectorAll("pre");

    preElements.forEach((pre) => {
      // Prevent double enhancement
      if (pre.dataset.enhanced === "true") return;
      pre.dataset.enhanced = "true";

      // Detect language from class if available (e.g. class="language-js")
      const codeEl = pre.querySelector("code");
      let lang = "code";
      if (codeEl) {
        const langClass = Array.from(codeEl.classList).find((cls) =>
          cls.startsWith("language-")
        );
        if (langClass) {
          lang = langClass.replace("language-", "");
        }
      }

      // Create Code Header Bar
      const header = document.createElement("div");
      header.className =
        "flex items-center justify-between px-4 py-2 bg-muted/60 border-b border-border text-xs font-mono text-muted-foreground select-none rounded-t-xl";

      // Left: Mac dots + lang
      const leftGroup = document.createElement("div");
      leftGroup.className = "flex items-center gap-2";
      leftGroup.innerHTML = `
        <span class="flex items-center gap-1.5 opacity-70">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
        </span>
        <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 pl-1.5">${lang}</span>
      `;

      // Right: Copy Button
      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className =
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all border border-transparent hover:border-border cursor-pointer";
      copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        <span>Copy</span>
      `;

      copyBtn.addEventListener("click", async () => {
        const textToCopy = codeEl ? codeEl.innerText : pre.innerText;
        try {
          await navigator.clipboard.writeText(textToCopy);
          copyBtn.innerHTML = `
            <svg class="text-emerald-500" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span class="text-emerald-500">Copied!</span>
          `;
          toast.success("Code copied to clipboard!");
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>Copy</span>
            `;
          }, 2500);
        } catch {
          toast.error("Failed to copy code.");
        }
      });

      header.appendChild(leftGroup);
      header.appendChild(copyBtn);

      // Pre style adjustments to hold the header seamlessly
      pre.classList.add("relative", "overflow-hidden", "!p-0", "!rounded-xl", "border", "border-border/80", "shadow-sm");
      if (codeEl) {
        codeEl.classList.add("block", "p-4", "overflow-x-auto");
      }

      pre.insertBefore(header, pre.firstChild);
    });
  }, [children]);

  return <div ref={containerRef}>{children}</div>;
}
