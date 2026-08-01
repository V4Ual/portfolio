"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface RotatingTextProps {
  texts: string[];
  interval?: number;
  className?: string;
}

export function RotatingText({
  texts,
  interval = 3000,
  className = "",
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <div className="relative inline-flex overflow-hidden h-[1.3em] items-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`inline-block bg-gradient-to-r from-accent via-cyan-400 to-primary bg-clip-text text-transparent ${className}`}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
