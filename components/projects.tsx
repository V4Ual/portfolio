"use client";
import { motion } from "motion/react";
import Image from "next/image";

export function Projects() {
  const projects = [
    {
      id: 1,
      title: "Byting Korner",
      description:
        "POS system to manage stock, franchises, pricing, and sales from a centralized dashboard.",
      tags: ["React", "Node.js", "MySQL", "Express"],
      live: "https://admin.bytingkorner.co.in/login",
      image: "/bk.png",
    },
    {
      id: 2,
      title: "ILONSI",
      description:
        "Platform to create free online stores with subscription-based business tools.",
      tags: ["React", "Node.js", "MySQL", "Socket.io", "Stripe"],
      live: "https://app.ilonsi.com",
      image: "/ilonsi.jpg",
    },
    {
      id: 3,
      title: "Regionbox Store",
      description:
        "Gaming store offering controllers, skins, and accessories with modern UI.",
      tags: ["Next.js", "Redux", "Node.js", "MySQL", "Stripe"],
      live: "https://regionbox-store.vercel.app/login/",
      image: "/regionbox-store.png",
    },
  ];

  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12"
        >
          Past Work
        </motion.h2>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.2 },
            },
          }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              transition={{ duration: 0.4 }}
              className="group rounded-xl border border-border bg-card/50 hover:bg-card hover:border-accent transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Image */}
              <div className="relative w-full h-48 overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center"
                >
                  <a
                    href={project.live}
                    className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium"
                  >
                    View Project
                  </a>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>

                <p className="text-muted-foreground mb-4 text-sm flex-grow">
                  {project.description}
                </p>

                {/* Tags */}
                <motion.div
                  className="flex flex-wrap gap-2 mb-4"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.05 },
                    },
                  }}
                >
                  {project.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        visible: { opacity: 1, scale: 1 },
                      }}
                      whileHover={{ scale: 1.1 }}
                      className="text-xs px-2 py-1 rounded-full bg-primary/20 text-accent border border-accent/20"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Button */}
                <motion.a
                  href={project.live}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 bg-accent text-accent-foreground rounded-lg text-center text-sm font-medium"
                >
                  Live Demo
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
