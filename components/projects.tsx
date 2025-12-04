import Image from "next/image"

export function Projects() {
  const projects = [
    {
      id: 1,
      title: "Byting Korner",
      description:
        "It is a POS system used to manage stock and inventory, with features for master-franchise and franchise management. It lets you track sales, monitor stock in real time across multiple outlets, control pricing, and manage franchise operations from one centralized dashboard.",
      tags: ["React", "Node.js", "MySQL", "Express"],
      // github: "https://github.com",
      live: "https://admin.bytingkorner.co.in/login",
      image: "/bk.png",
    },
    {
      id: 2,
      title: "ILONSI",
      description:
        "ILONSI empowers social media users to easily set up free online stores, offering a convenient subscription option for business owners.",
      tags: ["React", "Node.js", "MySQL", "Socket.io", "Stripe", 'express', 'Gigapay'],
      // github: "https://github.com",
      live: "https://app.ilonsi.com",
      image: "/ilonsi.jpg",
    },
    {
      id: 3,
      title: "Regionbox Store",
      description:
        "RegionBox Store is an online shop specializing in gaming controllers, gamepads, and custom-designed skins. The store focuses on providing gamers with high-quality, stylish, and durable products that improve gameplay and personalize the gaming experience",
      tags: ["Next.js", "Redux & Redux toolkit", "Node.js", "MySql", 'Stripe'],
      // github: "https://github.com",
      live: "https://regionbox-store.vercel.app/login/",
      image: "/regionbox-store.png",
    },

  ]

  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">Past Work</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group p-6 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-accent transition-all duration-300 flex flex-col"
            >
              <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-6 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                <span className="text-6xl">
                  <Image src={project.image} width={100} height={100} />
                </span>
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
                {/* <a
                  href={project.github}
                  className="flex-1 px-3 py-2 bg-primary/20 text-accent rounded-lg hover:bg-primary/30 transition-colors text-center text-sm font-medium"
                >
                  GitHub
                </a> */}
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
