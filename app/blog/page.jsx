import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlogList from "../../components/BlogList";

export const metadata = {
  title: "Engineering Articles & Insights",
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

export default function BlogIndexPage() {
  const blogs = [
    {
      id: 1,
      title: "Learn Next.js Basics: The Ultimate Guide for Full-Stack Developers",
      description:
        "A complete guide to understanding Next.js App Router, Server Components, SEO optimization, and data fetching for modern web development.",
      slug: "learn-nextjs-basics",
      publishedAt: "2024-02-01",
    },
    {
      id: 2,
      title: "Why TypeScript Makes React & Next.js Development Superior",
      description:
        "Explore how static typing with TypeScript eliminates runtime bugs, improves developer velocity, and produces rock-solid full-stack code.",
      slug: "typescript-with-react",
      publishedAt: "2024-02-05",
    },
  ];

  return (
    <main className="min-h-screen py-16 px-6 max-w-4xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-accent hover:underline font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <header className="space-y-3">
        <span className="text-accent text-xs font-bold tracking-widest uppercase">
          // Technical Blog & Tutorials
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Articles & Engineering Insights
        </h1>
        <p className="text-muted-foreground text-lg">
          Insights on building scalable web systems, mastering the PERN stack, and optimizing modern Next.js applications for search and speed.
        </p>
      </header>

      <section>
        <BlogList blogs={blogs} />
      </section>
    </main>
  );
}
