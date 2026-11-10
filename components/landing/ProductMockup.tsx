"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "./useReducedMotion";
import { mockup, hero } from "@/lib/content";
import { Sidebar } from "./mockup/Sidebar";
import { KpiCards } from "./mockup/KpiCards";
import { RevenueChart } from "./mockup/RevenueChart";
import { RevenueStreams } from "./mockup/RevenueStreams";
import { SourcesTable } from "./mockup/SourcesTable";
import { InboxPanel } from "./mockup/InboxPanel";
import { WorkflowCanvas } from "./mockup/WorkflowCanvas";
import { EASE } from "./motion";

function MainWindow() {
  const { header } = mockup;
  return (
    <div className="card flex h-full overflow-hidden bg-surface-1 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.04)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[16px] font-medium tracking-[-0.01em] text-fg">
                {header.title}
              </p>
              <span className="flex items-center gap-1 rounded-[5px] border border-brand/40 bg-brand-soft px-1.5 py-px text-[10.5px] text-[#B9BFF0]">
                <span className="size-1 animate-pulse rounded-full bg-brand motion-reduce:animate-none" />
                {header.badge}
              </span>
            </div>
            <p className="mt-0.5 text-[11.5px] text-faint">{header.subtitle}</p>
          </div>
          <div className="flex gap-1.5">
            <span className="h-6 w-16 rounded-md border border-line bg-surface-2" />
            <span className="h-6 w-6 rounded-md border border-line bg-surface-2" />
          </div>
        </div>
        <KpiCards />
        <div className="grid grid-cols-[1.45fr_1fr] border-b border-line">
          <div className="border-r border-line">
            <RevenueChart />
          </div>
          <RevenueStreams />
        </div>
        <SourcesTable />
      </div>
    </div>
  );
}

export function ProductMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Entry tilt (8° → 0) plus a residual scroll tilt that flattens as the
  // mockup scrolls toward the viewport centre.
  const entryTilt = useMotionValue(8);
  const scrollTilt = useTransform(scrollYProgress, [0.2, 0.5], [5, 0]);
  const rotateX = useTransform(
    [entryTilt, scrollTilt],
    ([a, b]: number[]) => a + b
  );

  useEffect(() => {
    if (reduce) return;
    const controls = animate(entryTilt, 0, {
      duration: 0.9,
      delay: 0.35,
      ease: EASE,
    });
    return () => controls.stop();
  }, [entryTilt, reduce]);
  const workflowY = useTransform(scrollYProgress, [0, 1], [30, -40]);
  const inboxY = useTransform(scrollYProgress, [0, 1], [50, -60]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={hero.mockupLabel}
      className="relative mt-16 md:mt-20"
    >
      {/* Desktop composition */}
      <motion.div
        aria-hidden
        className="relative hidden h-[800px] overflow-hidden [perspective:1800px] lg:block"
        initial={reduce ? false : { opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
      >
        <motion.div
          className="absolute inset-0 origin-top [transform-style:preserve-3d]"
          style={reduce ? undefined : { rotateX }}
        >
          <div className="absolute top-10 left-0 h-[740px] w-[71%]">
            <MainWindow />
          </div>

          <motion.div
            className="absolute top-0 right-0 w-[29%]"
            style={reduce ? undefined : { y: workflowY }}
          >
            <WorkflowCanvas />
          </motion.div>

          <motion.div
            className="absolute top-[340px] right-[3%] w-[33%] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
            style={reduce ? undefined : { y: inboxY }}
          >
            <InboxPanel />
          </motion.div>
        </motion.div>

        {/* Fade into the page, like the reference */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-bg" />
      </motion.div>

      {/* Mobile / tablet: scrollable, scaled main window only */}
      <motion.div
        className="relative -mx-6 lg:hidden"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
      >
        <div
          aria-hidden
          className="overflow-x-auto overscroll-x-contain px-6 pb-4 [scrollbar-width:none] md:-mx-6 md:px-12 [&::-webkit-scrollbar]:hidden"
        >
          <div className="h-[560px] w-[900px] [zoom:0.72] sm:[zoom:0.85]">
            <MainWindow />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-bg" />
      </motion.div>
    </div>
  );
}
