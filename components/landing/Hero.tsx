"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "./useReducedMotion";
import { hero } from "@/lib/content";
import { IntegrationsMarquee } from "./IntegrationsMarquee";
import { ProductMockup } from "./ProductMockup";
import { CtaButton } from "./Nav";
import { EASE } from "./motion";

function useFadeIn() {
  const reduce = useReducedMotion();
  return (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 12, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.7, ease: EASE, delay: 0.1 + i * 0.08 },
  });
}

/** Faint construction lines behind the hero, as in the reference. */
function GuideLines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="container-page relative h-full">
        <div className="absolute inset-y-0 left-1/3 w-px bg-gradient-to-b from-white/[0.05] via-white/[0.04] to-transparent" />
        <div className="absolute inset-y-0 left-2/3 w-px bg-gradient-to-b from-white/[0.05] via-white/[0.04] to-transparent" />
      </div>
      <div className="absolute inset-x-0 top-[420px] h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent md:top-[490px]" />
      <div className="absolute top-0 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[120px]" />
    </div>
  );
}

/** The audience at the end of the H1, swapped on a fixed beat. */
function Audience() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % hero.audiences.length),
      hero.audienceMs
    );
    return () => window.clearInterval(id);
  }, []);

  const word = hero.audiences[index];
  return (
    // Padding plus a matching negative margin keeps descenders inside the clip.
    <span className="relative -mb-[0.14em] block overflow-hidden pb-[0.14em]">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          className="block whitespace-nowrap"
          initial={reduce ? { opacity: 0 } : { y: "100%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={reduce ? { opacity: 0 } : { y: "-100%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: reduce ? 0.3 : 0.6, ease: EASE }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero({ figure }: { figure: ReactNode }) {
  const fade = useFadeIn();
  const [first, ...rest] = hero.titleLead.split(" ");
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate pt-28 md:pt-36"
    >
      <GuideLines />
      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-4">
          <div className="flex flex-col">
            <h1 id="hero-title" className="h1 hero-title">
              <span className="sr-only">
                {hero.titleLead} {hero.audiences.join(", ")}
              </span>
              <span aria-hidden>
                <motion.span className="block" {...fade(0)}>
                  {first}
                </motion.span>
                <motion.span className="block" {...fade(1)}>
                  {rest.join(" ")}
                </motion.span>
                <motion.span className="block" {...fade(2)}>
                  <Audience />
                </motion.span>
              </span>
            </h1>
            <motion.p
              className="body-copy mt-6 max-w-[440px] md:text-[17px]"
              {...fade(3)}
            >
              {hero.sub}
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3"
              {...fade(4)}
            >
              <CtaButton className="h-10 px-4 text-[14px]" />
              <a
                href={hero.secondaryCta.href}
                className="group inline-flex items-center gap-1.5 text-[14px] text-muted-fg transition-colors hover:text-fg"
              >
                {hero.secondaryCta.label}
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            </motion.div>
          </div>

          <motion.div className="-mx-2 sm:mx-0" {...fade(3)}>
            {figure}
          </motion.div>
        </div>

        <motion.div {...fade(5)}>
          <IntegrationsMarquee />
        </motion.div>

        <ProductMockup />
      </div>
    </section>
  );
}
