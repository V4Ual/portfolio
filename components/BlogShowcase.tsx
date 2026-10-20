"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Clock,
  ArrowRight,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  ArrowUpDown,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    id: string | number;
    name: string;
    slug: string;
  } | null;
  tags?: Array<{
    tag: {
      id: string | number;
      name: string;
      slug: string;
    };
  }>;
}

interface CategoryItem {
  id: string | number;
  name: string;
  slug: string;
}

interface BlogShowcaseProps {
  posts: PostItem[];
  categories: CategoryItem[];
}

type SortOption = "latest" | "popular" | "oldest";

export function BlogShowcase({ posts, categories }: BlogShowcaseProps) {
  const searchParams = useSearchParams();

  // Read initial values from URL query parameters (or sensible defaults)
  const initialQuery = searchParams?.get("q") ?? "";
  const initialCategory = searchParams?.get("category") ?? "all";
  const initialSort = (searchParams?.get("sort") as SortOption) ?? "latest";
  const initialPage = parseInt(searchParams?.get("page") ?? "1", 10) || 1;
  const initialPerPage = parseInt(searchParams?.get("per_page") ?? "6", 10) || 6;

  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [postsPerPage, setPostsPerPage] = useState<number>(initialPerPage);

  // Sync state to URL seamlessly without page reload
  const updateUrl = useCallback(
    (newParams: {
      q?: string;
      category?: string;
      sort?: string;
      page?: number;
      per_page?: number;
    }) => {
      if (typeof window === "undefined") return;
      const url = new URL(window.location.href);

      const q = newParams.q !== undefined ? newParams.q : searchQuery;
      const category = newParams.category !== undefined ? newParams.category : selectedCategory;
      const sort = newParams.sort !== undefined ? newParams.sort : sortBy;
      const page = newParams.page !== undefined ? newParams.page : currentPage;
      const perPage = newParams.per_page !== undefined ? newParams.per_page : postsPerPage;

      if (q.trim()) url.searchParams.set("q", q.trim());
      else url.searchParams.delete("q");

      if (category && category !== "all") url.searchParams.set("category", category);
      else url.searchParams.delete("category");

      if (sort && sort !== "latest") url.searchParams.set("sort", sort);
      else url.searchParams.delete("sort");

      if (page > 1) url.searchParams.set("page", page.toString());
      else url.searchParams.delete("page");

      if (perPage !== 6) url.searchParams.set("per_page", perPage.toString());
      else url.searchParams.delete("per_page");

      window.history.replaceState(null, "", url.toString());
    },
    [searchQuery, selectedCategory, sortBy, currentPage, postsPerPage]
  );

  // 1. Dynamic filtering based on search query and category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Category match
      if (selectedCategory !== "all" && post.category?.slug !== selectedCategory) {
        return false;
      }

      // Search query match
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesExcerpt = post.excerpt.toLowerCase().includes(query);
        const matchesCategory = post.category?.name?.toLowerCase().includes(query);
        const matchesTags = post.tags?.some((t) =>
          t.tag.name.toLowerCase().includes(query)
        );
        return Boolean(matchesTitle || matchesExcerpt || matchesCategory || matchesTags);
      }

      return true;
    });
  }, [posts, selectedCategory, searchQuery]);

  // 2. Dynamic sorting
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

  // 3. Dynamic pagination calculations
  const totalItems = sortedPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / postsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Auto-clamp currentPage if search reduces page count
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
      updateUrl({ page: totalPages });
    }
  }, [totalPages, currentPage, updateUrl]);

  const startIndex = (safeCurrentPage - 1) * postsPerPage;
  const endIndex = Math.min(startIndex + postsPerPage, totalItems);
  const currentPosts = useMemo(() => {
    return sortedPosts.slice(startIndex, endIndex);
  }, [sortedPosts, startIndex, endIndex]);

  // Smooth scroll to blog top on page change
  const scrollToBlogTop = () => {
    const el = document.getElementById("blog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === safeCurrentPage) return;
    setCurrentPage(page);
    updateUrl({ page });
    scrollToBlogTop();
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
    updateUrl({ category: categorySlug, page: 1 });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setCurrentPage(1);
    updateUrl({ q: val, page: 1 });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    updateUrl({ q: "", page: 1 });
  };

  const handleSortSelect = (sortVal: SortOption) => {
    setSortBy(sortVal);
    setCurrentPage(1);
    updateUrl({ sort: sortVal, page: 1 });
  };

  const handlePerPageChange = (val: number) => {
    setPostsPerPage(val);
    setCurrentPage(1);
    updateUrl({ per_page: val, page: 1 });
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("latest");
    setCurrentPage(1);
    setPostsPerPage(6);
    updateUrl({ q: "", category: "all", sort: "latest", page: 1, per_page: 6 });
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

          {/* Sort & Per-Page Controls */}
          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            {/* Posts Per Page Selector */}
            <div className="hidden xs:flex items-center gap-1.5 bg-card/70 border border-border/80 px-2 py-1 rounded-xl text-xs">
              <span className="text-[11px] text-muted-foreground font-medium">Show:</span>
              {[3, 6, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePerPageChange(num)}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all text-xs ${
                    postsPerPage === num
                      ? "bg-accent text-accent-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  title={`Show ${num} articles per page`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Custom Premium Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden md:inline font-medium">
                Sort by:
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-xl border border-border/80 bg-card/80 hover:bg-card hover:border-accent/60 text-foreground text-xs font-semibold transition-all shadow-xs cursor-pointer focus:outline-none"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-accent" />
                    <span>
                      {sortBy === "latest"
                        ? "Newest First"
                        : sortBy === "popular"
                        ? "Most Popular"
                        : "Oldest First"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-40 rounded-xl border border-border/80 bg-card/95 backdrop-blur-xl p-1 shadow-xl z-50 space-y-0.5"
                >
                  <DropdownMenuItem
                    onClick={() => handleSortSelect("latest")}
                    className={`cursor-pointer rounded-lg text-xs font-semibold flex items-center justify-between px-2.5 py-2 transition-colors ${
                      sortBy === "latest"
                        ? "bg-accent/15 text-accent font-bold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>Newest First</span>
                    {sortBy === "latest" && <Check className="w-3.5 h-3.5 text-accent" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortSelect("popular")}
                    className={`cursor-pointer rounded-lg text-xs font-semibold flex items-center justify-between px-2.5 py-2 transition-colors ${
                      sortBy === "popular"
                        ? "bg-accent/15 text-accent font-bold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>Most Popular</span>
                    {sortBy === "popular" && <Check className="w-3.5 h-3.5 text-accent" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortSelect("oldest")}
                    className={`cursor-pointer rounded-lg text-xs font-semibold flex items-center justify-between px-2.5 py-2 transition-colors ${
                      sortBy === "oldest"
                        ? "bg-accent/15 text-accent font-bold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>Oldest First</span>
                    {sortBy === "oldest" && <Check className="w-3.5 h-3.5 text-accent" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
            ` in "${categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>

        <div className="flex items-center gap-3">
          {/* Mobile per-page selector */}
          <div className="xs:hidden flex items-center gap-1">
            <span className="text-[11px]">Per page:</span>
            {[3, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handlePerPageChange(num)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  postsPerPage === num
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {(searchQuery || selectedCategory !== "all" || sortBy !== "latest" || postsPerPage !== 6) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-accent hover:underline font-medium text-xs cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
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
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-semibold hover:bg-accent/90 transition-all shadow-xs cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Dynamic Numbered Pagination Bar */}
      {totalItems > 0 && (
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Current Page Summary */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono order-2 sm:order-1">
            <span>
              Page <strong className="text-foreground">{safeCurrentPage}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </span>
            {totalPages === 1 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-sans">
                All articles shown
              </span>
            )}
          </div>

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
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border/80 bg-card/80 text-foreground text-xs font-semibold hover:border-accent hover:text-accent disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs active:scale-95 cursor-pointer"
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
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 border cursor-pointer ${
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
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border/80 bg-card/80 text-foreground text-xs font-semibold hover:border-accent hover:text-accent disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs active:scale-95 cursor-pointer"
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
