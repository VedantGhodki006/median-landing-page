"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** With reduced motion, transforms jump straight to their end state. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
