"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "./useReducedMotion";
import { ChevronRight, X } from "lucide-react";
import { announcement } from "@/lib/content";
import Link from "next/link";
import { EARLY_ACCESS_ID } from "./earlyAccess";
import { EASE } from "./motion";

function readDismissed() {
  try {
    return window.localStorage.getItem(announcement.storageKey) === "1";
  } catch {
    return false;
  }
}

export function AnnouncementPill() {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [ctaInView, setCtaInView] = useState(false);

  // Read storage after mount (never during render) and delay the entrance.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setDismissed(readDismissed());
      setReady(true);
    }, 1200);
    return () => window.clearTimeout(id);
  }, []);

  // Hide while the final CTA (with its own button) is on screen.
  useEffect(() => {
    const target = document.getElementById(EARLY_ACCESS_ID);
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => setCtaInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(announcement.storageKey, "1");
    } catch {
      /* storage unavailable: dismissal lasts for this visit only */
    }
  }

  const visible = ready && !dismissed && !ctaInView;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label="Announcement"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-fit max-w-[calc(100vw-32px)] items-center gap-1 rounded-full bg-bright py-1.5 pr-4 pl-1.5 text-[13px] text-black shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] sm:text-[14px]"
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label={announcement.dismissLabel}
            className="grid size-7 shrink-0 place-items-center rounded-full text-[#5C616B] transition-colors hover:bg-black/5 hover:text-black"
          >
            <X className="size-3.5" aria-hidden />
          </button>
          <span className="truncate font-medium">{announcement.text}</span>
          <Link
            href={announcement.href}
            className="ml-2 inline-flex shrink-0 items-center text-[#5C616B] transition-colors hover:text-black"
          >
            {announcement.link}
            <ChevronRight className="size-3.5" aria-hidden />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
