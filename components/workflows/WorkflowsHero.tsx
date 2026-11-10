"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { workflowsHero } from "@/lib/workflows";
import { CtaButton } from "@/components/landing/Nav";
import { useReducedMotion } from "@/components/landing/useReducedMotion";
import { EASE } from "@/components/landing/motion";
import { WorkflowCanvas } from "./WorkflowCanvas";

function useFadeIn() {
  const reduce = useReducedMotion();
  return (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 12, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.7, ease: EASE, delay: 0.1 + i * 0.08 },
  });
}

export function WorkflowsHero() {
  const fade = useFadeIn();
  const { titleLines } = workflowsHero;
  return (
    <section
      id="top"
      aria-labelledby="workflows-title"
      className="relative isolate pt-32 md:pt-44"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[120px]"
      />
      <div className="container-page">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <motion.p className="text-[13px] text-faint" {...fade(0)}>
              {workflowsHero.eyebrow}
            </motion.p>
            <h1 id="workflows-title" className="h1 mt-5">
              {titleLines.map((line, i) => (
                <motion.span key={line} className="block" {...fade(i + 1)}>
                  {line}
                </motion.span>
              ))}
            </h1>
          </div>
          <motion.div
            className="flex flex-col gap-6"
            {...fade(titleLines.length + 1)}
          >
            <p className="body-copy md:text-[17px]">{workflowsHero.sub}</p>
            <div className="flex items-center gap-5">
              <CtaButton className="h-9 px-4 text-[14px]" />
              <a
                href={workflowsHero.secondary.href}
                className="group inline-flex items-center gap-1 text-[14px] text-muted-fg transition-colors hover:text-fg"
              >
                {workflowsHero.secondary.label}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 md:mt-20"
          {...fade(titleLines.length + 2)}
        >
          <WorkflowCanvas />
        </motion.div>
      </div>
    </section>
  );
}
