"use client";

import { useEffect, useState, useMemo } from "react";
import { AlignLeft, ChevronDown, ChevronUp } from "lucide-react";
import { slugify } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  content: string;
  mobileOnly?: boolean;
  className?: string;
}

export function TableOfContents({
  content,
  mobileOnly = false,
  className = "",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  // Parse H2 and H3 headings from HTML content
  const tocItems = useMemo<TocItem[]>(() => {
    if (!content) return [];

    const items: TocItem[] = [];
    const regex = /<(h[23])([^>]*)>(.*?)<\/\1>/gi;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      const tag = match[1].toLowerCase();
      const attrs = match[2];
      const rawText = match[3];

      // Extract existing id if present, else generate from plain text
      let id = "";
      const idMatch = attrs.match(/id=["']([^"']+)["']/i);
      if (idMatch && idMatch[1]) {
        id = idMatch[1];
      } else {
        const plainText = rawText.replace(/<[^>]+>/g, "").trim();
        id = slugify(plainText);
      }

      const text = rawText.replace(/<[^>]+>/g, "").trim();
      if (text && id) {
        items.push({
          id,
          text,
          level: tag === "h2" ? 2 : 3,
        });
      }
    }

    return items;
  }, [content]);

  // Track active heading via IntersectionObserver
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0% -65% 0%",
        threshold: 0,
      }
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  if (tocItems.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // offset for sticky navigation header
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      if (mobileOnly) setIsOpenMobile(false);
    }
  };

  // Mobile Accordion View
  if (mobileOnly) {
    return (
      <div className={`lg:hidden rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md p-4 shadow-sm mb-6 ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-foreground select-none cursor-pointer"
        >
          <div className="flex items-center gap-2 text-accent">
            <AlignLeft className="w-4 h-4" />
            <span>Table of Contents ({tocItems.length})</span>
          </div>
          {isOpenMobile ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {isOpenMobile && (
          <nav className="mt-3 pt-3 border-t border-border/60 space-y-2 text-xs">
            {tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`block transition-all ${
                  item.level === 3 ? "pl-4 text-[11px]" : "font-medium"
                } ${
                  activeId === item.id
                    ? "text-accent font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        )}
      </div>
    );
  }

  // Desktop Sticky Sidebar View
  return (
    <aside className={`w-64 shrink-0 hidden lg:block sticky top-28 self-start ${className}`}>
      <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-5 space-y-3.5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <AlignLeft className="w-4 h-4 text-accent" />
          <span>Table of Contents</span>
        </div>

        <nav className="space-y-1.5 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
          {tocItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`group flex items-center gap-2 rounded-lg py-1.5 px-2 text-xs transition-all leading-snug cursor-pointer ${
                  item.level === 3 ? "pl-5 text-[11px]" : "font-semibold"
                } ${
                  isActive
                    ? "text-accent bg-accent/10 font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
                    isActive ? "bg-accent scale-125" : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
                  }`}
                />
                <span className="line-clamp-2">{item.text}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
