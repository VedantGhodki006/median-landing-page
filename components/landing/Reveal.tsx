"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "./useReducedMotion";
import type { ReactNode } from "react";
import { EASE, revealViewport } from "./motion";

/** Fades + lifts its children in once when scrolled into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
