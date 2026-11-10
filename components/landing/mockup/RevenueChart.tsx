"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "../useReducedMotion";
import { ChevronDown } from "lucide-react";
import { mockup } from "@/lib/content";
import { EASE } from "../motion";

export function RevenueChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const { chart } = mockup;

  return (
    <div className="flex flex-col px-5 py-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12.5px] font-medium text-fg">{chart.title}</p>
          <p className="mt-0.5 text-[11px] text-faint">{chart.subtitle}</p>
        </div>
        <span className="flex items-center gap-1 rounded-md border border-line bg-surface-2 px-2 py-1 text-[11px] text-muted-fg">
          {chart.period}
          <ChevronDown className="size-3" />
        </span>
      </div>

      <div
        ref={ref}
        className="mt-4 flex h-[132px] items-end gap-[3px] border-b border-line"
      >
        {chart.bars.map((h, i) => (
          <motion.span
            key={i}
            className="flex-1 origin-bottom rounded-t-[2px] bg-brand"
            style={{ height: `${h * 100}%`, opacity: 0.55 + h * 0.45 }}
            initial={reduce ? false : { scaleY: 0 }}
            animate={inView || reduce ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 1 + i * 0.012 }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10.5px] text-faint">
        {chart.axis.map((a) => (
          <span key={a}>{a}</span>
        ))}
      </div>
    </div>
  );
}
