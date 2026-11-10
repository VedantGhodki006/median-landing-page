import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { features, type FeatureCard } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { SourcesVisual } from "./bento/SourcesVisual";
import { DropVisual } from "./bento/DropVisual";
import { MatchingVisual } from "./bento/MatchingVisual";
import { GstVisual } from "./bento/GstVisual";
import { ReportsVisual } from "./bento/ReportsVisual";

const visuals: Record<FeatureCard["id"], ReactNode> = {
  sources: <SourcesVisual />,
  drop: <DropVisual />,
  matching: <MatchingVisual />,
  gst: <GstVisual />,
  reports: <ReportsVisual />,
};

function BentoCard({ card, large }: { card: FeatureCard; large?: boolean }) {
  return (
    <article
      className={cn(
        "card group relative flex h-full flex-col overflow-hidden bg-[#0E0F11] transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-line-strong",
        large ? "min-h-[440px] md:h-[460px]" : "min-h-[420px] md:h-[440px]"
      )}
    >
      <div className="flex items-start justify-between gap-4 p-6 md:p-7">
        <div>
          <p className="text-[12px] text-faint">{card.label}</p>
          <h3 className="mt-2 max-w-[320px] text-[17px] leading-[1.35] font-medium text-fg">
            {card.title}
          </h3>
          <p className="mt-1.5 max-w-[340px] text-[14px] leading-[1.5] text-muted-fg">
            {card.line}
          </p>
        </div>
        <a
          href={card.href}
          aria-label={`${features.openLabel} ${card.label}`}
          className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-muted-fg transition-colors after:absolute after:inset-0 hover:border-line-strong hover:text-fg"
        >
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
      <div
        aria-hidden
        className="mask-fade-card pointer-events-none flex flex-1 items-center justify-center px-6 pb-8"
      >
        {visuals[card.id]}
      </div>
    </article>
  );
}

export function FeatureBento() {
  const [a, b, ...rest] = features.cards;
  return (
    <section
      aria-labelledby="features-title"
      className="container-page pt-32 md:pt-40"
    >
      <SectionHeader
        id="features-title"
        eyebrow={features.eyebrow}
        titleLines={features.titleLines}
      />

      <div className="mt-14 flex flex-col gap-2 md:mt-20">
        <div className="grid gap-2 md:grid-cols-2">
          {[a, b].map((card, i) => (
            <Reveal key={card.id} delay={i * 0.08} className="h-full">
              <BentoCard card={card} large />
            </Reveal>
          ))}
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {rest.map((card, i) => (
            <Reveal key={card.id} delay={i * 0.08} className="h-full">
              <BentoCard card={card} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
