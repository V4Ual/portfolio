"use client";

import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export function ShinyText({
  text,
  disabled = false,
  speed = 5,
  className = "",
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-cyan-400 to-neutral-200 bg-[length:200%_100%] ${
        disabled ? "" : "animate-shine"
      } ${className}`}
      style={{
        animationDuration,
      }}
    >
      {text}
    </span>
  );
}
