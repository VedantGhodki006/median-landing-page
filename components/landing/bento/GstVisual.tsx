"use client";

import { motion } from "motion/react";
import { Download, FileJson } from "lucide-react";
import { cn } from "@/lib/utils";
import { bentoData } from "@/lib/content";
import { EASE } from "../motion";
import { useLoop } from "./useLoop";

const g = bentoData.gst;
const cells: (number | null)[] = [
  ...Array.from({ length: g.leadingBlanks }, () => null),
  ...Array.from({ length: g.days }, (_, i) => i + 1),
];

export function GstVisual() {
  // 0: highlight 11th · 1: highlight 20th · 2: file chip ready (hold)
  const { ref, step } = useLoop<HTMLDivElement>(3, 1300);
  const activeDay = step === 0 ? g.marked[0].day : g.marked[1].day;

  return (
    <div ref={ref} className="flex w-full max-w-[300px] flex-col items-center gap-4">
      <div className="w-full rounded-[10px] border border-line bg-surface-2 p-3">
        <p className="mb-2 text-[11.5px] text-muted-fg">{g.month}</p>
        <div className="grid grid-cols-7 gap-y-1 text-center text-[10.5px]">
          {g.weekdays.map((d, i) => (
            <span key={i} className="pb-1 text-faint">
              {d}
            </span>
          ))}
          {cells.map((day, i) => {
            const mark = g.marked.find((m) => m.day === day);
            return (
              <span
                key={i}
                className={cn(
                  "relative mx-auto grid size-6 place-items-center rounded-md tabular-nums",
                  day ? "text-muted-fg" : "",
                  mark && "border border-line-strong bg-white/[0.06] text-fg"
                )}
              >
                {day}
                {mark && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-[-3px] rounded-[8px] border border-white/50"
                    initial={false}
                    animate={{ opacity: activeDay === day ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                )}
              </span>
            );
          })}
        </div>
        <div className="mt-2 flex gap-3 border-t border-line pt-2 text-[10.5px] text-faint">
          {g.marked.map((m) => (
            <span key={m.day}>
              {m.day} · {m.label}
            </span>
          ))}
        </div>
      </div>
      <motion.span
        className="flex items-center gap-2 rounded-full border border-line-strong bg-surface-2 py-1.5 pr-1.5 pl-3 text-[12px] text-fg"
        initial={false}
        animate={{ opacity: step === 2 ? 1 : 0.6, y: step === 2 ? 0 : 2 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <FileJson className="size-3.5 text-muted-fg" aria-hidden />
        <span className="font-mono">{g.file}</span>
        <span
          className="grid size-6 place-items-center rounded-full bg-white/[0.08] text-muted-fg"
          aria-hidden
        >
          <Download className="size-3" />
        </span>
      </motion.span>
    </div>
  );
}
