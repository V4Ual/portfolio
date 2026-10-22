"use client";

import { useEffect, useState, useMemo } from "react";
import { AlignLeft, ChevronDown, ChevronUp, List, X } from "lucide-react";
import { slugify } from "@/lib/utils";

export interface TocItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

export interface TableOfContentsProps {
  content: string;
  mobileOnly?: boolean;
  inline?: boolean;
  className?: string;
  onItemClick?: (id: string, text: string) => void;
}

export function TableOfContents({
  content,
  mobileOnly = false,
  inline = false,
  className = "",
  onItemClick,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [showMobileFloating, setShowMobileFloating] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Monitor scroll on mobile for sticky floating pill
  useEffect(() => {
    if (!mobileOnly) return;
    const handleScroll = () => {
      setShowMobileFloating(window.scrollY > 240);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOnly]);

  // Parse H1, H2, and H3 headings from HTML content
  const tocItems = useMemo<TocItem[]>(() => {
    if (!content) return [];

    const items: TocItem[] = [];
    const regex = /<(h[123])([^>]*)>(.*?)<\/\1>/gi;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      const tag = match[1].toLowerCase();
      const attrs = match[2];
      const rawText = match[3];

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
          level: tag === "h1" ? 1 : tag === "h2" ? 2 : 3,
        });
      }
    }

    return items;
  }, [content]);

  // Track active heading via IntersectionObserver
  useEffect(() => {
    if (tocItems.length === 0 || inline) return;

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
  }, [tocItems, inline]);

  if (tocItems.length === 0) {
    if (inline) {
      return (
        <div className="text-center py-4 text-xs text-muted-foreground italic select-none">
          No headings found yet. Use H1, H2, or H3 headings in your text to populate the table of contents.
        </div>
      );
    }
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: TocItem) => {
    e.preventDefault();
    if (onItemClick) {
      onItemClick(item.id, item.text);
      setActiveId(item.id);
      return;
    }
    const el = document.getElementById(item.id);
    if (el) {
      const yOffset = -90; // offset for sticky navigation header
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(item.id);
      if (mobileOnly) {
        setIsOpenMobile(false);
        setIsMobileDrawerOpen(false);
      }
    }
  };

  // Inline List View (e.g. for editor sidebars or summary cards)
  if (inline) {
    return (
      <div className={`space-y-1 text-xs max-h-72 overflow-y-auto pr-1 custom-editor-scrollbar ${className}`}>
        {tocItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item)}
              className={`flex items-center gap-2 rounded-lg py-1.5 px-2.5 text-xs transition-all leading-snug cursor-pointer group ${
                item.level === 3
                  ? "pl-6 text-[11px]"
                  : item.level === 2
                  ? "pl-3 font-medium"
                  : "font-bold text-foreground"
              } ${
                isActive
                  ? "text-accent bg-accent/15 font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 transition-transform ${
                  isActive
                    ? "bg-accent scale-125 shadow-xs"
                    : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
                }`}
              />
              <span className="line-clamp-1">{item.text}</span>
            </a>
          );
        })}
      </div>
    );
  }

  // Mobile Accordion View with Sticky Floating Button & Quick Drawer
  if (mobileOnly) {
    return (
      <>
        {/* Top In-Content Accordion */}
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
            {isOpenMobile ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {isOpenMobile && (
            <nav className="mt-3 pt-3 border-t border-border/60 space-y-2 text-xs">
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item)}
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

        {/* Sticky Mobile Floating Navigation Pill */}
        {showMobileFloating && (
          <div className="fixed bottom-6 right-5 z-40 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card/90 text-foreground border border-accent/40 shadow-xl backdrop-blur-xl text-xs font-bold hover:bg-accent hover:text-accent-foreground active:scale-95 transition-all select-none"
            >
              <List className="w-4 h-4 text-accent" />
              <span>Outline</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/20 text-accent font-mono">
                {tocItems.length}
              </span>
            </button>
          </div>
        )}

        {/* Sticky Mobile Quick Drawer Modal */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-background/80 backdrop-blur-sm flex flex-col justify-end">
            <div className="bg-card border-t border-border/80 rounded-t-3xl p-5 max-h-[75vh] flex flex-col shadow-2xl space-y-3 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                  <AlignLeft className="w-4 h-4 text-accent" />
                  <span>Table of Contents</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="overflow-y-auto space-y-1.5 py-2 pr-1 custom-editor-scrollbar">
                {tocItems.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => handleClick(e, item)}
                      className={`block rounded-lg px-3 py-2 text-xs transition-colors ${
                        item.level === 3 ? "pl-6 text-[11px]" : "font-medium"
                      } ${
                        isActive
                          ? "text-accent bg-accent/15 font-bold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {item.text}
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop Sticky Sidebar View
  return (
    <aside className={`w-64 shrink-0 hidden lg:block sticky top-28 z-20 self-start ${className}`}>
      <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-5 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <AlignLeft className="w-4 h-4 text-accent" />
            <span>Table of Contents</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/15 text-accent font-semibold border border-accent/20">
            {tocItems.length}
          </span>
        </div>

        <nav className="space-y-1.5 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1 custom-editor-scrollbar">
          {tocItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item)}
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
                    isActive
                      ? "bg-accent scale-125"
                      : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
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
