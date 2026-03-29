import BlogList, { Blog } from "../../components/BlogList";

// import BlogList from "../../components/BlogList";

export default function BlogLayout({ children }) {
  const blogs = [
    {
      id: 1,
      title: "Learn Next.js Basics",
      description: "A beginner-friendly guide to Next.js",
      slug: "learn-nextjs-basics",
      publishedAt: "2024-02-01",
    },
    {
      id: 2,
      title: "TypeScript with React",
      description: "Why TypeScript makes React better",
      slug: "typescript-with-react",
      publishedAt: "2024-02-05",
    },
  ];
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Latest Blogs</h1>
      <BlogList blogs={blogs} />
    </main>
  );
}
