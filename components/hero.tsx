"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { RotatingText } from "./reactbits/RotatingText";
import { ArrowRight, Github, Linkedin, Mail, Code, Terminal, Cpu, User } from "lucide-react";

export function Hero() {
  const [imgError, setImgError] = useState(false);

  const roles = [
    "PERN Stack Developer",
    "Full-Stack Architect",
    "Backend Systems Specialist",
    "React & Next.js Engineer",
  ];

  const stats = [
    { value: "3+", label: "Years Experience", icon: Terminal },
    { value: "5+", label: "Projects Completed", icon: Code },
    { value: "100%", label: "Code Quality", icon: Cpu },
  ];

  return (
    <section id="hero" className="relative pt-36 pb-20 px-6 max-w-6xl mx-auto overflow-hidden">
      {/* Background glow spot */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="grid lg:grid-cols-12 gap-12 items-center">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-8 text-left">
          {/* AVAILABILITY BADGE */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-xs font-semibold text-accent"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Available for Full-Time Roles & Projects</span>
          </motion.div>

          {/* MAIN HEADING */}
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground"
            >
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-accent via-cyan-300 to-primary bg-clip-text text-transparent">
                Vishal Sharma
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold text-muted-foreground flex items-center gap-2 flex-wrap"
            >
              <span>Passionate</span>
              <RotatingText texts={roles} interval={3000} className="font-extrabold" />
            </motion.div>
          </div>

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-2xl"
          >
            Full-Stack Developer specializing in building high-performance web applications using{" "}
            <span className="text-foreground font-semibold">PostgreSQL, Express.js, React, Node.js</span>, and{" "}
            <span className="text-foreground font-semibold">Next.js</span>. Experienced in architecting robust RESTful APIs, relational databases, and scalable user interfaces.
          </motion.p>

          {/* BUTTON GROUP */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <a
              href="#projects"
              className="group px-7 py-3.5 rounded-xl bg-accent text-accent-foreground font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all"
            >
              <span>Explore My Work</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#contact"
              className="px-6 py-3.5 rounded-xl bg-card border border-border hover:border-accent/60 text-foreground font-semibold transition-all"
            >
              Contact Me
            </a>

            {/* Social quick icons */}
            <div className="flex items-center gap-2 pl-2">
              <a
                href="https://github.com/V4Ual"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-card border border-border hover:border-accent text-muted-foreground hover:text-accent transition-all"
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/vishal-sharma-6639a322a/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-card border border-border hover:border-accent text-muted-foreground hover:text-accent transition-all"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* STATS STRIP */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-accent" />
                    <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* RIGHT COLUMN: CLEAN PROFILE IMAGE CARD */}
        <div className="lg:col-span-5 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full max-w-sm"
          >
            <div className="relative rounded-2xl p-2.5 bg-card border border-border shadow-2xl overflow-hidden group">
              <div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-card">
                {!imgError ? (
                  <Image
                    src="/photo.png"
                    alt="Vishal Sharma"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 400px"
                    onError={() => setImgError(true)}
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-card text-muted-foreground gap-2">
                    <User className="w-16 h-16 text-accent" />
                    <span className="text-sm font-semibold">Vishal Sharma</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />

                {/* BOTTOM OVERLAY */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-card/85 backdrop-blur-md border border-border/80 text-left space-y-0.5">
                  <p className="text-xs text-accent font-semibold uppercase tracking-wider">
                    Software Engineer
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    Node.js • Express • React • MySQL
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
