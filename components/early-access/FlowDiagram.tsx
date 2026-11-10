"use client";

import type { ReactNode } from "react";
import { BookOpen } from "lucide-react";
import { requestAccess } from "@/lib/content";
import { MedianMark } from "@/components/landing/MedianMark";
import { useReducedMotion } from "@/components/landing/useReducedMotion";

const { diagram } = requestAccess;

/*
 * The diagram lives in a fixed W × H box that scales uniformly with the
 * panel, so the SVG lines, the pills and the tile share one coordinate system
 * and the pulse dots travel exactly along the drawn lines.
 */
const W = 560;
const H = 720;
const SOURCES = [108, 268, 448];
const SOURCE_Y = 150;
const PILL_HALF = 22;
const TILE = { y: 430, half: 48 };
const OUTPUT_Y = 640;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/* Curved feeds that converge on the tile's top edge, as in the books workflow. */
const sourceEdge = (x: number) =>
  `M${x} ${SOURCE_Y + PILL_HALF}C${x} 290 280 270 280 ${TILE.y - TILE.half}`;
const OUT_EDGE = `M280 ${TILE.y + TILE.half}V${OUTPUT_Y - PILL_HALF}`;
// One continuous run per source: into Median (passing under the tile) and out to the books.
const pulsePath = (x: number) => `${sourceEdge(x)}V${OUTPUT_Y - PILL_HALF}`;
const PULSE_DUR = 3.6;

function Pulse({ d, delay }: { d: string; delay: number }) {
  const timing = { dur: `${PULSE_DUR}s`, begin: `${delay}s`, repeatCount: "indefinite" };
  return (
    <circle r={4} fill="#6D78D5" opacity={0} style={{ filter: "drop-shadow(0 0 5px rgba(109,120,213,0.9))" }}>
      <animateMotion path={d} {...timing} />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" {...timing} />
    </circle>
  );
}

function Pill({ children, x, y }: { children: ReactNode; x: number; y: number }) {
  return (
    <div
      className="absolute flex -translate-1/2 items-center gap-1.5 rounded-full border border-line-strong bg-surface-2 py-2 pr-3.5 pl-3 text-[13px] xl:gap-2.5 xl:py-2.5 xl:pr-5 xl:pl-4 xl:text-[15px] w-max leading-tight text-fg shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)]"
      style={{ left: pct(x, W), top: pct(y, H) }}
    >
      {children}
    </div>
  );
}

export function FlowDiagram() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Texture and light */}
      <div className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000,transparent)]" />
      <div className="absolute top-1/2 left-1/2 h-[360px] w-[360px] -translate-1/2 rounded-full bg-brand-soft blur-[110px]" />

      {/* Construction guides along the panel's edge */}
      <div className="absolute inset-y-0 left-[7%] border-l border-dashed border-white/[0.09]" />
      <div className="absolute inset-y-0 left-[11%] border-l border-dashed border-white/[0.06]" />
      <div className="absolute inset-x-0 top-[7%] border-t border-dashed border-white/[0.09]" />

      <div className="absolute top-1/2 left-1/2 aspect-[560/720] w-[min(92%,560px)] -translate-1/2">
        {/* Guides framing the tile, running off the panel */}
        {[TILE.y - TILE.half, TILE.y + TILE.half].map((y) => (
          <div
            key={y}
            className="absolute -inset-x-[100vw] border-t border-dashed border-white/[0.05]"
            style={{ top: pct(y, H) }}
          />
        ))}
        {[280 - TILE.half, 280 + TILE.half].map((x) => (
          <div
            key={x}
            className="absolute -inset-y-[100vh] border-l border-dashed border-white/[0.05]"
            style={{ left: pct(x, W) }}
          />
        ))}

        <svg className="absolute inset-0 size-full overflow-visible" viewBox={`0 0 ${W} ${H}`}>
          {[...SOURCES.map(sourceEdge), OUT_EDGE].map((d) => (
            <path key={d} d={d} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
          ))}
          {!reduce &&
            SOURCES.map((x, i) => (
              <Pulse key={x} d={pulsePath(x)} delay={(i * PULSE_DUR) / SOURCES.length} />
            ))}
        </svg>

        {diagram.sources.map((s, i) => (
          <Pill key={s.name} x={SOURCES[i]} y={SOURCE_Y}>
            {s.logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- static SVG mark
              <img
                src={s.logo}
                alt=""
                className="h-4 w-auto opacity-90 brightness-0 invert"
                draggable={false}
              />
            ) : (
              s.icon && <s.icon className="size-4 shrink-0 text-muted-fg" aria-hidden />
            )}
            {/* A long name carries its own line break to keep the pill compact. */}
            <span className="whitespace-pre-line">{s.name}</span>
          </Pill>
        ))}

        {/* Median */}
        <div
          className="absolute grid size-24 -translate-1/2 place-items-center rounded-2xl border border-line-strong bg-surface-2 text-fg shadow-[0_24px_60px_-16px_rgba(0,0,0,0.9),0_0_0_6px_rgba(109,120,213,0.06),inset_0_1px_0_rgba(255,255,255,0.06)]"
          style={{ left: "50%", top: pct(TILE.y, H) }}
        >
          <MedianMark className="h-9 w-auto" />
          <span className="absolute -right-px -bottom-px size-8 rounded-br-2xl border-r border-b border-brand/70" />
        </div>

        <Pill x={280} y={OUTPUT_Y}>
          <BookOpen className="size-4 text-muted-fg" aria-hidden />
          {diagram.output}
        </Pill>
      </div>

      <p className="absolute right-[7%] bottom-[5%] left-[11%] pl-4 text-[12.5px] text-faint">
        {diagram.caption}
      </p>
    </div>
  );
}
