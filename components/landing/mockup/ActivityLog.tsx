"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "../useReducedMotion";
import { cn } from "@/lib/utils";
import { mockup } from "@/lib/content";

const CHAR_MS = 30;
const LINE_PAUSE_CHARS = 8; // brief pause between lines, measured in chars

export function ActivityLog() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const lines = mockup.activity.lines;

  // Each line occupies its length plus a pause on the shared "tick" timeline.
  const offsets: number[] = [];
  let total = 0;
  for (const l of lines) {
    offsets.push(total);
    total += l.text.length + LINE_PAUSE_CHARS;
  }

  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => {
      setTick((t) => {
        if (t >= total) {
          window.clearInterval(id);
          return t;
        }
        return t + 1;
      });
    }, CHAR_MS);
    return () => window.clearInterval(id);
  }, [inView, reduce, total]);

  const done = reduce ? total : tick;

  return (
    <div
      ref={ref}
      className="card overflow-hidden bg-[#0D0E10] font-mono text-[11.5px] leading-[1.65]"
    >
      <div className="flex items-center gap-1.5 border-b border-line px-3.5 py-2.5">
        <span className="size-2 rounded-full bg-white/10" />
        <span className="size-2 rounded-full bg-white/10" />
        <span className="size-2 rounded-full bg-white/10" />
        <span className="ml-2 font-sans text-[11px] text-faint">
          {mockup.activity.title}
        </span>
      </div>
      <div className="px-4 py-3">
        {lines.map((line, i) => {
          const shown = Math.max(0, Math.min(line.text.length, done - offsets[i]));
          const typing = shown > 0 && shown < line.text.length;
          const isLast = i === lines.length - 1;
          const finished = done >= total;
          return (
            <p
              key={i}
              className={cn(
                "truncate",
                line.kind === "cmd" ? "text-fg" : "text-muted-fg"
              )}
            >
              {line.kind === "cmd" && shown > 0 && (
                <span className="text-faint">$ </span>
              )}
              {line.text.slice(0, shown)}
              {(typing || (isLast && finished && !reduce)) && (
                <span className="ml-px inline-block h-[13px] w-[6px] translate-y-[2px] animate-pulse bg-white/60" />
              )}
              {shown === 0 && " "}
            </p>
          );
        })}
      </div>
    </div>
  );
}
