"use client";

import { motion } from "motion/react";
import { HelpCircle } from "lucide-react";
import { ai } from "@/lib/content";
import { EASE } from "../motion";
import { useLoop } from "../bento/useLoop";

const a = ai.ask;

export function AskVisual() {
  // 0: item · 1: "Why?" highlighted · 2–3: reason tooltip (hold)
  const { ref, step } = useLoop<HTMLDivElement>(4, 1100);
  const open = step >= 2;

  return (
    <div ref={ref} className="w-full max-w-[300px]">
      <div className="rounded-[10px] border border-line bg-surface-2 p-3">
        <p className="text-[12px] text-fg">{a.title}</p>
        <p className="mt-0.5 text-[11px] text-muted-fg">{a.guess}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10.5px] text-faint">{a.confidenceLabel}</span>
          <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/[0.08]">
            <span
              className="block h-full rounded-full bg-white/50"
              style={{ width: `${a.confidence}%` }}
            />
          </span>
          <span className="text-[10.5px] text-muted-fg tabular-nums">
            {a.confidence}%
          </span>
          <motion.span
            className="flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10.5px]"
            initial={false}
            animate={{
              borderColor: step >= 1 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)",
              color: step >= 1 ? "#EDEDEF" : "#8A8F98",
            }}
          >
            <HelpCircle className="size-3" aria-hidden />
            {a.why}
          </motion.span>
        </div>
      </div>
      <motion.div
        className="ml-auto mt-2 w-[230px] rounded-[10px] border border-line-strong bg-bg p-3"
        initial={false}
        animate={{ opacity: open ? 1 : 0, y: open ? 0 : -4 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <p className="text-[11px] leading-[1.45] text-fg">{a.reason}</p>
        <p className="mt-1.5 font-mono text-[9.5px] text-faint">{a.source}</p>
      </motion.div>
    </div>
  );
}
