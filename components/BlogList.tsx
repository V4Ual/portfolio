import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

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
        <article
          key={blog.id}
          className="group relative rounded-2xl p-6 bg-card border border-border hover:border-accent/60 transition-all duration-300 shadow-sm hover:shadow-lg"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <time dateTime={blog.publishedAt}>
                {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
              <Link href={`/blog/${blog.slug}`} className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                {blog.title}
              </Link>
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {blog.description}
            </p>

            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-accent">
              <span>Read Full Article</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default BlogList;
