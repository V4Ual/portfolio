"use client";

import React from "react";

interface StarBorderProps {
  as?: React.ElementType;
  className?: string;
  color?: string;
  speed?: string;
  children?: React.ReactNode;
}

export function StarBorder({
  as: Component = "div",
  className = "",
  color = "#06b6d4",
  speed = "6s",
  children,
  ...props
}: StarBorderProps) {
  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-xl p-[1px] ${className}`}
      {...props}
    >
      <div
        className="absolute inset-0 w-[300%] h-[300%] -translate-x-[33%] -translate-y-[33%] animate-spin-slow opacity-80 pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${color} 60deg, transparent 120deg)`,
          animationDuration: speed,
        }}
      />
      <div className="relative z-10 w-full h-full rounded-xl bg-card">
        {children}
      </div>
    </Component>
  );
}
