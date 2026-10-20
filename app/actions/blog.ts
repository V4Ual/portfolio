"use server";

import { prisma } from "@/lib/prisma";
import { authenticateAdmin, clearSessionCookie, getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { calculateReadTime, slugify } from "@/lib/utils";

// Helper to get authenticated user ID or fallback to database admin in local dev
async function getAuthorId(): Promise<string> {
  const session = await getSession();
  if (session?.id) {
    const userExists = await prisma.user.findUnique({ where: { id: session.id } });
    if (userExists) return userExists.id;
  }

  // Fallback to existing admin user
  const admin = await prisma.user.findFirst();
  if (admin) return admin.id;

  // Auto-create admin if none exists
  const newAdmin = await prisma.user.upsert({
    where: { email: "admin@vishalsharma.dev" },
    update: {},
    create: {
      email: "admin@vishalsharma.dev",
      name: "Vishal Sharma",
      password: "admin",
      role: "ADMIN",
    },
  });
  return newAdmin.id;
}

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch (err) {
    // Safe fallback if called outside request context
  }
}

// 1. Admin Login Action
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/admin";

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  const result = await authenticateAdmin(email.trim(), password);
  if (!result.success) {
    return { error: result.error || "Authentication failed." };
  }

  redirect(redirectTo);
}

// 2. Admin Logout Action
export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

// 3. Post Validation Schema (lenient to prevent blocking user save)
const PostSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  slug: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, "Content cannot be empty"),
  coverImage: z.string().optional().nullable(),
  categoryName: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED"]).default("DRAFT"),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
});

// 4. Create Post Action
export async function createPostAction(data: z.infer<typeof PostSchema>) {
  const authorId = await getAuthorId();

  const validated = PostSchema.parse(data);
  let slug = slugify(validated.slug || validated.title);
  if (!slug) slug = `article-${Date.now()}`;

  const readTime = calculateReadTime(validated.content);

  // If slug is duplicate, append timestamp to make unique
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  // Handle category
  let categoryId: number | null = null;
  if (validated.categoryName?.trim()) {
    const catSlug = slugify(validated.categoryName);
    const category = await prisma.category.upsert({
      where: { slug: catSlug },
      update: {},
      create: { name: validated.categoryName.trim(), slug: catSlug },
    });
    categoryId = category.id;
  }

  const isPublished = validated.status === "PUBLISHED" || validated.published === true;
  const currentStatus = isPublished ? "PUBLISHED" : validated.status || "DRAFT";

  // Clean excerpt
  let excerpt = validated.excerpt?.trim();
  if (!excerpt) {
    // Strip HTML tags for clean excerpt
    const plainText = validated.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    excerpt = plainText.slice(0, 150) || validated.title;
  }

  // Create Post in PostgreSQL
  const post = await prisma.post.create({
    data: {
      title: validated.title.trim(),
      slug,
      excerpt,
      content: validated.content,
      coverImage: validated.coverImage || null,
      status: currentStatus,
      published: isPublished,
      featured: validated.featured || false,
      readTime,
      metaTitle: validated.metaTitle || validated.title,
      metaDescription: validated.metaDescription || excerpt,
      canonicalUrl: validated.canonicalUrl || null,
      ogImage: validated.ogImage || validated.coverImage || null,
      publishedAt: isPublished ? new Date() : null,
      authorId,
      categoryId,
    },
  });

  // Handle Tags
  if (validated.tags?.trim()) {
    const tagNames = validated.tags.split(",").map((t) => t.trim()).filter(Boolean);
    for (const tagName of tagNames) {
      const tagSlug = slugify(tagName);
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: tagName, slug: tagSlug },
      });
      await prisma.postTag.upsert({
        where: { postId_tagId: { postId: post.id, tagId: tag.id } },
        update: {},
        create: { postId: post.id, tagId: tag.id },
      });
    }
  }

  safeRevalidate("/");
  safeRevalidate("/blog");
  safeRevalidate(`/blog/${slug}`);
  safeRevalidate("/admin");
  safeRevalidate("/admin/posts");
  return { success: true, slug: post.slug, id: post.id };
}

// 5. Update Post Action
export async function updatePostAction(id: string, data: z.infer<typeof PostSchema>) {
  await getAuthorId();

  const validated = PostSchema.parse(data);
  let slug = slugify(validated.slug || validated.title);
  if (!slug) slug = `article-${Date.now()}`;

  const readTime = calculateReadTime(validated.content);

  // Check unique slug for other posts
  const existing = await prisma.post.findFirst({
    where: { slug, NOT: { id } },
  });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  // Handle category
  let categoryId: number | null = null;
  if (validated.categoryName?.trim()) {
    const catSlug = slugify(validated.categoryName);
    const category = await prisma.category.upsert({
      where: { slug: catSlug },
      update: {},
      create: { name: validated.categoryName.trim(), slug: catSlug },
    });
    categoryId = category.id;
  }

  const currentPost = await prisma.post.findUnique({ where: { id } });
  const isPublished = validated.status === "PUBLISHED" || validated.published === true;
  const currentStatus = isPublished ? "PUBLISHED" : validated.status;
  const publishedAt = currentPost?.publishedAt || (isPublished ? new Date() : null);

  let excerpt = validated.excerpt?.trim();
  if (!excerpt) {
    const plainText = validated.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    excerpt = plainText.slice(0, 150) || validated.title;
  }

  const updated = await prisma.post.update({
    where: { id },
    data: {
      title: validated.title.trim(),
      slug,
      excerpt,
      content: validated.content,
      coverImage: validated.coverImage || null,
      status: currentStatus,
      published: isPublished,
      featured: validated.featured || false,
      readTime,
      metaTitle: validated.metaTitle || validated.title,
      metaDescription: validated.metaDescription || excerpt,
      canonicalUrl: validated.canonicalUrl || null,
      ogImage: validated.ogImage || validated.coverImage || null,
      publishedAt,
      categoryId,
    },
  });

  // Re-link tags
  await prisma.postTag.deleteMany({ where: { postId: id } });
  if (validated.tags?.trim()) {
    const tagNames = validated.tags.split(",").map((t) => t.trim()).filter(Boolean);
    for (const tagName of tagNames) {
      const tagSlug = slugify(tagName);
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: tagName, slug: tagSlug },
      });
      await prisma.postTag.upsert({
        where: { postId_tagId: { postId: id, tagId: tag.id } },
        update: {},
        create: { postId: id, tagId: tag.id },
      });
    }
  }

  safeRevalidate("/");
  safeRevalidate("/blog");
  safeRevalidate(`/blog/${slug}`);
  if (currentPost?.slug && currentPost.slug !== slug) {
    safeRevalidate(`/blog/${currentPost.slug}`);
  }
  safeRevalidate("/admin");
  safeRevalidate("/admin/posts");
  return { success: true, slug: updated.slug, id: updated.id };
}

// 6. Delete Post Action
export async function deletePostAction(id: string) {
  await getAuthorId();
  const post = await prisma.post.delete({ where: { id } });
  safeRevalidate("/");
  safeRevalidate("/blog");
  safeRevalidate(`/blog/${post.slug}`);
  safeRevalidate("/admin");
  safeRevalidate("/admin/posts");
  return { success: true };
}

// 7. Toggle Publish Action
export async function togglePublishAction(id: string) {
  await getAuthorId();
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");

  const newPublishedState = !post.published;
  const newStatus = newPublishedState ? "PUBLISHED" : "UNPUBLISHED";

  await prisma.post.update({
    where: { id },
    data: {
      published: newPublishedState,
      status: newStatus,
      publishedAt: newPublishedState ? post.publishedAt || new Date() : post.publishedAt,
    },
  });

  safeRevalidate("/");
  safeRevalidate("/blog");
  safeRevalidate(`/blog/${post.slug}`);
  safeRevalidate("/admin");
  safeRevalidate("/admin/posts");
  return { success: true, published: newPublishedState, status: newStatus };
}

// 8. Publish Post Explicit Action
export async function publishPostAction(id: string) {
  await getAuthorId();
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");

  await prisma.post.update({
    where: { id },
    data: {
      published: true,
      status: "PUBLISHED",
      publishedAt: post.publishedAt || new Date(),
    },
  });

  safeRevalidate("/");
  safeRevalidate("/blog");
  safeRevalidate(`/blog/${post.slug}`);
  safeRevalidate("/admin");
  safeRevalidate("/admin/posts");
  return { success: true, published: true, status: "PUBLISHED" };
}

// 9. Unpublish Post Explicit Action
export async function unpublishPostAction(id: string) {
  await getAuthorId();
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");

  await prisma.post.update({
    where: { id },
    data: {
      published: false,
      status: "UNPUBLISHED",
    },
  });

  safeRevalidate("/");
  safeRevalidate("/blog");
  safeRevalidate(`/blog/${post.slug}`);
  safeRevalidate("/admin");
  safeRevalidate("/admin/posts");
  return { success: true, published: false, status: "UNPUBLISHED" };
}

// 10. Increment View Count Action
export async function incrementViewsAction(slug: string) {
  try {
    await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch (err) {
    console.error("Failed to increment views:", err);
  }
}
