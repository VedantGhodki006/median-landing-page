"use client";

import { useEffect, useRef, type ReactNode } from "react";
import * as k from "@/components/iso/iso-kit";
import { BATCH, CYCLE, STILL_TIME, inr, poseAt, readoutOf, type Pose } from "./model";
import { CARD_COUNT, CARD_PITCH, CARD_REST_Z, CLIPS, FILES, P, SLOTS, DRAWER_OPEN } from "./view";
import { drawerBodyOf, needleOf, rodOf } from "./frame";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Finds the parts once, then writes attributes on them each frame. */
function bind(root: HTMLElement) {
  const $ = (id: string) => root.querySelector<SVGElement>(`[data-ld="${id}"]`);
  const parts = {
    card: $("card"),
    cardClip: $("card-clip"),
    carriage: $("carriage"),
    jawBack: $("jaw-back"),
    jawFront: $("jaw-front"),
    rodBelow: $("rod-below"),
    rodAbove: $("rod-above"),
    needle: $("needle"),
    display: $("display"),
    readerLed: $("reader-led"),
    carriageLed: $("carriage-led"),
    stacks: FILES.map((_, fi) => Array.from({ length: CARD_COUNT }, (_, j) => $(`stack-${fi}-${j + 1}`))),
    drawers: SLOTS.map((_, i) => $(`drawer-${i}`)),
    drawerBodies: SLOTS.map((_, i) => $(`drawer-body-${i}`)),
    readout: root.closest("figure")?.querySelector<HTMLElement>("[data-readout]") ?? null,
  };

  // Last written values, so unchanged parts are not touched.
  const memo = new Map<string, string>();
  const set = (el: Element | null, key: string, attr: string, value: string) => {
    if (!el || memo.get(key) === value) return;
    memo.set(key, value);
    if (attr === "html") el.innerHTML = value;
    else if (attr === "text") el.textContent = value;
    else el.setAttribute(attr, value);
  };

  return (pose: Pose) => {
    const { card } = pose;
    set(parts.carriage, "carriage", "transform", k.translateAlong(P, [pose.carriageX, 0, 0]));
    const jaw = k.translateAlong(P, [pose.carriageX, 0, pose.jawZ]);
    set(parts.jawBack, "jawB", "transform", jaw);
    set(parts.jawFront, "jawF", "transform", jaw);
    const rod = rodOf(pose.carriageX, pose.jawZ);
    set(parts.rodBelow, "rodB", "html", rod.below);
    set(parts.rodAbove, "rodA", "html", rod.above);

    set(parts.card, "cardShown", "style", card.shown ? "" : "display:none");
    set(parts.card, "cardAt", "transform", k.translateAlong(P, [card.x, 0, card.z]));
    set(parts.cardClip, "clip", "d", CLIPS[pose.clip]);
    set(parts.carriageLed, "cLed", "style", `opacity:${card.gripped ? 0.9 : 0}`);

    parts.stacks.forEach((cards, fi) => {
      const advance = pose.advance[fi];
      cards.forEach((el, j) => {
        const n = j + 1;
        const x = FILES[fi].x;
        set(el, `s${fi}-${n}`, "transform", k.translateAlong(P, [x, -(n - advance) * CARD_PITCH, CARD_REST_Z]));
        if (n === CARD_COUNT) set(el, `s${fi}-${n}o`, "opacity", advance.toFixed(3));
      });
    });

    pose.drawers.forEach((open, i) => {
      set(parts.drawers[i], `d${i}`, "transform", k.translateAlong(P, [0, open * DRAWER_OPEN, 0]));
      set(parts.drawerBodies[i], `db${i}`, "html", drawerBodyOf(i, open));
    });

    set(parts.needle, "needle", "d", needleOf(pose.posted));
    set(parts.readerLed, "rLed", "style", `opacity:${pose.led.toFixed(3)}`);

    const slip = BATCH[pose.slip];
    const display =
      pose.phase === "read" ? inr(slip.amount) : pose.phase === "matched" || (pose.phase === "travel" && pose.led > 0) ? "MATCHED" : "READY";
    set(parts.display, "display", "text", display);
    set(parts.readout, "readout", "text", readoutOf(pose));
  };
}

export function LedgerDeskLive({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const draw = bind(stage);
    const still = window.matchMedia(QUERY);

    let time = 0;
    let speed = 1; // eases toward `target`: 0 while held, 1 while running
    let target = 1;
    let hovered = false;
    let paused = false;
    let visible = false;
    let frame = 0;
    let last = 0;

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
      last = now;
      speed += (target - speed) * (1 - Math.exp(-dt / 0.22));
      if (Math.abs(target - speed) < 0.002) speed = target;
      time = (time + dt * speed) % CYCLE;
      draw(poseAt(time));
      frame = visible && !(speed === 0 && target === 0) ? requestAnimationFrame(tick) : 0;
    };
    const run = () => {
      if (still.matches) {
        draw(poseAt(STILL_TIME));
        return;
      }
      if (!frame && visible) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const steer = () => {
      target = hovered || paused ? 0 : 1;
      run();
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible) run();
        else if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(stage);

    const enter = () => {
      hovered = true;
      steer();
    };
    const leave = () => {
      hovered = false;
      steer();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key !== " " && event.key !== "Enter") return;
      event.preventDefault();
      paused = !paused;
      steer();
    };
    const motion = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (still.matches) draw(poseAt(STILL_TIME));
      else run();
    };
    stage.addEventListener("pointerenter", enter);
    stage.addEventListener("pointerleave", leave);
    stage.addEventListener("keydown", key);
    still.addEventListener("change", motion);

    draw(poseAt(still.matches ? STILL_TIME : 0));

    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
      stage.removeEventListener("pointerenter", enter);
      stage.removeEventListener("pointerleave", leave);
      stage.removeEventListener("keydown", key);
      still.removeEventListener("change", motion);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="ld-stage py-7"
      tabIndex={0}
      aria-label="Ledger desk animation. Press Space to pause or resume."
    >
      {children}
    </div>
  );
}
