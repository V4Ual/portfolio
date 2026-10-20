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

  // 4. Seed Posts
  const post1 = await prisma.post.upsert({
    where: { slug: "learn-nextjs-basics" },
    update: {},
    create: {
      title: "Learn Next.js Basics: The Ultimate Guide for Full-Stack Developers",
      slug: "learn-nextjs-basics",
      excerpt:
        "A complete guide to understanding Next.js App Router, Server Components, SEO optimization, and data fetching for modern web development.",
      content: `Next.js has become the industry benchmark for modern React applications. By combining Server Components, built-in SEO primitives, and edge rendering, it allows developers to build search-engine-friendly web apps with incredible speed.

## 1. Why Next.js App Router Matters for SEO

Traditional Client-Side Rendered (CSR) Single Page Applications often struggle with Googlebot crawl delays. With Next.js App Router, components are rendered on the server by default. This means search engines receive fully rendered HTML instantly, which dramatically boosts your indexation rate and Core Web Vitals.

\`\`\`tsx
// Example of Next.js dynamic metadata export
export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: \`Engineering Insights: \${slug}\`,
    description: "Deep dive into full-stack web development.",
  };
}
\`\`\`

## 2. Managing Metadata and Open Graph

Next.js offers a first-class \`generateMetadata\` function. This enables developers to declare dynamic titles, descriptions, canonical links, and social cards directly in page files.

## 3. Core Web Vitals & Image Optimization

The Next.js \`Image\` component automatically handles modern format conversion (WebP/AVIF), responsive image dimensions, and lazy-loading, ensuring top PageSpeed performance.`,
      readTime: "6 min read",
      published: true,
      featured: true,
      authorId: admin.id,
      categoryId: catNextjs.id,
      publishedAt: new Date("2024-02-01"),
      metaTitle: "Learn Next.js Basics: The Ultimate Guide for Full-Stack Developers",
      metaDescription:
        "A complete guide to understanding Next.js App Router, Server Components, SEO optimization, and data fetching.",
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: "typescript-with-react" },
    update: {},
    create: {
      title: "Why TypeScript Makes React & Next.js Development Superior",
      slug: "typescript-with-react",
      excerpt:
        "Explore how static typing with TypeScript eliminates runtime bugs, improves developer velocity, and produces rock-solid full-stack code.",
      content: `Building large-scale React and Next.js applications requires confidence in data contracts. TypeScript provides static typing, intelligent autocompletion, and robust refactoring tooling right inside your IDE.

## 1. Type Safety Across Full-Stack Architectures

When building PERN stack applications (PostgreSQL, Express/Node.js, React), sharing interfaces between backend API contracts and frontend React components prevents unexpected null values and schema mismatches.

\`\`\`typescript
interface PostArticle {
  id: string;
  title: string;
  slug: string;
  views: number;
  published: boolean;
}
\`\`\`

## 2. Safer Props and Component Contracts

Explicit component prop interfaces make reusable design systems reliable and immediately understandable for any team member or future maintainer.`,
      readTime: "5 min read",
      published: true,
      featured: false,
      authorId: admin.id,
      categoryId: catTypescript.id,
      publishedAt: new Date("2024-02-05"),
      metaTitle: "Why TypeScript Makes React & Next.js Development Superior",
      metaDescription:
        "Explore how static typing with TypeScript eliminates runtime bugs and improves developer velocity.",
    },
  });

  // Link tags to posts
  await prisma.postTag.upsert({
    where: { postId_tagId: { postId: post1.id, tagId: tagFullstack.id } },
    update: {},
    create: { postId: post1.id, tagId: tagFullstack.id },
  });

  await prisma.postTag.upsert({
    where: { postId_tagId: { postId: post1.id, tagId: tagPostgres.id } },
    update: {},
    create: { postId: post1.id, tagId: tagPostgres.id },
  });

  await prisma.postTag.upsert({
    where: { postId_tagId: { postId: post2.id, tagId: tagReact.id } },
    update: {},
    create: { postId: post2.id, tagId: tagReact.id },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
