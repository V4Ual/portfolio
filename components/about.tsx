"use client";

import React from "react";
import { motion } from "motion/react";
import { Server, Layout, Database, Wrench, ShieldCheck, Zap } from "lucide-react";

export function About() {
  const highlights = [
    {
      title: "Backend & Microservices",
      icon: Server,
      desc: "Building high-throughput REST APIs and microservices using Node.js, Express.js, Nest.js, WebSockets, and Redis.",
    },
    {
      title: "Frontend Engineering",
      icon: Layout,
      desc: "Creating dynamic, responsive interfaces with React, Next.js App Router, TypeScript, and Redux Toolkit.",
    },
    {
      title: "Database Architecture",
      icon: Database,
      desc: "Designing relation & non-relational database schemas and query optimizations with MongoDB, MySQL, Postgres, and ORMs.",
    },
    {
      title: "DevOps & Cloud Integration",
      icon: Wrench,
      desc: "Streamlining Docker containerization, AWS cloud deployments (EC2, S3), CI/CD pipelines, and server monitoring.",
    },
  ];

  return (
    <section id="about" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* HEADING */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent text-xs font-bold tracking-widest uppercase">
              // Professional Background
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground"
          >
            About Me
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base leading-relaxed"
          >
            Full-stack engineer dedicated to writing clean code, architecting scalable backend APIs, and building intuitive user interfaces.
          </motion.p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT STORY CARD */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex"
          >
            <div className="p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-md flex flex-col justify-between h-full space-y-6">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Engineering Excellence
                  </h3>
                </div>

                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  With <span className="text-foreground font-semibold">3+ years of professional web development experience</span>, I have engineered scalable POS systems, SaaS store builders, and modern e-commerce storefronts.
                </p>

                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  I focus on modular code organization, REST API optimization, secure authentication, and delivering smooth user experiences.
                </p>
              </div>

              <div className="pt-6 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-foreground">
                    Production Ready Standards
                  </span>
                </div>
                <span className="text-xs font-mono text-accent">3+ Years Exp</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT HIGHLIGHT CARDS */}
          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <div className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md h-full flex flex-col justify-between space-y-3 hover:border-accent/40 transition-colors">
                    <div className="p-2.5 w-fit rounded-xl bg-muted border border-border text-accent">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-foreground">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
