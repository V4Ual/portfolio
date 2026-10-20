import Link from "next/link";
import { ArrowLeft, Home, BookOpen, Compass, Search, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "404 - Page Not Found | Vishal Sharma",
  description: "The page or article you are looking for could not be found.",
};

export default async function NotFound() {
  // Fetch up to 3 latest published posts for quick recovery
  let recentPosts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    readTime: string;
    category?: { name: string } | null;
  }> = [];

  try {
    recentPosts = await prisma.post.findMany({
      where: { published: true },
      take: 3,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        readTime: true,
        category: {
          select: { name: true },
        },
      },
    });
  } catch (err) {
    console.error("Failed to fetch recent posts for 404 page", err);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden bg-ambient-mesh">
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold tracking-tight text-foreground hover:text-accent transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-accent-foreground font-bold text-xs shadow-xs">
            VS
          </div>
          <span>Vishal Sharma</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main 404 Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center max-w-3xl mx-auto space-y-8 z-10">
        {/* Glowing Badge & Number */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-accent/20 blur-2xl opacity-75 animate-pulse" />
          <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted/80 border border-border/80 text-xs font-semibold text-accent mb-4">
            <Compass className="w-3.5 h-3.5 text-accent animate-spin" style={{ animationDuration: "12s" }} />
            <span>Error 404 &bull; Page Missing</span>
          </div>

          <h1 className="text-7xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground/30 select-none">
            404
          </h1>
        </div>

        {/* Heading & Description */}
        <div className="space-y-3 max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Lost in digital space?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            The page, blog post, or resource you are looking for has been moved, renamed, or doesn&apos;t exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold text-xs sm:text-sm hover:opacity-90 transition-all duration-200 shadow-md active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border/80 hover:border-accent text-foreground font-semibold text-xs sm:text-sm hover:text-accent transition-all duration-200 shadow-xs active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Articles</span>
          </Link>
        </div>

        {/* Suggested Articles Section */}
        {recentPosts.length > 0 && (
          <div className="w-full pt-10 border-t border-border/60 text-left space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Recommended Articles to Read</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-3.5">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group p-4 rounded-xl border border-border/80 bg-card/60 hover:bg-card hover:border-accent/60 transition-all duration-200 space-y-2 block"
                >
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="text-accent font-semibold">
                      {post.category?.name || "Article"}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-muted-foreground border-t border-border/40">
        &copy; {new Date().getFullYear()} Vishal Sharma &bull; Built with Next.js &amp; PostgreSQL
      </footer>
    </div>
  );
}
