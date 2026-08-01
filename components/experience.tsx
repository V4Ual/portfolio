"use client";

import React from "react";
import { motion } from "motion/react";
import { SpotlightCard } from "./reactbits/SpotlightCard";
import { DecryptedText } from "./reactbits/DecryptedText";
import { Briefcase, Calendar, MapPin, CheckCircle2, ArrowRight } from "lucide-react";

export function Experience() {
  const experiences = [
    {
      id: 1,
      role: "PERN Stack Developer",
      company: "Webforest LLP",
      location: "Surat, India",
      period: "Aug 2025 - Present",
      status: "Current Role",
      description:
        "Building end-to-end full-stack web modules, optimizing backend REST services, and engineering responsive React interfaces.",
      achievements: [
        "Architecting and delivering enterprise web applications including Telephonez (Apple Device Buy/Sell/Repair Hub) and AlmondStay (Luxury Villa Booking Platform).",
        "Architected scalable PERN modules handling complex business workflows and real-time state.",
        "Optimized PostgreSQL & MySQL queries, reducing API response latency by over 35%.",
        "Collaborated with cross-functional product and UI/UX engineering teams.",
      ],
      skills: ["Next.js", "React.js", "Node.js", "Express.js", "PostgreSQL", "Redis", "Sequelize", "Material UI", "Redux"],
    },
    {
      id: 2,
      role: "Freelance Full-Stack Developer",
      company: "Xvantage Infotech",
      location: "Remote / Contract",
      period: "Mar 2025 - Jul 2025",
      status: "Completed",
      description:
        "Delivered custom PERN stack solutions for international and domestic enterprise clients.",
      achievements: [
        "Built and deployed custom e-commerce engines and administrative control dashboards.",
        "Managed the full software development lifecycle from initial architecture to AWS cloud deployment.",
        "Integrated third-party payment gateways (Stripe), email providers, and web sockets.",
      ],
      skills: ["Next.js", "React", "Node.js", "Stripe", "AWS S3", "Tailwind CSS"],
    },
    {
      id: 3,
      role: "Node.js Backend Developer",
      company: "White Orange Software",
      location: "Surat, India",
      period: "Sep 2022 - Mar 2025",
      status: "2.5 Years Experience",
      description:
        "Specialized in backend service architecture, REST API engineering, and database optimization.",
      achievements: [
        "Developed high-throughput Node.js microservices serving thousands of active concurrent requests.",
        "Designed relational database schemas (MySQL, PostgreSQL) with optimized indexing strategies.",
        "Built OAuth2 authentication, JWT security layers, and rate-limiting middleware.",
        "Managed cloud server infrastructure, Docker deployment, and Nginx reverse proxy configuration.",
      ],
      skills: ["Node.js", "Express.js", "MySQL", "PostgreSQL", "Docker", "Nginx", "Redis"],
    },
  ];

  return (
    <section id="experience" className="py-24 px-6 relative overflow-hidden bg-card/20 border-y border-border/60">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* HEADING */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              // Career Roadmap
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          >
            Work{" "}
            <DecryptedText
              text="Experience"
              speed={40}
              maxIterations={10}
              animateOn="view"
              className="bg-gradient-to-r from-accent via-cyan-300 to-primary bg-clip-text text-transparent"
            />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            My professional journey as a full-stack developer across software agencies and freelance projects.
          </motion.p>
        </div>

        {/* TIMELINE WRAPPER */}
        <div className="relative pl-6 sm:pl-8 space-y-12">
          {/* VERTICAL TIMELINE GLOW LINE */}
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute left-2 sm:left-3 top-2 bottom-0 w-0.5 bg-gradient-to-b from-accent via-primary to-transparent shadow-[0_0_12px_rgba(6,182,212,0.8)]"
          />

          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative group"
            >
              {/* TIMELINE NODE DOT */}
              <div className="absolute -left-[23px] sm:-left-[27px] top-6 w-4 h-4 rounded-full bg-background border-2 border-accent group-hover:scale-125 group-hover:bg-accent transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.6)]" />

              <SpotlightCard className="p-6 sm:p-8 border border-border/80 bg-card/60 space-y-6">
                {/* HEADER ROW */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                  <div>
                    <span className="text-xs font-mono text-accent uppercase tracking-wider">
                      {exp.status}
                    </span>
                    <h3 className="text-2xl font-extrabold text-foreground group-hover:text-accent transition-colors">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-accent" />
                        {exp.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted border border-border text-xs font-mono text-accent w-fit">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {exp.description}
                </p>

                {/* ACHIEVEMENTS LIST */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono text-foreground uppercase tracking-wider font-semibold">
                    Key Highlights:
                  </h4>
                  <div className="space-y-2">
                    {exp.achievements.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SKILLS TAGS */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-3 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
