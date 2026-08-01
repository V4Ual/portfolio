"use client";

import React from "react";

interface DecryptedTextProps {
  text: string;
  className?: string;
  parentClassName?: string;
  animateOn?: "view" | "hover" | "mount";
  speed?: number;
  maxIterations?: number;
}

export function DecryptedText({
  text,
  className = "",
  parentClassName = "",
}: DecryptedTextProps) {
  return (
    <span className={`inline-block ${parentClassName}`}>
      <span className={className}>{text}</span>
    </span>
  );
}
