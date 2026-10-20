import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";

export const metadata = {
  title: "Edit Article | Blog CMS",
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!post) {
    notFound();
  }

  const initialData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    published: post.published,
    featured: post.featured,
    categoryName: post.category?.name || "",
    tags: post.tags.map((t) => t.tag.name).join(", "),
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    canonicalUrl: post.canonicalUrl,
    ogImage: post.ogImage,
    status: post.status,
  };

  return <PostEditor initialData={initialData} />;
}
