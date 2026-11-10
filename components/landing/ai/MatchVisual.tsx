"use client";

import { motion } from "motion/react";
import { ai } from "@/lib/content";
import { formatINR } from "@/lib/format";
import { EASE } from "../motion";
import { useLoop } from "../bento/useLoop";

const { left, right } = ai.match;
const STEPS = left.length + 2;
const ROW_Y = [20, 64, 108];

export function MatchVisual() {
  const { ref, step } = useLoop<HTMLDivElement>(STEPS, 800);

  return (
    <div ref={ref} className="relative h-[128px] w-full max-w-[320px]">
      <svg viewBox="0 0 320 128" className="absolute inset-0 h-full w-full" aria-hidden>
        {ROW_Y.map((y, i) => (
          <motion.path
            key={y}
            d={`M112 ${y} H184`}
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={1}
            initial={false}
            animate={{ pathLength: step > i ? 1 : 0, opacity: step > i ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        ))}
      </svg>
      {left.map((c, i) => (
        <span
          key={c.label}
          className="absolute left-0 flex w-[112px] -translate-y-1/2 items-center justify-between rounded-md border border-line bg-surface-2 px-2 py-1.5 text-[10.5px]"
          style={{ top: ROW_Y[i] }}
        >
          <span className="text-muted-fg">{c.label}</span>
          <span className="text-fg tabular-nums">{formatINR(c.amount)}</span>
        </span>
      ))}
      {right.map((c, i) => (
        <span
          key={c.label}
          className="absolute right-0 flex w-[136px] -translate-y-1/2 flex-col rounded-md border border-line bg-surface-2 px-2 py-1 text-[10.5px]"
          style={{ top: ROW_Y[i] }}
        >
          <span className="flex items-center justify-between gap-1.5">
            <span className="truncate text-muted-fg">{c.label}</span>
            <span className="text-fg tabular-nums">{formatINR(c.amount)}</span>
          </span>
          {c.note && (
            <motion.span
              className="text-[9.5px] text-faint"
              initial={false}
              animate={{ opacity: step > i ? 1 : 0 }}
            >
              {c.note}
            </motion.span>
          )}
        </span>
      ))}
    </div>
  );
}
