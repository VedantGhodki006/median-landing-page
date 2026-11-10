"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { ai } from "@/lib/content";
import { EASE } from "../motion";
import { useReducedMotion } from "../useReducedMotion";

const c = ai.chat;
const CHAR_MS = 22;
const ANSWER_DELAY_MS = 900;

export function AskYourBooks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    let id: number | undefined;
    const start = window.setTimeout(() => {
      id = window.setInterval(() => {
        setTyped((t) => {
          if (t >= c.answer.length) {
            window.clearInterval(id);
            return t;
          }
          return t + 1;
        });
      }, CHAR_MS);
    }, ANSWER_DELAY_MS);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, [inView, reduce]);

  const shown = reduce ? c.answer.length : typed;
  const asked = reduce || inView;
  const done = shown >= c.answer.length;

  return (
    <div ref={ref}>
      <div className="card bg-[#0E0F11] p-6 md:p-8">
        <h3 className="text-[17px] font-medium text-fg">{c.title}</h3>

        <div className="mt-8 flex flex-col gap-4" aria-live="polite">
          {/* Question */}
          <motion.div
            className="flex justify-end"
            initial={false}
            animate={{ opacity: asked ? 1 : 0, y: asked ? 0 : 8 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="max-w-[460px] rounded-[14px] rounded-br-[4px] bg-surface-2 px-4 py-2.5 text-[15px] text-fg ring-1 ring-line">
              <span className="sr-only">{c.youLabel}: </span>
              {c.question}
            </p>
          </motion.div>

          {/* Answer */}
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-line bg-surface-2"
              aria-hidden
            >
              <Sparkles className="size-3.5 text-brand" />
            </span>
            <div className="flex min-w-0 flex-col items-start gap-3">
              <p className="min-h-[1.5em] max-w-[560px] text-[15px] leading-[1.55] text-fg">
                <span className="sr-only">{c.medianLabel}: </span>
                {/* Full text for assistive tech; typed text is visual only. */}
                <span className="sr-only">{c.answer}</span>
                <span aria-hidden>
                  {c.answer.slice(0, shown)}
                  {asked && !done && (
                    <span className="ml-px inline-block h-[15px] w-[7px] translate-y-[2px] animate-pulse bg-white/60" />
                  )}
                </span>
              </p>
              <AnimatePresence>
                {done && (
                  <motion.a
                    href="#"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="group inline-flex items-center gap-1 rounded-full border border-line-strong px-3 py-1 text-[12.5px] text-muted-fg transition-colors hover:text-fg"
                  >
                    {c.link}
                    <ArrowRight
                      className="size-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </motion.a>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-[13px] text-faint">{c.sub}</p>
    </div>
  );
}
