"use client";
import { motion } from "motion/react";

export function Experience() {
  const experiences = [
    {
      id: 1,
      role: "MERN Stack Developer",
      company: "Webforest LLP.",
      period: "Aug 2025 - Present",
      description:
        "Joined as a MERN Stack Developer focusing on building scalable web applications.",
      achievements: [
        "Developed scalable MERN modules",
        "Optimized REST APIs and DB queries",
        "Collaborated with cross-functional teams",
        "Maintained code quality via reviews",
      ],
    },
    {
      id: 2,
      role: "Freelance Full-Stack Developer",
      company: "Xvantage Infotech",
      period: "Mar 2025 - Jul 2025",
      description:
        "Delivered end-to-end MERN applications with scalable solutions.",
      achievements: [
        "Delivered multiple client projects",
        "Handled full lifecycle: dev → deploy",
      ],
    },
    {
      id: 3,
      role: "Node.js Backend Developer",
      company: "White Orange Software",
      period: "Sep 2022 - Mar 2025",
      description: "Built robust APIs and improved backend performance.",
      achievements: [
        "Developed backend services",
        "Improved API performance",
        "Integrated third-party services",
        "Handled deployment & maintenance",
      ],
    },
  ];

  return (
    <section
      id="experience"
      className="py-20 px-6 bg-card/50 border-y border-border"
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-16 text-center"
        >
          Experience
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="absolute left-4 top-0 w-[2px] bg-accent"
          />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative pl-12"
              >
                {/* Dot */}
                <span className="absolute left-2 top-2 w-4 h-4 bg-accent rounded-full" />

                {/* Card */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="p-6 rounded-xl border border-border hover:bg-card transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-accent mb-1">
                        {exp.role}
                      </h3>
                      <p className="text-lg">{exp.company}</p>
                    </div>
                    <span className="text-muted-foreground mt-2 md:mt-0">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {exp.description}
                  </p>

                  {/* Achievements */}
                  <motion.ul
                    className="space-y-2"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                    }}
                  >
                    {exp.achievements.map((achievement, idx) => (
                      <motion.li
                        key={idx}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <span className="text-accent mt-1">✓</span>
                        <span>{achievement}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
