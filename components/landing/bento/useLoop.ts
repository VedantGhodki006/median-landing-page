"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "../useReducedMotion";

/**
 * Cycles a step counter 0…steps-1 while the element is on screen.
 * Pauses offscreen; with reduced motion it pins to the final step.
 */
export function useLoop<T extends Element>(steps: number, intervalMs: number) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(
      () => setStep((s) => (s + 1) % steps),
      intervalMs
    );
    return () => window.clearInterval(id);
  }, [inView, reduce, steps, intervalMs]);

  return { ref, step: reduce ? steps - 1 : step, reduce: !!reduce };
}
