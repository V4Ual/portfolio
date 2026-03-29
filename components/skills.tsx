"use client";
import { motion } from "motion/react";

export function Skills() {
  const skillCategories = [
    {
      category: "Frontend",
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Redux",
        "Framer Motion",
      ],
    },
    {
      category: "Backend",
      skills: [
        "Node.js",
        "Express.js",
        "Sequelize",
        "Drizzle",
        "REST APIs",
        "GraphQL",
        "SocketIo",
        "WebSockets",
      ],
    },
    {
      category: "Database",
      skills: ["MongoDB", "Mongoose", "MySQL", "Postgres"],
    },
    {
      category: "DevOps & Tools",
      skills: ["Docker", "AWS", "Git", "CI/CD", "Jest", "Postman"],
    },
    {
      category: "Languages",
      skills: ["JavaScript", "TypeScript", "Python", "SQL"],
    },
    {
      category: "Soft Skills",
      skills: ["Problem Solving", "Agile", "Code Review"],
    },
  ];

  return (
    <section id="skills" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12"
        >
          Skills & Technologies
        </motion.h2>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.category}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              transition={{ duration: 0.4 }}
              className="p-6 rounded-xl border border-border hover:bg-card/50 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-4 text-accent">
                {cat.category}
              </h3>

              {/* Skills Chips */}
              <motion.div
                className="flex flex-wrap gap-2"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
              >
                {cat.skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 },
                    }}
                    whileHover={{
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.2 }}
                    className="px-3 py-1 rounded-lg bg-primary/20 border border-primary/30 text-sm text-foreground hover:border-accent hover:bg-accent/10 transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
