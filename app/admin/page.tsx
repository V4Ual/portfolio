import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  FileText,
  Eye,
  CheckCircle2,
  FileEdit,
  PlusCircle,
  Database,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [totalPosts, publishedPosts, draftPosts, viewsAggregate, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false } }),
      prisma.post.aggregate({
        _sum: { views: true },
      }),
      prisma.post.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: {
          category: true,
        },
      }),
    ]);

  const totalViews = viewsAggregate._sum.views || 0;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
              <Database className="w-3 h-3" /> PostgreSQL Connected
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Blog CMS Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage technical articles, drafts, and track readership engagement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/posts/new">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 font-semibold shadow-md">
              <PlusCircle className="w-4 h-4" />
              <span>Create New Article</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Posts */}
        <div className="p-6 rounded-2xl border border-border/70 bg-card/50 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Articles</span>
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">{totalPosts}</div>
          <p className="text-xs text-muted-foreground">Articles saved in PostgreSQL</p>
        </div>

        {/* Published Posts */}
        <div className="p-6 rounded-2xl border border-border/70 bg-card/50 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Published Live</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">{publishedPosts}</div>
          <p className="text-xs text-muted-foreground">Publicly readable by visitors</p>
        </div>

        {/* Drafts */}
        <div className="p-6 rounded-2xl border border-border/70 bg-card/50 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Drafts</span>
            <FileEdit className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">{draftPosts}</div>
          <p className="text-xs text-muted-foreground">Works in progress</p>
        </div>

        {/* Total Views */}
        <div className="p-6 rounded-2xl border border-border/70 bg-card/50 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Reads</span>
            <Eye className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">{totalViews}</div>
          <p className="text-xs text-muted-foreground">Combined article pageviews</p>
        </div>
      </div>

      {/* Recent Posts Table Section */}
      <div className="rounded-2xl border border-border/70 bg-card/50 backdrop-blur-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-foreground">Recent Articles</h2>
            <p className="text-xs text-muted-foreground">Last modified technical articles</p>
          </div>

          <Link
            href="/admin/posts"
            className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
          >
            <span>View All ({totalPosts})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/80 rounded-xl">
            <p className="text-sm text-muted-foreground mb-4">No articles created yet.</p>
            <Link href="/admin/posts/new">
              <Button size="sm" className="bg-accent text-accent-foreground">
                Write your first article
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
                <tr>
                  <th className="py-3 px-4 font-semibold">Title</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Views</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground line-clamp-1">
                        {post.title}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        /blog/{post.slug}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {post.category ? (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium">
                          {post.category.name}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {post.published ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-muted-foreground">
                      {post.views}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
                      >
                        Edit
                      </Link>
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
