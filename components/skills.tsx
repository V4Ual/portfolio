"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Code2,
  Server,
  Database,
  Cloud,
  Terminal,
  Search,
  Atom,
  Globe,
  FileCode,
  Palette,
  Layers,
  Zap,
  Cpu,
  ShieldCheck,
  Workflow,
  Radio,
  Table,
  Box,
  GitBranch,
  RefreshCw,
  Send,
} from "lucide-react";

export function Skills() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const skillCategories = [
    {
      category: "Frontend",
      icon: Code2,
      skills: [
        { name: "React", level: "Expert", icon: Atom },
        { name: "Next.js", level: "Advanced", icon: Globe },
        { name: "TypeScript", level: "Advanced", icon: FileCode },
        { name: "Tailwind CSS", level: "Expert", icon: Palette },
        { name: "Redux Toolkit", level: "Advanced", icon: Layers },
        { name: "Framer Motion", level: "Advanced", icon: Zap },
      ],
    },
    {
      category: "Backend",
      icon: Server,
      skills: [
        { name: "Node.js", level: "Expert", icon: Server },
        { name: "Express.js", level: "Expert", icon: Cpu },
        { name: "NestJS", level: "Intermediate", icon: ShieldCheck },
        { name: "RESTful APIs", level: "Expert", icon: Globe },
        { name: "GraphQL", level: "Intermediate", icon: Workflow },
        { name: "Socket.io", level: "Advanced", icon: Radio },
      ],
    },
    {
      category: "Databases & ORM",
      icon: Database,
      skills: [
        { name: "MongoDB", level: "Expert", icon: Database },
        { name: "Mongoose", level: "Expert", icon: Database },
        { name: "MySQL", level: "Advanced", icon: Database },
        { name: "PostgreSQL", level: "Advanced", icon: Database },
        { name: "Sequelize", level: "Advanced", icon: Table },
        { name: "Drizzle ORM", level: "Intermediate", icon: Table },
      ],
    },
    {
      category: "DevOps & Tools",
      icon: Cloud,
      skills: [
        { name: "Docker", level: "Advanced", icon: Box },
        { name: "AWS (EC2, S3)", level: "Intermediate", icon: Cloud },
        { name: "Git & GitHub", level: "Expert", icon: GitBranch },
        { name: "CI/CD", level: "Intermediate", icon: RefreshCw },
        { name: "Nginx", level: "Intermediate", icon: Server },
        { name: "Postman", level: "Expert", icon: Send },
      ],
    },
    {
      category: "Languages",
      icon: Terminal,
      skills: [
        { name: "JavaScript", level: "Expert", icon: Code2 },
        { name: "TypeScript", level: "Advanced", icon: FileCode },
        { name: "SQL", level: "Advanced", icon: Database },
        { name: "Python", level: "Basic", icon: Terminal },
      ],
    },
  ];

  const categories = ["All", ...skillCategories.map((c) => c.category)];

  const filteredCategories = skillCategories
    .map((cat) => {
      if (activeCategory !== "All" && cat.category !== activeCategory) {
        return null;
      }
      const filteredSkills = cat.skills.filter((skill) =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredSkills.length === 0) return null;
      return { ...cat, skills: filteredSkills };
    })
    .filter(Boolean);

  return (
    <section id="skills" className="py-24 px-6 relative bg-card/20 border-y border-border/60">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* HEADING */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent text-xs font-bold tracking-widest uppercase">
              // Core Competencies
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground"
          >
            Skills & Technologies
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base"
          >
            Technologies and frameworks I utilize to construct production-ready applications.
          </motion.p>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-full bg-card border border-border focus:border-accent text-xs text-foreground outline-none transition-colors"
            />
          </div>
        </div>

        {/* GRID */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((catGroup: any) => {
              const CategoryIcon = catGroup.icon;
              return (
                <motion.div
                  key={catGroup.category}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md h-full space-y-5">
                    <div className="flex items-center gap-3 border-b border-border/60 pb-3.5">
                      <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-base text-foreground">
                        {catGroup.category}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {catGroup.skills.map((skill: any) => {
                        const SkillIcon = skill.icon || Code2;
                        return (
                          <div
                            key={skill.name}
                            className="px-3 py-1.5 rounded-xl bg-muted/60 border border-border flex items-center gap-2 hover:border-accent/40 transition-colors group"
                          >
                            <SkillIcon className="w-3.5 h-3.5 text-accent group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold text-foreground">
                              {skill.name}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background text-muted-foreground">
                              {skill.level}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
