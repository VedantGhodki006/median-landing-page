"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { useReducedMotion } from "../useReducedMotion";
import { mockup } from "@/lib/content";
import { formatINR } from "@/lib/format";

function CountUp({ value, delay }: { value: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.4,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = formatINR(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, delay]);

  // Server renders the final value so no-JS and reduced-motion are complete.
  return (
    <span ref={ref} className="tabular-nums">
      {formatINR(value)}
    </span>
  );
}

export function KpiCards() {
  return (
    <div className="grid grid-cols-4 border-b border-line">
      {mockup.kpis.map((kpi, i) => (
        <div
          key={kpi.label}
          className="flex flex-col gap-1.5 border-r border-line px-5 py-4 last:border-r-0"
        >
          <p className="text-[11.5px] text-faint">{kpi.label}</p>
          <p className="text-[21px] font-medium tracking-[-0.02em] text-fg">
            <CountUp value={kpi.value} delay={0.9 + i * 0.08} />
          </p>
          <p className="text-[11px] text-faint">
            {kpi.trend && <span className="mr-1 text-muted-fg">{kpi.trend}</span>}
            {kpi.note}
          </p>
        </div>
      ))}
    </div>
  );
}
