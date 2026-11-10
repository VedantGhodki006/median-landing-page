"use client";

import { motion } from "motion/react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { bentoData } from "@/lib/content";
import { EASE } from "../motion";
import { useLoop } from "./useLoop";

const d = bentoData.drop;
// 0: file hovering · 1: dropped · 2…5: rows sorted · 6: hold
const STEPS = d.rows.length + 3;

export function DropVisual() {
  const { ref, step } = useLoop<HTMLDivElement>(STEPS, 750);
  const dropped = step >= 1;

  return (
    <div ref={ref} className="flex w-full max-w-[380px] flex-col items-center gap-3">
      <div className="relative w-full rounded-[10px] border border-dashed border-line-strong bg-surface-2/40 px-3 pt-3 pb-2">
        <div className="flex h-9 items-center justify-center">
          <motion.span
            className="flex items-center gap-2 rounded-md border border-line-strong bg-surface-2 px-2.5 py-1.5 text-[11.5px] text-fg"
            initial={false}
            animate={{ y: dropped ? 0 : -18, opacity: dropped ? 1 : 0.55, scale: dropped ? 1 : 1.04 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <FileSpreadsheet className="size-3.5 text-muted-fg" aria-hidden />
            <span className="font-mono">{d.file}</span>
          </motion.span>
        </div>
        <motion.p
          className="mt-1 flex items-center justify-center gap-1.5 text-[10.5px] text-faint"
          initial={false}
          animate={{ opacity: dropped ? 0 : 1 }}
        >
          <Upload className="size-3" aria-hidden />
          {d.zone}
        </motion.p>
      </div>

      <ul className="flex w-full flex-col gap-1.5">
        {d.rows.map((r, i) => {
          const shown = step >= i + 2;
          return (
            <motion.li
              key={r.narration}
              className="flex items-center justify-between gap-3 rounded-md border border-line bg-surface-2 px-3 py-1.5"
              initial={false}
              animate={{ opacity: shown ? 1 : 0.12, y: shown ? 0 : -4 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <span className="truncate font-mono text-[10.5px] text-muted-fg">{r.narration}</span>
              <span className="shrink-0 rounded-full border border-line-strong px-2 py-0.5 text-[10.5px] text-fg">
                {r.category}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
