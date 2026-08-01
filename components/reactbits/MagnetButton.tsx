"use client";

import React, { useRef } from "react";
import { motion, useSpring } from "motion/react";

interface MagnetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  asChild?: boolean;
}

export function MagnetButton({
  children,
  className = "",
  strength = 0.35,
  asChild = false,
  ...props
}: MagnetButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className="inline-block"
    >
      <div className={className} {...(props as any)}>
        {children}
      </div>
    </motion.div>
  );
}
