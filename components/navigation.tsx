"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight, Code2 } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["about", "skills", "projects", "experience", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "About", href: "#about", id: "about" },
    { label: "Skills", href: "#skills", id: "skills" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "Experience", href: "#experience", id: "experience" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300">
      <nav
        className={`max-w-5xl mx-auto rounded-full px-6 py-3 transition-all duration-300 flex items-center justify-between border ${scrolled
          ? "bg-background/90 backdrop-blur-xl border-border/80 shadow-2xl shadow-black/40"
          : "bg-background/50 backdrop-blur-md border-border/40"
          }`}
      >
        {/* LOGO */}
        <Link href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-accent-foreground font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
            <Code2 className="w-4 h-4 text-background" />
          </div>
          <span className="font-bold text-base tracking-tight text-foreground">
            Vishal Sharma
          </span>
        </Link>

        {/* DESKTOP NAV ITEMS */}
        <div className="hidden md:flex items-center gap-1 bg-card/60 px-3 py-1.5 rounded-full border border-border/50">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`relative px-4 py-1 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-accent/15 border border-accent/30 rounded-full z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* ACTIONS */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/Vishal_Sharma_MERN.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-accent-foreground font-semibold text-xs tracking-wide shadow-md shadow-accent/15 hover:opacity-90 transition-all duration-200"
          >
            <span>Resume</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-full bg-card border border-border text-foreground hover:text-accent transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="md:hidden max-w-5xl mx-auto mt-2 rounded-2xl bg-card/95 backdrop-blur-2xl border border-border p-5 shadow-2xl space-y-3"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl hover:bg-muted text-foreground font-medium text-sm transition-colors flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="text-accent text-xs font-mono">↗</span>
                </a>
              ))}
              <a
                href="/Vishal_Sharma_MERN.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="mt-2 w-full py-2.5 rounded-xl bg-accent text-accent-foreground font-bold text-xs text-center block shadow-md shadow-accent/20"
              >
                Download Resume PDF
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
