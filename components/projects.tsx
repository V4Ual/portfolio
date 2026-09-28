"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { SpotlightCard } from "./reactbits/SpotlightCard";
import { DecryptedText } from "./reactbits/DecryptedText";
import { MagnetButton } from "./reactbits/MagnetButton";
import { ShinyText } from "./reactbits/ShinyText";
import { ExternalLink, Github, Sparkles, Layers, CheckCircle2, X } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  tags: string[];
  live: string;
  github?: string;
  image: string;
  highlights: string[];
}

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const handleImageError = (id: number) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const projects: Project[] = [
    {
      id: 1,
      title: "Telephonez",
      category: "E-Commerce & Service Hub",
      description:
        "Full-service Apple web application for buying certified pre-owned iPhones/iPads, trade-in device sales, and device repair bookings.",
      longDescription:
        "Telephonez is a specialized Apple hardware platform serving customers across Louisiana. Built with Next.js and Redux Toolkit, it features instant trade-in price valuation, device catalog filtering, dynamic repair appointment scheduling, and fast page loads optimized for conversion.",
      tags: ["Next.js", "React", "Redux Toolkit", "Node.js", "Express.js", "Tailwind CSS", 'Material UI'],
      live: "https://telephonez.com/",
      image: "/telephonez.png",
      highlights: [
        "Interactive instant trade-in quote estimation engine",
        "Comprehensive Apple device buy, sell, & repair workflow",
        "Server-side rendered dynamic pages optimized for search visibility",
        "Responsive dark-mode UI with custom cart and service scheduling",
      ],
    },
    {
      id: 2,
      title: "AlmondStay",
      category: "Hospitality & Vacation Rental SaaS",
      description:
        "Luxury private farmhouse and villa stay booking platform for family vacations, corporate retreats, and weekend getaways.",
      longDescription:
        "AlmondStay provides a premium reservation platform for curated private farmhouses and luxury villas. Built with Next.js and high-efficiency REST APIs, it features real-time date availability calendar checks, interactive high-res property photo galleries, stay duration price calculators, and guest amenity filter controls.",
      tags: ["Next.js", "React", "Node.js", "PostgreSQL", "Tailwind CSS", "REST API", 'Material UI', "Sequelize", 'Redis',],
      live: "https://almondstay.com/",
      image: "/almondstay.png",
      highlights: [
        "Real-time villa availability calendar and dynamic booking calculator",
        "High-definition interactive property gallery and amenity showcases",
        "Granular property search filters by guest capacity and luxury features",
        "High-performance Next.js backend API architecture",
      ],
    },
    {
      id: 3,
      title: "Byting Korner POS Platform",
      category: "Enterprise Full-Stack Application",
      description:
        "Comprehensive POS system for multi-location franchises managing stock, live inventory, centralized pricing, and multi-user access control.",
      longDescription:
        "Engineered for high availability in retail and restaurant environments, Byting Korner provides an intuitive POS interface backed by a robust MySQL and Node.js REST API. Features include real-time stock sync across multiple franchise locations, automated daily transaction reporting, role-based authorization, and instant sales analytics.",
      tags: ["React.js", "Node.js", "Express.js", "MySQL", "Sequelize ORM", "REST API"],
      live: "https://admin.bytingkorner.co.in/login",
      image: "/bk.png",
      highlights: [
        "Centralized multi-franchise inventory tracking",
        "Sub-second transactional API endpoints",
        "Role-based access management for franchise operators",
        "Automated daily sales metrics and PDF generation",
      ],
    },
    {
      id: 4,
      title: "ILONSI Store Builder",
      category: "SaaS E-Commerce Ecosystem",
      description:
        "SaaS platform enabling creators & merchants to launch customizable online storefronts with built-in subscription management and real-time chat.",
      longDescription:
        "ILONSI empowers sellers to spin up digital storefronts within minutes. Built with React and Node.js microservices, it handles subscription payments via Stripe, live customer support chat powered by Socket.io, and customizable store templates with detailed seller analytics dashboards.",
      tags: ["React.js", "Node.js", "MySQL", "Socket.io", "Stripe API", "Redux"],
      live: "https://app.ilonsi.com",
      image: "/ilonsi.jpg",
      highlights: [
        "Instant storefront setup and domain routing",
        "Stripe payment gateway integration with recurring billing",
        "Real-time WebSocket chat between buyer and store manager",
        "Scalable database architecture for multi-tenant data isolation",
      ],
    },
    {
      id: 5,
      title: "Regionbox Gaming Store",
      category: "Modern E-Commerce Storefront",
      description:
        "High-performance gaming e-commerce platform offering gaming gear, customized controllers, skins, and hardware accessories with slick UI.",
      longDescription:
        "Designed for gaming enthusiasts, Regionbox Store features a dark-themed, ultra-responsive storefront built with Next.js, Redux state management, and Node.js REST APIs. Integrated with secure Stripe payment processing, cart optimization, and live order tracking.",
      tags: ["Next.js", "React", "Redux Toolkit", "Node.js", "MySQL", "Tailwind CSS"],
      live: "https://regionbox-store.vercel.app/login/",
      image: "/regionbox-store.png",
      highlights: [
        "Next.js App Router for optimal SEO and instant page transitions",
        "Persistent cart and wishlist state management",
        "Optimized image loading and smooth checkout workflow",
        "Interactive controller customizer showcase",
      ],
    },
    {
      id: 6,
      title: "Liveza Real-Time Video Chat",
      category: "WebRTC & Real-Time Communication",
      description:
        "Instant 1-on-1 live random video chat web application with anonymous matchmaking, crystal-clear HD video/audio streaming, and WebRTC peer-to-peer protocols.",
      longDescription:
        "Liveza is a modern, anonymous live video communication platform connecting users worldwide for real-time 1-on-1 interactions. Engineered with low-latency WebRTC peer connections and real-time WebSocket signaling, the platform delivers high-definition video/audio streaming without registration requirements, with integrated responsive controls and seamless mobile-browser optimization.",
      tags: ["WebRTC", "Socket.io", "React", "Node.js", "Express.js", "Tailwind CSS"],
      live: "https://liveza.fun/",
      image: "/liveza.jpg",
      highlights: [
        "Low-latency WebRTC peer-to-peer audio and HD video streaming",
        "Instant stranger matchmaking powered by real-time WebSocket signaling",
        "100% anonymous calling with zero signup or authentication barrier",
        "Adaptive mobile-first layout with interactive camera & mic permission controls",
      ],
    },
  ];

  return (
    <section id="projects" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* HEADING */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              // Featured Case Studies
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          >
            Past{" "}
            <DecryptedText
              text="Projects & Work"
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
            Production web platforms I've architected and delivered for enterprise clients.
          </motion.p>
        </div>

        {/* PROJECTS GRID */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <SpotlightCard className="h-full flex flex-col justify-between overflow-hidden group border border-border/80 bg-card/60 hover:border-accent/60 transition-all duration-300">
                {/* IMAGE CONTAINER WITH ZOOM EFFECT */}
                <div className="relative w-full h-52 overflow-hidden bg-card">
                  <Image
                    src={failedImages[project.id] ? "/placeholder.jpg" : project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={() => handleImageError(project.id)}
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-90" />

                  {/* CATEGORY BADGE */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-xs font-medium text-accent">
                    {project.category}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* TAGS */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground font-mono">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Read Details</span>
                      <span>→</span>
                    </button>

                    <MagnetButton strength={0.25}>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:opacity-90 transition-opacity"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </MagnetButton>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* PROJECT DETAIL MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl space-y-6 z-10 scrollbar-thin"
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* MODAL IMAGE */}
              <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-border">
                <Image
                  src={failedImages[selectedProject.id] ? "/placeholder.jpg" : selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  onError={() => handleImageError(selectedProject.id)}
                  className="object-cover object-top"
                />
              </div>

              {/* MODAL HEADER */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-accent uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {selectedProject.title}
                </h3>
              </div>

              {/* DETAILED DESCRIPTION */}
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {selectedProject.longDescription}
              </p>

              {/* KEY HIGHLIGHTS */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Key Technical Accomplishments</span>
                </h4>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {selectedProject.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ALL TECH TAGS */}
              <div className="space-y-2">
                <h4 className="font-bold text-foreground text-sm">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-accent/10 border border-accent/30 text-accent font-mono text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <a
                  href={selectedProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-accent text-accent-foreground font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-opacity"
                >
                  <span>Visit Live Project</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
