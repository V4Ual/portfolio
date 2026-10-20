"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  ArrowRight,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";

export interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  readTime: string;
  views: number;
  coverImage?: string | null;
  publishedAt: Date | string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags?: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface BlogShowcaseProps {
  posts: PostItem[];
  categories: CategoryItem[];
}

type SortOption = "latest" | "popular" | "oldest";

const POSTS_PER_PAGE = 6;

export function BlogShowcase({ posts, categories }: BlogShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 1. Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Category match
      if (selectedCategory !== "all" && post.category?.slug !== selectedCategory) {
        return false;
      }

      // Search query match
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesExcerpt = post.excerpt.toLowerCase().includes(query);
        const matchesCategory = post.category?.name.toLowerCase().includes(query);
        const matchesTags = post.tags?.some((t) =>
          t.tag.name.toLowerCase().includes(query)
        );
        return matchesTitle || matchesExcerpt || matchesCategory || matchesTags;
      }

      return true;
    });
  }, [posts, selectedCategory, searchQuery]);

  // 2. Sort filtered posts
  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      if (sortBy === "popular") {
        return (b.views || 0) - (a.views || 0);
      }
      if (sortBy === "oldest") {
        const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return timeA - timeB;
      }
      // default: latest
      const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [filteredPosts, sortBy]);

  // 3. Pagination calculations
  const totalItems = sortedPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / POSTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * POSTS_PER_PAGE;
  const endIndex = Math.min(startIndex + POSTS_PER_PAGE, totalItems);
  const currentPosts = useMemo(() => {
    return sortedPosts.slice(startIndex, endIndex);
  }, [sortedPosts, startIndex, endIndex]);

  // Scroll to blog section smoothly on page change
  const scrollToBlogTop = () => {
    const el = document.getElementById("blog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === safeCurrentPage) return;
    setCurrentPage(page);
    scrollToBlogTop();
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
    setCurrentPage(1);
  };

  // Generate numbered pagination pills with smart ellipsis
  const paginationRange = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (safeCurrentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (safeCurrentPage >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      "...",
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      "...",
      totalPages,
    ];
  }, [totalPages, safeCurrentPage]);

  return (
    <div className="space-y-8">
      {/* Top Search, Sort & Category Controls */}
      <div className="space-y-4">
        {/* Row 1: Search Bar and Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by title, topic, or keyword..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border/80 bg-card/70 backdrop-blur-md text-foreground placeholder:text-muted-foreground text-xs sm:text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-xs text-muted-foreground hidden xs:inline font-medium">
              Sort by:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={handleSortChange}
                aria-label="Sort articles"
                className="appearance-none pl-8 pr-8 py-2 rounded-xl border border-border/80 bg-card/80 text-foreground text-xs font-semibold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer transition-all shadow-xs"
              >
                <option value="latest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="oldest">Oldest First</option>
              </select>
              <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-accent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2: Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategorySelect("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
              selectedCategory === "all"
                ? "bg-accent text-accent-foreground border-accent shadow-xs shadow-accent/20"
                : "bg-card/60 text-muted-foreground border-border/80 hover:text-foreground hover:border-border hover:bg-card"
            }`}
          >
            All Articles ({posts.length})
          </button>

          {categories.map((cat) => {
            const count = posts.filter((p) => p.category?.id === cat.id).length;
            if (count === 0) return null;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                  isSelected
                    ? "bg-accent text-accent-foreground border-accent shadow-xs shadow-accent/20"
                    : "bg-card/60 text-muted-foreground border-border/80 hover:text-foreground hover:border-border hover:bg-card"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Range Indicator */}
      <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/40 gap-2">
        <span>
          Showing{" "}
          <strong className="text-foreground">
            {totalItems === 0 ? 0 : startIndex + 1}–{endIndex}
          </strong>{" "}
          of <strong className="text-foreground">{totalItems}</strong> article
          {totalItems === 1 ? "" : "s"}
          {selectedCategory !== "all" &&
            ` in "${categories.find((c) => c.slug === selectedCategory)?.name}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>

        {(searchQuery || selectedCategory !== "all" || sortBy !== "latest") && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              setSortBy("latest");
              setCurrentPage(1);
            }}
            className="text-accent hover:underline font-medium text-xs"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Articles Grid */}
      {currentPosts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-border/80 bg-card/60 hover:bg-card hover:border-accent/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1"
            >
              <div>
                {/* Cover Image or Vibrant Tech Gradient Header */}
                <div className="aspect-[16/9] w-full overflow-hidden bg-muted/40 relative">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-accent/20 via-primary/10 to-transparent flex items-center justify-center p-6 text-center">
                      <span className="text-accent/60 font-mono text-xs tracking-wider uppercase font-semibold">
                        {post.category?.name || "Architecture & Code"}
                      </span>
                    </div>
                  )}
                  {post.category && (
                    <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md text-accent border border-accent/20 shadow-xs">
                      {post.category.name}
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  {/* Meta stats */}
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-accent" />
                      {post.readTime}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views} reads
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-foreground text-base sm:text-lg leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recent"}
                </span>
                <span className="font-semibold text-accent group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty Results State */
        <div className="py-16 text-center space-y-3 rounded-2xl border border-dashed border-border/80 bg-card/40 p-8">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-foreground text-base">No articles found</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            We couldn&apos;t find any articles matching your search or filters. Try adjusting your search query or reset your filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSortBy("latest");
              setCurrentPage(1);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-semibold hover:bg-accent/90 transition-all shadow-xs"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Numbered Pagination Bar */}
      {totalPages > 1 && (
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Current Page Summary */}
          <span className="text-xs text-muted-foreground font-mono order-2 sm:order-1">
            Page <strong className="text-foreground">{safeCurrentPage}</strong> of{" "}
            <strong className="text-foreground">{totalPages}</strong>
          </span>

          {/* Pagination Controls */}
          <nav
            aria-label="Blog pagination"
            className="flex items-center gap-1.5 order-1 sm:order-2"
          >
            {/* Previous Page Button */}
            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border/80 bg-card/80 text-foreground text-xs font-semibold hover:border-accent hover:text-accent disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs active:scale-95"
              aria-label="Go to previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Prev</span>
            </button>

            {/* Numbered Page Buttons */}
            <div className="flex items-center gap-1">
              {paginationRange.map((item, index) => {
                if (item === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 py-1 text-xs text-muted-foreground select-none"
                    >
                      &hellip;
                    </span>
                  );
                }

                const pageNum = Number(item);
                const isActive = pageNum === safeCurrentPage;

                return (
                  <button
                    key={`page-${pageNum}`}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 border ${
                      isActive
                        ? "bg-accent text-accent-foreground border-accent shadow-xs shadow-accent/25 scale-105"
                        : "bg-card/70 border-border/80 text-muted-foreground hover:text-foreground hover:border-border hover:bg-card"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={`Page ${pageNum}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Page Button */}
            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border/80 bg-card/80 text-foreground text-xs font-semibold hover:border-accent hover:text-accent disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs active:scale-95"
              aria-label="Go to next page"
            >
              <span className="hidden xs:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
