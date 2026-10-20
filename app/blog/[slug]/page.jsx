import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import { notFound } from "next/navigation";

const BLOG_POSTS = {
  "learn-nextjs-basics": {
    title: "Learn Next.js Basics: The Ultimate Guide for Full-Stack Developers",
    description:
      "A complete guide to understanding Next.js App Router, Server Components, SEO optimization, and data fetching for modern web development.",
    publishedAt: "2024-02-01",
    readTime: "6 min read",
    category: "Next.js",
    content: (
      <>
        <p className="lead text-lg text-muted-foreground leading-relaxed">
          Next.js has become the industry benchmark for modern React applications. By combining Server Components,
          built-in SEO primitives, and edge rendering, it allows developers to build search-engine-friendly web apps
          with incredible speed.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">1. Why Next.js App Router Matters for SEO</h2>
        <p className="text-muted-foreground leading-relaxed">
          Traditional Client-Side Rendered (CSR) Single Page Applications often struggle with Googlebot crawl delays.
          With Next.js App Router, components are rendered on the server by default. This means search engines receive
          fully rendered HTML instantly, which dramatically boosts your indexation rate and Core Web Vitals.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">2. Managing Metadata and Open Graph</h2>
        <p className="text-muted-foreground leading-relaxed">
          Next.js offers a first-class <code className="px-1.5 py-0.5 rounded bg-muted text-accent font-mono text-sm">generateMetadata</code> function.
          This enables developers to declare dynamic titles, descriptions, canonical links, and social cards directly in page files.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">3. Core Web Vitals & Image Optimization</h2>
        <p className="text-muted-foreground leading-relaxed">
          The Next.js <code className="px-1.5 py-0.5 rounded bg-muted text-accent font-mono text-sm">Image</code> component automatically handles
          modern format conversion (WebP/AVIF), responsive image dimensions, and lazy-loading, ensuring top PageSpeed performance.
        </p>
      </>
    ),
  },
  "typescript-with-react": {
    title: "Why TypeScript Makes React & Next.js Development Superior",
    description:
      "Explore how static typing with TypeScript eliminates runtime bugs, improves developer velocity, and produces rock-solid full-stack code.",
    publishedAt: "2024-02-05",
    readTime: "5 min read",
    category: "TypeScript",
    content: (
      <>
        <p className="lead text-lg text-muted-foreground leading-relaxed">
          Building large-scale React and Next.js applications requires confidence in data contracts. TypeScript provides
          static typing, intelligent autocompletion, and robust refactoring tooling right inside your IDE.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">1. Type Safety Across Full-Stack Architectures</h2>
        <p className="text-muted-foreground leading-relaxed">
          When building PERN stack applications (PostgreSQL, Express/Node.js, React), sharing interfaces between backend API
          contracts and frontend React components prevents unexpected null values and schema mismatches.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">2. Safer Props and Component Contracts</h2>
        <p className="text-muted-foreground leading-relaxed">
          Explicit component prop interfaces make reusable design systems reliable and immediately understandable for any
          team member or future maintainer.
        </p>
      </>
    ),
  },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];

  if (!post) {
    const formattedTitle = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      title: `${formattedTitle} | Vishal Sharma Blog`,
      description: `Read technical insights on ${formattedTitle} by Vishal Sharma.`,
    };
  }

  return {
    title: `${post.title} | Vishal Sharma`,
    description: post.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: `${post.title} | Vishal Sharma`,
      description: post.description,
      url: `/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: ["Vishal Sharma"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];

  if (!post) {
    return notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": "Vishal Sharma",
      "url": "https://vishalsharma.dev"
    },
    "publisher": {
      "@type": "Person",
      "name": "Vishal Sharma"
    }
  };

  return (
    <main className="min-h-screen py-16 px-6 max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-accent hover:underline font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all articles</span>
        </Link>
      </div>

      <article className="space-y-8">
        <header className="space-y-4 border-b border-border/60 pb-8">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 border border-accent/20 text-accent">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              <span>Vishal Sharma</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        <section className="space-y-6 text-foreground/90 font-normal leading-relaxed text-base sm:text-lg">
          {post.content}
        </section>

        <footer className="mt-12 pt-8 border-t border-border/60">
          <div className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-foreground">Written by Vishal Sharma</h3>
              <p className="text-sm text-muted-foreground">
                PERN Full-Stack Developer specializing in high-performance web applications.
              </p>
            </div>
            <Link
              href="/#contact"
              className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Get in Touch
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
}
