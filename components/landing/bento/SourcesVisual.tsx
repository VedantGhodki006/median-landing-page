"use client";

import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { bentoData } from "@/lib/content";
import { formatINR } from "@/lib/format";
import { EASE } from "../motion";
import { useLoop } from "./useLoop";

const s = bentoData.sources;
// Source chips sit at these y-positions in a 200-tall viewBox.
const ys = [28, 76, 124, 172];

export function SourcesVisual() {
  // One source "flows" into the books at a time.
  const { ref, step, reduce } = useLoop<HTMLDivElement>(s.items.length, 1200);

  return (
    <div ref={ref} className="relative h-[200px] w-full max-w-[420px]">
      <svg viewBox="0 0 420 200" className="absolute inset-0 h-full w-full" aria-hidden>
        {ys.map((y, i) => {
          const d = `M150 ${y} C214 ${y} 214 100 268 100`;
          const active = !reduce && step === i;
          return (
            <g key={y}>
              <path d={d} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={1} />
              <motion.path
                d={d}
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth={1}
                initial={false}
                animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            </g>
          );
        })}
      </svg>

      {s.items.map((label, i) => (
        <span
          key={label}
          className={cn(
            "absolute left-0 w-[150px] -translate-y-1/2 rounded-full border bg-surface-2 px-3 py-1.5 text-[12px] transition-colors duration-500",
            !reduce && step === i
              ? "border-line-strong text-fg"
              : "border-line text-muted-fg"
          )}
          style={{ top: `${(ys[i] / 200) * 100}%` }}
        >
          {label}
        </span>
      ))}

      <div className="absolute top-1/2 right-0 w-[152px] -translate-y-1/2 rounded-[10px] border border-line-strong bg-surface-2 p-3">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md border border-line bg-bg text-muted-fg">
            <BookOpen className="size-3" aria-hidden />
          </span>
          <span className="text-[12.5px] text-fg">{s.target}</span>
        </div>
        <p className="mt-3 text-[10.5px] text-faint">{s.totalLabel}</p>
        <p className="text-[15px] text-fg tabular-nums">{formatINR(s.total)}</p>
      </div>
    </div>
  );
}
