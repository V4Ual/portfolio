"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DecryptedText } from "./reactbits/DecryptedText";
import { MagnetButton } from "./reactbits/MagnetButton";
import { ArrowUp, Github, Linkedin, Mail, Heart, Code2 } from "lucide-react";

export function Footer() {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/80 bg-card/60 relative overflow-hidden py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* TOP ROW */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* BRAND */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-background font-bold text-sm">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-foreground tracking-wide">
                <DecryptedText
                  text="Vishal Sharma"
                  speed={40}
                  maxIterations={8}
                  animateOn="hover"
                  className="bg-gradient-to-r from-foreground via-cyan-300 to-accent bg-clip-text text-transparent"
                />
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm">
              PERN Stack Developer & Full-Stack Systems Engineer based in India.
            </p>
          </div>

          {/* REALTIME CLOCK & BACK TO TOP */}
          <div className="flex items-center gap-6">
            {timeString && (
              <div className="px-4 py-2 rounded-full bg-background border border-border text-xs font-mono text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>IST {timeString}</span>
              </div>
            )}

            <MagnetButton strength={0.4}>
              <button
                onClick={scrollToTop}
                aria-label="Back to Top"
                className="p-3.5 rounded-full bg-accent text-accent-foreground shadow-lg shadow-cyan-500/25 hover:opacity-90 transition-opacity"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </MagnetButton>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Vishal Sharma. Built with Next.js & React Bits.</p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/V4Ual"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              GitHub
            </a>
            <span>•</span>
            <a
              href="https://www.linkedin.com/in/vishal-sharma-6639a322a/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              LinkedIn
            </a>
            <span>•</span>
            <a
              href="mailto:visrma53@gmail.com"
              className="hover:text-accent transition-colors"
            >
              visrma53@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
