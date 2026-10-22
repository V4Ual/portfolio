import Link from "next/link";
import {
  Calendar,
  Clock,
  Eye,
  Tag,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Share2,
} from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { incrementViewsAction } from "@/app/actions/blog";
import BlogShareMenu from "@/components/BlogShareMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { ArticleCodeEnhancer } from "@/components/ArticleCodeEnhancer";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { TableOfContents } from "@/components/TableOfContents";
import { slugify } from "@/lib/utils";
import type { Metadata } from "next";
import { cache } from "react";

function injectHeadingIds(html: string): string {
  if (!html) return "";
  return html.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, text) => {
    if (/id=["'][^"']+["']/i.test(attrs)) return match;
    const cleanText = text.replace(/<[^>]+>/g, "").trim();
    const id = slugify(cleanText);
    return `<${tag}${attrs} id="${id}">${text}</${tag}>`;
  });
}

function wrapTablesInResponsiveWrapper(html: string): string {
  if (!html) return "";
  return html.replace(/<table(?:\s+[^>]*)?>[\s\S]*?<\/table>/gi, (tableMatch, offset, fullString) => {
    // Strip hardcoded desktop pixel widths from col elements and cells so columns auto-manage size evenly
    let cleanedTable = tableMatch
      .replace(/<col[^>]*style=["'][^"']*width:[^"']*["'][^>]*>/gi, "<col>")
      .replace(/<col[^>]*width=["'][^"']*["'][^>]*>/gi, "<col>")
      .replace(/(<(?:td|th)[^>]*?)\s*colwidth=["'][^"']*["']/gi, "$1")
      .replace(/(<(?:td|th)[^>]*?)\s*style=["'][^"']*width:[^"']*["']/gi, "$1");

    // Detect column count from the first <tr> row
    const firstRowMatch = cleanedTable.match(/<tr(?:\s+[^>]*)?>([\s\S]*?)<\/tr>/i);
    let colCount = 0;
    if (firstRowMatch && firstRowMatch[1]) {
      const cellMatches = firstRowMatch[1].match(/<(?:td|th)(?:\s+[^>]*)?>/gi);
      colCount = cellMatches ? cellMatches.length : 0;
    }

    // Set responsive min-width: if many columns (> 3), allow comfortable horizontal scroll
    if (colCount > 3) {
      cleanedTable = cleanedTable.replace(/<table/i, `<table style="min-width: ${colCount * 140}px"`);
    } else {
      cleanedTable = cleanedTable.replace(/<table/i, `<table style="min-width: 100%"`);
    }

    const before = fullString.slice(0, offset);
    if (/class=["'][^"']*table-responsive-wrapper[^"']*["'][^>]*>\s*$/i.test(before)) {
      return cleanedTable;
    }
    return `<div class="table-responsive-wrapper">${cleanedTable}</div>`;
  });
}

export const revalidate = 60;

const getPost = cache(async (slug: string) => {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: { include: { tag: true } },
      author: true,
    },
  });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.published) {
    return {
      title: "Article Not Found | Vishal Sharma",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vishalsharma.dev";
  const canonicalUrl = post.canonicalUrl || `${baseUrl}/blog/${slug}`;
  const previewImage = post.ogImage || post.coverImage;

  return {
    title: `${post.metaTitle || post.title} | Vishal Sharma`,
    description: post.metaDescription || post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: ["Vishal Sharma"],
      images: previewImage ? [{ url: previewImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: previewImage ? [previewImage] : undefined,
    },
  };
}

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Only published posts are publicly accessible
  const post = await getPost(slug);

  if (!post || !post.published) {
    notFound();
  }

  // Increment views count in database
  await incrementViewsAction(slug);

  // Fetch up to 2 related articles from the same category or latest published
  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      NOT: { id: post.id },
      ...(post.categoryId ? { categoryId: post.categoryId } : {}),
    },
    take: 2,
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      readTime: true,
      coverImage: true,
      category: {
        select: { name: true },
      },
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vishalsharma.dev";
  const currentUrl = `${baseUrl}/blog/${slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    image: post.coverImage || undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": currentUrl,
    },
    author: {
      "@type": "Person",
      name: post.author?.name || "Vishal Sharma",
      url: baseUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Vishal Sharma",
    },
  };

  const isHtmlContent = post.content.trim().startsWith("<");
  const enhancedContent = isHtmlContent
    ? wrapTablesInResponsiveWrapper(injectHeadingIds(post.content))
    : post.content;

  return (
    <div className="min-h-screen bg-background text-foreground bg-ambient-mesh flex flex-col justify-between relative overflow-x-clip">
      {/* Scroll Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Primary Site Navigation Header */}
      <Navigation />

      {/* Main Blog Post Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 w-full space-y-10 sm:space-y-12 flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />

        {/* Secondary Breadcrumb Navigation & Quick Share Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-5">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card/80 hover:bg-muted text-xs sm:text-sm font-semibold text-foreground/80 hover:text-accent border border-border/80 transition-all active:scale-95 shadow-xs"
          >
            <ChevronLeft className="w-4 h-4 text-accent" />
            <span>All Articles</span>
          </Link>

          {/* Social Share Menu */}
          <BlogShareMenu title={post.title} url={currentUrl} />
        </div>

        {/* Article Hero Header */}
        <header className="space-y-6">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-muted-foreground">
            {post.category && (
              <span className="px-3 py-1 rounded-full bg-accent/15 text-accent font-semibold border border-accent/25">
                {post.category.name}
              </span>
            )}
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <time dateTime={post.publishedAt?.toISOString()}>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                  : "Recent"}
              </time>
            </div>
            <span className="text-border">&bull;</span>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{post.readTime}</span>
            </div>
            <span className="text-border">&bull;</span>
            <div className="flex items-center gap-1.5 font-mono text-muted-foreground">
              <Eye className="w-3.5 h-3.5 text-accent" />
              <span>{post.views + 1} reads</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.25]">
            {post.title}
          </h1>

          {/* Excerpt Lead */}
          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed border-l-2 border-accent/70 pl-4 py-1 italic bg-card/40 rounded-r-lg">
            {post.excerpt}
          </p>

          {/* Featured / Cover Image */}
          {post.coverImage && (
            <div className="rounded-2xl overflow-hidden border border-border/80 aspect-video bg-muted/20 shadow-md">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="text-xs px-2.5 py-1 rounded-md bg-muted/80 text-muted-foreground flex items-center gap-1.5 font-mono border border-border/60 hover:border-accent/50 transition-colors"
                >
                  <Tag className="w-3 h-3 text-accent" />
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Mobile Table of Contents */}
        <TableOfContents content={enhancedContent} mobileOnly />

        {/* 2-Column Responsive Layout: Content Body + Sticky Table of Contents Sidebar */}
        <div className="flex flex-col lg:flex-row items-start gap-10 xl:gap-14">
          <div className="flex-1 min-w-0 w-full space-y-10">
            {/* Article Body wrapped with Code Enhancer */}
            <ArticleCodeEnhancer>
              <article className="blog-content-body max-w-none text-foreground/90 break-words">
                {isHtmlContent ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: enhancedContent }}
                    className="tiptap-rendered-content"
                  />
                ) : (
                  <div className="blog-content-body">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ ...props }) => (
                          <div className="table-responsive-wrapper">
                            <table {...props} />
                          </div>
                        ),
                      }}
                    >
                      {post.content}
                    </ReactMarkdown>
                  </div>
                )}
              </article>
            </ArticleCodeEnhancer>

            {/* Share Banner at bottom of article */}
            <div className="p-6 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-accent" />
                  <span>Enjoyed this article?</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Share it with your developer network or peers who might find it helpful.
                </p>
              </div>
              <BlogShareMenu title={post.title} url={currentUrl} />
            </div>

            {/* Author Profile Card */}
            <div className="rounded-2xl mb-6 p-6 sm:p-7 border border-border/80 bg-card/60 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-accent-foreground font-black text-xl shrink-0 shadow-md">
                  VS
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                      Author
                    </span>
                    <span className="text-border">&bull;</span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Full-Stack Engineer
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {post.author?.name || "Vishal Sharma"}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                    Specializing in high-performance web applications, Next.js, TypeScript, PostgreSQL, and scalable full-stack architectures.
                  </p>
                </div>
              </div>
              <Link
                href="/#contact"
                className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-all shrink-0 shadow-md active:scale-95"
              >
                Get in Touch
              </Link>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="space-y-4 pt-6 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span>Related Articles</span>
                  </h2>
                  <Link
                    href="/blog"
                    className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {relatedPosts.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/blog/${rel.slug}`}
                      className="p-5 rounded-2xl border border-border/70 bg-card/60 hover:bg-card hover:border-accent/60 transition-all duration-200 space-y-2.5 block group shadow-xs hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                        <span className="text-accent font-semibold">
                          {rel.category?.name || "Article"}
                        </span>
                        <span>{rel.readTime}</span>
                      </div>
                      <h4 className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-accent transition-colors">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Desktop Table of Contents Sidebar */}
          <TableOfContents content={enhancedContent} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
