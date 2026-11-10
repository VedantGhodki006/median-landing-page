"use client";

import { AnimatePresence, motion } from "motion/react";
import { ai } from "@/lib/content";
import { EASE } from "../motion";
import { useLoop } from "../bento/useLoop";

const STEPS = ai.sort.length + 2;

export function SortVisual() {
  const { ref, step } = useLoop<HTMLUListElement>(STEPS, 750);

  return (
    <ul ref={ref} className="flex w-full max-w-[300px] flex-col gap-1.5">
      {ai.sort.map((row, i) => {
        const sorted = step > i;
        return (
          <li
            key={row.raw}
            className="flex h-8 items-center overflow-hidden rounded-md border border-line bg-surface-2 px-3"
          >
            <AnimatePresence mode="wait" initial={false}>
              {sorted ? (
                <motion.span
                  key="label"
                  className="flex w-full items-center justify-between gap-2 text-[11.5px]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <span className="rounded-full border border-line-strong px-2 py-0.5 text-fg">
                    {row.label}
                  </span>
                  <span className="truncate font-mono text-[9.5px] text-faint">
                    {row.raw}
                  </span>
                </motion.span>
              ) : (
                <motion.span
                  key="raw"
                  className="truncate font-mono text-[10.5px] text-muted-fg"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {row.raw}
                </motion.span>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
