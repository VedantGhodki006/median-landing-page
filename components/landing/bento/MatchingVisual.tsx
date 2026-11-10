"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, FileText, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { bentoData } from "@/lib/content";
import { formatINR } from "@/lib/format";
import { EASE } from "../motion";
import { useLoop } from "./useLoop";

const m = bentoData.matching;
const STEPS = m.rows.length + 2;

export function MatchingVisual() {
  const { ref, step } = useLoop<HTMLDivElement>(STEPS, 650);

  return (
    <div
      ref={ref}
      className="w-full max-w-[320px] overflow-hidden rounded-[10px] border border-line bg-surface-2"
    >
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <FileText className="size-3.5 text-faint" aria-hidden />
        <span className="text-[11px] text-muted-fg">{m.file}</span>
      </div>
      <ul>
        {m.rows.map((r, i) => {
          const done = step > i;
          return (
            <li
              key={r.narration}
              className="flex h-9 items-center gap-2.5 border-b border-line px-3 last:border-b-0"
            >
              <span className="w-10 shrink-0 text-[10.5px] text-faint">{r.date}</span>
              <span className="min-w-0 flex-1 truncate font-mono text-[10.5px] text-muted-fg">
                {r.narration}
              </span>
              <span
                className={cn(
                  "text-[11px] tabular-nums",
                  r.amount < 0 ? "text-muted-fg" : "text-fg"
                )}
              >
                {r.amount < 0 ? "−" : ""}
                {formatINR(Math.abs(r.amount))}
              </span>
              {r.review ? (
                <span className="relative flex h-4 w-4 shrink-0 items-center justify-end">
                  <AnimatePresence>
                    {done && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="absolute right-0 flex items-center gap-1 rounded-full border border-line-strong bg-bg px-1.5 py-0.5 text-[9.5px] whitespace-nowrap text-muted-fg"
                      >
                        <Inbox className="size-2.5" aria-hidden />
                        {m.inboxLabel}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              ) : (
                <span className="grid size-4 shrink-0 place-items-center rounded-full border border-line">
                  <motion.span
                    initial={false}
                    animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.5 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="grid size-4 place-items-center rounded-full bg-white text-black"
                  >
                    <Check className="size-2.5" strokeWidth={3} aria-hidden />
                  </motion.span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
