import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  FileText,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Eye,
  TrendingUp,
  ExternalLink,
  Sparkles,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PostRowActions from "@/components/admin/PostRowActions";

export const revalidate = 0; // Dynamic admin data

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; category?: string; sort?: string }>;
}) {
  const { q, status, category, sort } = await searchParams;

  const whereClause: any = {};
  if (q) {
    whereClause.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }
  if (status === "published") {
    whereClause.published = true;
  } else if (status === "draft") {
    whereClause.status = "DRAFT";
  } else if (status === "unpublished") {
    whereClause.status = "UNPUBLISHED";
  }

  if (category) {
    whereClause.category = { slug: category };
  }

  // Sorting
  let orderBy: any = { publishedAt: "desc" };
  if (sort === "oldest") {
    orderBy = { publishedAt: "asc" };
  } else if (sort === "updated") {
    orderBy = { updatedAt: "desc" };
  } else if (sort === "views") {
    orderBy = { views: "desc" };
  }

  // Fetch posts, categories, and executive KPI metrics in parallel
  const [
    posts,
    categories,
    totalPostsCount,
    publishedCount,
    draftCount,
    viewsAggregation,
  ] = await Promise.all([
    prisma.post.findMany({
      where: whereClause,
      orderBy,
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { posts: true } },
      },
    }),
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.post.aggregate({ _sum: { views: true } }),
  ]);

  const totalViews = viewsAggregation._sum.views || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header & New Post Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold tracking-widest uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Content Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Blog Post Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage, edit, publish, and track analytics for all portfolio technical articles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border/80 bg-card/80 hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-xs"
          >
            <span>View Public Blog</span>
            <ExternalLink className="w-3.5 h-3.5 text-accent" />
          </Link>
          <Link href="/admin/posts/new">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 font-bold shadow-md shadow-accent/20 rounded-xl">
              <PlusCircle className="w-4 h-4" />
              <span>Create New Article</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Executive Metric KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Articles */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Articles</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {totalPostsCount}
          </div>
          <p className="text-[11px] text-muted-foreground">Across all technical topics</p>
        </div>

        {/* Published */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">Published</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-500 font-mono">
            {publishedCount}
          </div>
          <p className="text-[11px] text-muted-foreground">Live on public /blog</p>
        </div>

        {/* Drafts */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">Drafts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">
            {draftCount}
          </div>
          <p className="text-[11px] text-muted-foreground">In development / unpublished</p>
        </div>

        {/* Total Views */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">Total Reads</span>
            <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {totalViews}
          </div>
          <p className="text-[11px] text-muted-foreground">Cumulative article impressions</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card/50 backdrop-blur-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-xs">
        {/* Search Input */}
        <form method="GET" className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            name="q"
            defaultValue={q || ""}
            placeholder="Search by title, slug, or content..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-border/80 bg-background/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </form>

        {/* Status Chips & Sorting Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Chips */}
          <Link
            href="/admin/posts"
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
              !status
                ? "bg-accent text-accent-foreground border-accent shadow-xs"
                : "border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All ({totalPostsCount})
          </Link>
          <Link
            href="/admin/posts?status=published"
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
              status === "published"
                ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Published ({publishedCount})
          </Link>
          <Link
            href="/admin/posts?status=draft"
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
              status === "draft"
                ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400"
                : "border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Drafts ({draftCount})
          </Link>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 border-l border-border/80 pl-3">
            <ArrowUpDown className="w-3.5 h-3.5 text-accent" />
            <Link
              href={`/admin/posts?${new URLSearchParams({
                ...(q && { q }),
                ...(status && { status }),
                sort: sort === "oldest" ? "views" : sort === "views" ? "updated" : "oldest",
              })}`}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold hover:underline"
            >
              {sort === "oldest"
                ? "Oldest"
                : sort === "views"
                ? "Most Views"
                : "Newest First"}
            </Link>
          </div>
        </div>
      </div>

      {/* Articles Glassmorphism Card Table */}
      <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
        {posts.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No articles match your criteria</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try adjusting your search filters or create a new technical article.
              </p>
            </div>
            <Link href="/admin/posts/new">
              <Button size="sm" className="bg-accent text-accent-foreground font-semibold mt-2">
                Write Article
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 bg-muted/30 select-none">
                <tr>
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Views</th>
                  <th className="py-3.5 px-4">Updated</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/40 transition-colors group">
                    {/* Article Details */}
                    <td className="py-4 px-4 max-w-md">
                      <div className="flex items-center gap-3.5">
                        {post.coverImage ? (
                          <div className="w-14 h-10 rounded-xl overflow-hidden border border-border/80 shrink-0 bg-muted/40 shadow-2xs">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-10 rounded-xl border border-dashed border-border flex items-center justify-center shrink-0 bg-muted/20">
                            <FileText className="w-4 h-4 text-muted-foreground/60" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="font-bold text-foreground hover:text-accent transition-colors line-clamp-1 text-sm"
                          >
                            {post.title}
                          </Link>
                          <div className="text-[11px] text-muted-foreground font-mono truncate">
                            /blog/{post.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {post.category ? (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-accent/15 text-accent font-semibold border border-accent/20">
                          {post.category.name}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground font-mono">—</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {post.published ? (
                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Published
                        </span>
                      ) : post.status === "UNPUBLISHED" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Unpublished
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Views */}
                    <td className="py-4 px-4 text-right font-mono text-xs text-foreground font-semibold">
                      {post.views}
                    </td>

                    {/* Updated Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-muted-foreground font-mono">
                      {new Date(post.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <PostRowActions
                        post={{
                          id: post.id,
                          title: post.title,
                          slug: post.slug,
                          published: post.published,
                          status: post.status,
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
