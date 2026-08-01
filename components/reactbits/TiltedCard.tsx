"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring } from "motion/react";

interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number;
  scaleOnHover?: number;
  glareEnable?: boolean;
}

export function TiltedCard({
  children,
  className = "",
  maxRotation = 15,
  scaleOnHover = 1.04,
  glareEnable = true,
}: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });
  const scale = useSpring(1, { stiffness: 200, damping: 20 });

  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const px = mouseX / width;
    const py = mouseY / height;

    const rotY = (px - 0.5) * (maxRotation * 2);
    const rotX = (0.5 - py) * (maxRotation * 2);

    rotateX.set(rotX);
    rotateY.set(rotY);

    if (glareEnable) {
      setGlarePos({
        x: px * 100,
        y: py * 100,
        opacity: 0.3,
      });
    }
  };

  const handleMouseEnter = () => {
    scale.set(scaleOnHover);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      className={`relative cursor-pointer transition-shadow duration-300 ${className}`}
    >
      <div style={{ transform: "translateZ(20px)" }} className="relative z-10 w-full h-full">
        {children}
      </div>

      {glareEnable && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-20"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 80%)`,
          }}
        />
      )}
    </motion.div>
  );
}
