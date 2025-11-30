export function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Building Scalable APIs with Node.js and Express",
      excerpt:
        "A deep dive into creating production-ready REST APIs with proper error handling, validation, and performance optimization techniques.",
      date: "Dec 15, 2024",
      readTime: "8 min read",
      category: "Backend",
      link: "#",
    },
    {
      id: 2,
      title: "React Performance Optimization Techniques",
      excerpt:
        "Learn how to improve React application performance through code splitting, lazy loading, memoization, and other optimization strategies.",
      date: "Dec 10, 2024",
      readTime: "6 min read",
      category: "Frontend",
      link: "#",
    },
    {
      id: 3,
      title: "MongoDB Best Practices for Large-Scale Applications",
      excerpt:
        "Explore indexing strategies, query optimization, and data modeling approaches to build efficient MongoDB databases that scale.",
      date: "Dec 5, 2024",
      readTime: "10 min read",
      category: "Database",
      link: "#",
    },
  ]

  return (
    <section id="blog" className="py-20 px-6 bg-card/50 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">Latest Blog Posts</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <a
              key={post.id}
              href={post.link}
              className="p-6 rounded-xl border border-border hover:border-accent hover:bg-card transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-accent">{post.category}</span>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{post.date}</span>
                <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center mt-12">
          <a
            href="/blog"
            className="px-8 py-3 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors font-medium"
          >
            Read All Articles
          </a>
        </div>
      </div>
    </section>
  )
}
