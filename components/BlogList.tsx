import Link from "next/link";

export interface Blog {
  id: number;
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
}

interface BlogListProps {
  blogs: Blog[];
}

const BlogList = ({ blogs }: BlogListProps) => {
  return (
    <div className="grid gap-6">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="border rounded-lg p-5 hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
          </h2>

          <p className="text-gray-600 mb-3">{blog.description}</p>

          <span className="text-sm text-gray-400">
            {new Date(blog.publishedAt).toDateString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
