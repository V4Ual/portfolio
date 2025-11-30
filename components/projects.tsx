export function Projects() {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description:
        "Full-stack MERN e-commerce solution with Stripe integration, JWT authentication, MongoDB data persistence, and real-time inventory management.",
      tags: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
      github: "https://github.com",
      live: "https://example.com",
      image: "🛍️",
    },
    {
      id: 2,
      title: "Task Management SaaS",
      description:
        "Collaborative task management application built with MERN stack. Features include real-time updates, role-based access control, and advanced filtering.",
      tags: ["React", "Node.js", "MongoDB", "Socket.io", "JWT"],
      github: "https://github.com",
      live: "https://example.com",
      image: "✅",
    },
    {
      id: 3,
      title: "Analytics Dashboard",
      description:
        "Data visualization dashboard with real-time analytics. Built with React frontend, Node.js/Express API, and MongoDB for storing analytics data.",
      tags: ["React", "Chart.js", "Node.js", "MongoDB", "REST API"],
      github: "https://github.com",
      live: "https://example.com",
      image: "📊",
    },
    {
      id: 4,
      title: "Social Media Feed",
      description:
        "Full-featured social platform with user authentication, posts, comments, likes, and real-time notifications using MERN and WebSockets.",
      tags: ["React", "Node.js", "MongoDB", "WebSockets", "Cloudinary"],
      github: "https://github.com",
      live: "https://example.com",
      image: "💬",
    },
    {
      id: 5,
      title: "Content Management System",
      description:
        "Headless CMS with MERN architecture. Features include drag-and-drop builder, SEO optimization, and API-first approach for content delivery.",
      tags: ["Next.js", "Node.js", "MongoDB", "GraphQL", "Vercel"],
      github: "https://github.com",
      live: "https://example.com",
      image: "📝",
    },
    {
      id: 6,
      title: "Real-time Chat Application",
      description:
        "Messaging application with real-time communication using Socket.io, MongoDB for message persistence, and JWT for secure authentication.",
      tags: ["React", "Node.js", "MongoDB", "Socket.io", "JWT"],
      github: "https://github.com",
      live: "https://example.com",
      image: "💬",
    },
  ]

  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">Featured Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group p-6 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-accent transition-all duration-300 flex flex-col"
            >
              <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-6 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                <span className="text-6xl">{project.image}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground mb-4 text-sm flex-grow">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-primary/20 text-accent border border-accent/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <a
                  href={project.github}
                  className="flex-1 px-3 py-2 bg-primary/20 text-accent rounded-lg hover:bg-primary/30 transition-colors text-center text-sm font-medium"
                >
                  GitHub
                </a>
                <a
                  href={project.live}
                  className="flex-1 px-3 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity text-center text-sm font-medium"
                >
                  Live Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
