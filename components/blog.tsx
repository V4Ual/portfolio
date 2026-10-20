import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles, Eye, Calendar } from "lucide-react";

export async function Blog() {
  let posts: any[] = [];

  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      take: 3,
      orderBy: { publishedAt: "desc" },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  } catch (error) {
    console.error("Failed to load blog posts for homepage preview:", error);
  }

  // If no posts are published yet, don't show an empty broken section
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 px-6 border-t border-border/60 relative bg-background/50">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header & Link to Full Blog Page */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Technical Insights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Latest Articles
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              Architectural deep dives, database design, and real-world full-stack solutions.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/80 border border-border/80 hover:border-accent text-foreground hover:text-accent text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 group shrink-0"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Featured Preview Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-border/80 bg-card/60 hover:bg-card hover:border-accent/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1"
            >
              <div>
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
                        {post.category?.name || "Architecture"}
                      </span>
                    </div>
                  )}
                  {post.category && (
                    <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md text-accent border border-accent/20 shadow-xs">
                      {post.category.name}
                    </span>
                  )}
                </div>

                <div className="p-5 sm:p-6 space-y-3">
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

                  <h3 className="font-bold text-foreground text-base sm:text-lg leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>

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
      </div>
    </section>
  );
}
