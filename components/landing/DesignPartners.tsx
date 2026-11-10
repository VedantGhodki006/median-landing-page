import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { designPartners, type DesignPartnerCard } from "@/lib/content";
import { MARK_CELL, MARK_CELLS } from "@/lib/mark";
import { MedianMark } from "./MedianMark";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

// Dot grid over the 1024 icon artboard, centred on the mark.
const AREA = { x: 132, y: 132, size: 760 };
const STEP = 23;
const PAD = 6; // keep dots off the cells' rounded edges

const cellAt = (x: number, y: number) =>
  MARK_CELLS.find(
    (c) =>
      x > c.x + PAD &&
      x < c.x + MARK_CELL - PAD &&
      y > c.y + PAD &&
      y < c.y + MARK_CELL - PAD
  );

/** The Median mark rendered as a halftone: dots inside its cells are lit. */
function DottedMark() {
  const count = Math.floor(AREA.size / STEP);
  const dots: { x: number; y: number; lit: boolean; accent: boolean; o: number }[] = [];
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      const x = AREA.x + c * STEP + STEP / 2;
      const y = AREA.y + r * STEP + STEP / 2;
      const d = Math.hypot(x - 512, y - 512) / (AREA.size / 2);
      const cell = cellAt(x, y);
      const lit = !!cell;
      const accent = !!cell?.accent;
      dots.push({
        x,
        y,
        lit,
        accent,
        o: accent ? 1 : lit ? 0.9 - d * 0.25 : Math.max(0.04, 0.16 - d * 0.12),
      });
    }
  }
  return (
    <svg
      viewBox={`${AREA.x} ${AREA.y} ${AREA.size} ${AREA.size}`}
      className="h-full w-full"
      aria-hidden
    >
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.lit ? 4.6 : 3.2}
          fill={d.accent ? "var(--accent)" : "#fff"}
          opacity={d.o.toFixed(2)}
        />
      ))}
    </svg>
  );
}

function QuoteCard({ card, className }: { card: DesignPartnerCard; className?: string }) {
  const [lead, ...rest] = card.quote.split(". ");
  const tail = rest.join(". ");
  return (
    <figure
      className={cn(
        "card flex h-full flex-col justify-between gap-10 bg-[#0E0F11] p-6 md:p-8",
        className
      )}
    >
      <blockquote className="text-[20px] leading-[1.3] font-medium tracking-[-0.02em] text-fg md:text-[22px]">
        <p>
          “{tail ? `${lead}.` : lead}
          {tail && <span className="text-muted-fg"> {tail}</span>}”
        </p>
      </blockquote>
      <figcaption className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-full border border-line bg-surface-2 text-fg">
            <MedianMark className="h-2.5 w-auto" />
          </span>
          <span className="text-[14px] text-muted-fg">
            {card.kind === "principle"
              ? card.attribution
              : `${card.name}, ${card.role}`}
          </span>
        </span>
        <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] text-faint">
          {card.kind === "principle" ? designPartners.principleTag : card.company}
        </span>
      </figcaption>
    </figure>
  );
}

export function DesignPartners() {
  const { lead, cards } = designPartners;
  const [first, ...others] = cards;
  return (
    <section
      aria-labelledby="partners-title"
      className="container-page pt-32 md:pt-40"
    >
      <SectionHeader
        id="partners-title"
        eyebrow={designPartners.eyebrow}
        titleLines={designPartners.titleLines}
      />
      <div className="mt-14 grid gap-2 md:mt-20 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className="card grid h-full overflow-hidden bg-[#0E0F11] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="relative aspect-square max-h-[360px] w-full border-b border-line bg-bg md:aspect-auto md:max-h-none md:border-r md:border-b-0">
              <div className="absolute inset-6 md:inset-8">
                <DottedMark />
              </div>
            </div>
            <div className="flex flex-col justify-between gap-10 p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <p className="text-[26px] leading-[1.2] font-medium tracking-[-0.025em] text-fg md:text-[32px]">
                  {lead.title}
                </p>
                <span className="hidden shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] text-faint sm:inline">
                  {lead.badge}
                </span>
              </div>
              <div className="flex flex-col gap-5">
                <p className="body-copy max-w-[380px]">{lead.body}</p>
                <a
                  href={lead.href}
                  className="group inline-flex w-fit items-center gap-1 text-[14px] text-fg"
                >
                  {lead.linkLabel}
                  <ArrowUpRight
                    className="size-4 text-muted-fg transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <QuoteCard card={first} />
        </Reveal>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {others.map((card, i) => (
          <Reveal key={card.quote} delay={i * 0.08}>
            <QuoteCard card={card} className="min-h-[260px]" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
