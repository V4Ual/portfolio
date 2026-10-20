import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Seed or find Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@vishalsharma.dev";
  const rawPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Vishal Sharma",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`Admin user ready: ${admin.email}`);

  // 2. Seed Categories
  const catNextjs = await prisma.category.upsert({
    where: { slug: "nextjs" },
    update: {},
    create: {
      name: "Next.js",
      slug: "nextjs",
      description: "Articles and best practices for modern Next.js development.",
    },
  });

  const catTypescript = await prisma.category.upsert({
    where: { slug: "typescript" },
    update: {},
    create: {
      name: "TypeScript",
      slug: "typescript",
      description: "Static typing, safety, and scalable TypeScript architecture.",
    },
  });

  const catPostgres = await prisma.category.upsert({
    where: { slug: "postgresql" },
    update: {},
    create: {
      name: "PostgreSQL",
      slug: "postgresql",
      description: "High performance database design, indexing, and optimization.",
    },
  });

  const catArchitecture = await prisma.category.upsert({
    where: { slug: "architecture" },
    update: {},
    create: {
      name: "Architecture",
      slug: "architecture",
      description: "System design, distributed services, and backend patterns.",
    },
  });

  const catReact = await prisma.category.upsert({
    where: { slug: "react" },
    update: {},
    create: {
      name: "React",
      slug: "react",
      description: "React 19 internals, hooks, server components, and state management.",
    },
  });

  // 3. Seed Tags
  const tagFullstack = await prisma.tag.upsert({
    where: { slug: "fullstack" },
    update: {},
    create: { name: "Fullstack", slug: "fullstack" },
  });

  const tagReact = await prisma.tag.upsert({
    where: { slug: "react" },
    update: {},
    create: { name: "React", slug: "react" },
  });

  const tagPostgres = await prisma.tag.upsert({
    where: { slug: "postgresql" },
    update: {},
    create: { name: "PostgreSQL", slug: "postgresql" },
  });

  const tagPerf = await prisma.tag.upsert({
    where: { slug: "performance" },
    update: {},
    create: { name: "Performance", slug: "performance" },
  });

  const tagRedis = await prisma.tag.upsert({
    where: { slug: "redis" },
    update: {},
    create: { name: "Redis", slug: "redis" },
  });

  // 4. Seed 8 Comprehensive Articles
  const postsData = [
    {
      title: "Learn Next.js Basics: The Ultimate Guide for Full-Stack Developers",
      slug: "learn-nextjs-basics",
      excerpt: "A complete guide to understanding Next.js App Router, Server Components, SEO optimization, and data fetching for modern web development.",
      content: "Next.js has become the industry standard for production React web applications. By pairing React Server Components with file-based routing and edge caching, developers build lightning-fast, SEO-optimized web systems effortlessly.",
      readTime: "6 min read",
      published: true,
      featured: true,
      views: 1420,
      categoryId: catNextjs.id,
      publishedAt: new Date("2024-02-01"),
      metaTitle: "Learn Next.js Basics: The Ultimate Guide for Full-Stack Developers",
      metaDescription: "A complete guide to understanding Next.js App Router, Server Components, SEO optimization, and data fetching.",
      tags: [tagFullstack.id, tagReact.id],
    },
    {
      title: "Why TypeScript Makes React & Next.js Development Superior",
      slug: "typescript-with-react",
      excerpt: "Explore how static typing with TypeScript eliminates runtime bugs, improves developer velocity, and produces rock-solid full-stack code.",
      content: "Building scalable enterprise applications requires confidence in data contracts. TypeScript provides static typing, intelligent autocomplete, and zero runtime overhead for clean codebase evolution.",
      readTime: "5 min read",
      published: true,
      featured: false,
      views: 980,
      categoryId: catTypescript.id,
      publishedAt: new Date("2024-02-05"),
      metaTitle: "Why TypeScript Makes React & Next.js Development Superior",
      metaDescription: "Explore how static typing with TypeScript eliminates runtime bugs and improves developer velocity.",
      tags: [tagReact.id, tagFullstack.id],
    },
    {
      title: "High-Performance PostgreSQL: Indexing Strategies & Query Tuning",
      slug: "optimizing-postgresql-queries",
      excerpt: "Master B-Tree vs GIN indexing, EXPLAIN ANALYZE execution plan breakdown, and connection pooling with PgBouncer.",
      content: "When databases grow past hundreds of thousands of rows, query performance can degrade dramatically without proper indexing and query design. In this deep dive, we dissect indexing strategies that yield sub-50ms queries.",
      readTime: "8 min read",
      published: true,
      featured: true,
      views: 1850,
      categoryId: catPostgres.id,
      publishedAt: new Date("2024-02-10"),
      metaTitle: "High-Performance PostgreSQL: Indexing Strategies & Query Tuning",
      metaDescription: "Master B-Tree vs GIN indexing, EXPLAIN ANALYZE execution plan breakdown, and connection pooling.",
      tags: [tagPostgres.id, tagPerf.id],
    },
    {
      title: "Architecting Resilient Microservices with Node.js & Redis",
      slug: "architecting-resilient-microservices",
      excerpt: "Design fault-tolerant backend architectures using asynchronous message queues, distributed Redis caching, and circuit breakers.",
      content: "Modern distributed systems require resilience against cascading failures. Learn how Redis caching layers, BullMQ task runners, and Docker containers form the backbone of reliable services.",
      readTime: "7 min read",
      published: true,
      featured: false,
      views: 1120,
      categoryId: catArchitecture.id,
      publishedAt: new Date("2024-02-14"),
      metaTitle: "Architecting Resilient Microservices with Node.js & Redis",
      metaDescription: "Design fault-tolerant backend architectures using asynchronous message queues and distributed Redis caching.",
      tags: [tagRedis.id, tagFullstack.id, tagPerf.id],
    },
    {
      title: "Next.js App Router Server Actions: Deep Dive & Mutation Patterns",
      slug: "nextjs-server-actions-deep-dive",
      excerpt: "Say goodbye to boilerplate API routes. Learn how React Server Actions streamline database mutations with optimistic UI updates.",
      content: "Server Actions provide direct RPC invocations between client components and the server runtime. We demonstrate atomic transactions, revalidatePath strategies, and Zod validation.",
      readTime: "6 min read",
      published: true,
      featured: false,
      views: 2300,
      categoryId: catNextjs.id,
      publishedAt: new Date("2024-02-18"),
      metaTitle: "Next.js App Router Server Actions: Deep Dive & Mutation Patterns",
      metaDescription: "Learn how React Server Actions streamline database mutations with optimistic UI updates.",
      tags: [tagReact.id, tagFullstack.id],
    },
    {
      title: "Mastering React 19: Compiler, Actions, & Server Components",
      slug: "mastering-react-19-features",
      excerpt: "Discover how the React Compiler eliminates useMemo/useCallback overhead and unifies asynchronous state management with useActionState.",
      content: "React 19 revolutionizes frontend development with automated memoization, useOptimistic, and native asset preloading. Here is a practical breakdown of the new paradigm.",
      readTime: "7 min read",
      published: true,
      featured: false,
      views: 1640,
      categoryId: catReact.id,
      publishedAt: new Date("2024-02-22"),
      metaTitle: "Mastering React 19: Compiler, Actions, & Server Components",
      metaDescription: "Discover how the React Compiler eliminates memoization overhead and simplifies async states.",
      tags: [tagReact.id, tagPerf.id],
    },
    {
      title: "Zero Trust Web Security: JWTs, CSRF, & Cookie Best Practices",
      slug: "zero-trust-web-security-best-practices",
      excerpt: "Comprehensive security patterns for modern web apps: HttpOnly cookie storage, short-lived JWT rotation, and Content Security Policies.",
      content: "Security is non-negotiable in production engineering. Learn why storing access tokens in localStorage exposes users to XSS, and how HttpOnly SameSite=Strict cookies solve the vulnerability.",
      readTime: "9 min read",
      published: true,
      featured: false,
      views: 890,
      categoryId: catArchitecture.id,
      publishedAt: new Date("2024-02-26"),
      metaTitle: "Zero Trust Web Security: JWTs, CSRF, & Cookie Best Practices",
      metaDescription: "Comprehensive security patterns for modern web apps: HttpOnly cookies, JWT rotation, and CSP headers.",
      tags: [tagFullstack.id],
    },
    {
      title: "Full-Stack Web Performance: Sub-Second Load Times with Core Web Vitals",
      slug: "full-stack-web-performance-core-web-vitals",
      excerpt: "Achieve 100/100 Lighthouse scores by tackling LCP, INP, and CLS through font subsetting, image optimization, and edge caching.",
      content: "Speed directly impacts conversion and SEO ranking. In this guide, we break down real-world optimizations that cut First Contentful Paint by 65% across mobile devices.",
      readTime: "6 min read",
      published: true,
      featured: false,
      views: 1310,
      categoryId: catPostgres.id,
      publishedAt: new Date("2024-03-01"),
      metaTitle: "Full-Stack Web Performance: Sub-Second Load Times with Core Web Vitals",
      metaDescription: "Achieve 100/100 Lighthouse scores by tackling LCP, INP, and CLS through proven full-stack optimizations.",
      tags: [tagPerf.id, tagFullstack.id],
    },
  ];

  for (const postItem of postsData) {
    const { tags, ...postFields } = postItem;
    const post = await prisma.post.upsert({
      where: { slug: postFields.slug },
      update: postFields,
      create: {
        ...postFields,
        authorId: admin.id,
      },
    });

    for (const tagId of tags) {
      await prisma.postTag.upsert({
        where: { postId_tagId: { postId: post.id, tagId } },
        update: {},
        create: { postId: post.id, tagId },
      });
    }
  }

  console.log(`Database seeded successfully with ${postsData.length} articles!`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
