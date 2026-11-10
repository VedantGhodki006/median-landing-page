"use client";

import { motion } from "motion/react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { bentoData } from "@/lib/content";
import { formatINR } from "@/lib/format";
import { EASE } from "../motion";
import { useLoop } from "./useLoop";

const r = bentoData.reports;
// rows reveal one by one, then runway + board pack, then hold
const STEPS = r.rows.length + 3;

export function ReportsVisual() {
  const { ref, step } = useLoop<HTMLDivElement>(STEPS, 650);
  const ready = step >= r.rows.length;

  return (
    <div ref={ref} className="flex w-full max-w-[320px] flex-col items-center gap-4">
      <div className="w-full rounded-[10px] border border-line bg-surface-2">
        <p className="border-b border-line px-3 py-2 text-[11.5px] text-muted-fg">
          {r.title}
        </p>
        <ul className="px-3 py-1.5">
          {r.rows.map((row, i) => (
            <motion.li
              key={row.label}
              className={cn(
                "flex items-center justify-between py-1 text-[11px]",
                row.strong && "border-t border-line text-fg"
              )}
              initial={false}
              animate={{ opacity: step >= i ? 1 : 0.2 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <span className={row.strong ? "text-fg" : "text-muted-fg"}>{row.label}</span>
              <span className="tabular-nums text-fg">
                {row.value < 0 ? "−" : ""}
                {formatINR(Math.abs(row.value))}
              </span>
            </motion.li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-line px-3 py-2">
          <span className="text-[11px] text-faint">{r.runwayLabel}</span>
          <motion.span
            className="text-[14px] font-medium text-fg"
            initial={false}
            animate={{ opacity: ready ? 1 : 0.2 }}
          >
            {r.runway}
          </motion.span>
        </div>
      </div>
      <motion.span
        className="flex items-center gap-2 rounded-full border border-line-strong bg-surface-2 px-3 py-1.5 text-[12px] text-fg"
        initial={false}
        animate={{ opacity: ready ? 1 : 0.5, y: ready ? 0 : 3 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <FileText className="size-3.5 text-muted-fg" aria-hidden />
        {r.file}
      </motion.span>
    </div>
  );
}
