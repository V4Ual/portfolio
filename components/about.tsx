"use client";
import { motion } from "motion/react";

export function About() {
  return (
    <section
      id="about"
      className="py-20 px-6 bg-card/50 border-y border-border"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12"
        >
          About Me
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* LEFT TEXT */}
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
          >
            {[1, 2].map((_, i) => (
              <motion.p
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -40 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.5 }}
                className="text-lg text-muted-foreground mb-6 leading-relaxed"
              >
                {i === 0
                  ? "I'm a passionate MERN Full-Stack Developer with 3+ years of experience building robust web applications. I specialize in creating scalable backend systems with Node.js and Express, combined with modern React frontends that deliver exceptional user experiences."
                  : "My expertise spans from architecting RESTful APIs and database design with Postgres to optimizing frontend performance and implementing responsive designs. I'm committed to writing clean, maintainable code and following industry best practices."}
              </motion.p>
            ))}
          </motion.div>

          {/* RIGHT CARDS */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="space-y-4"
          >
            {[
              {
                title: "Backend Expertise",
                desc: "Node.js, ExpressJs, NestJs, REST APIs, Microservices Architecture, Database Design, Authentication",
              },
              {
                title: "Frontend Mastery",
                desc: "React, Next.js, TypeScript, Redux Toolkit, Performance Optimization",
              },
              {
                title: "Database & DevOps",
                desc: "MongoDB, Postgres, MySql, Docker, AWS, CI/CD Pipelines, Git",
              },
              {
                title: "Additional Skills",
                desc: "GraphQL, Redis, RabbitMQ, Agile Methodologies",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                }}
                transition={{ duration: 0.4 }}
                className="p-4 rounded-lg border border-border hover:bg-card transition-colors cursor-pointer"
              >
                <h3 className="font-semibold text-accent mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
