import { Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { BlogShowcase } from "@/components/BlogShowcase";
import { prisma } from "@/lib/prisma";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Articles & Insights | Vishal Sharma",
  description:
    "Explore in-depth technical articles on Next.js, TypeScript, PostgreSQL, and full-stack web development by Vishal Sharma.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Engineering Articles & Insights | Vishal Sharma",
    description:
      "Explore in-depth technical articles on Next.js, TypeScript, PostgreSQL, and full-stack web development by Vishal Sharma.",
    url: "/blog",
  },
};

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function BlogIndexPage() {
  let posts: any[] = [];
  let categories: any[] = [];

  try {
    const [fetchedPosts, fetchedCategories] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          tags: {
            include: {
              tag: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      }),
    ]);

    posts = fetchedPosts;
    categories = fetchedCategories;
  } catch (error) {
    console.error("Failed to load blog posts for separate blog page:", error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-x-hidden bg-ambient-mesh">
      {/* Site Header / Navigation */}
      <Navigation />

      {/* Main Blog Page Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 w-full space-y-10 sm:space-y-12">
        {/* Hero Header */}
        <header className="space-y-4 text-center sm:text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Technical Blog &amp; Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Articles &amp; Engineering Insights
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Deep dives on building scalable web systems, database performance, Next.js architecture, and modern full-stack development by Vishal Sharma.
          </p>
        </header>

        {/* Full Interactive Showcase: Search, Sort Dropdown, Categories, Cards & Numbered Pagination */}
        <section id="blog" className="pt-2">
          <Suspense
            fallback={
              <div className="space-y-8 animate-pulse">
                <div className="h-10 bg-muted/60 rounded-xl w-full max-w-md" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-72 bg-card/60 rounded-2xl border border-border/60" />
                  ))}
                </div>
              </div>
            }
          >
            <BlogShowcase posts={posts} categories={categories} />
          </Suspense>
        </section>
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
