export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  // Format the slug into a readable title (e.g., "learn-nextjs" -> "Learn Nextjs")
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: title,
    description: `Read the latest blog post about ${title} on Vishal Sharma's blog.`,
    openGraph: {
      title: `${title} | Vishal Sharma`,
      description: `Read the latest blog post about ${title} on Vishal Sharma's blog.`,
      url: `/blog/${slug}`,
      type: "article",
    }
  };
}

export default function BlogDetailsPage() {
  return (
    <>
      <h1>new blog</h1>
    </>
  );
}
