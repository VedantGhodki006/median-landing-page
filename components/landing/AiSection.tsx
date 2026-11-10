import type { ReactNode } from "react";
import { ai } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { SortVisual } from "./ai/SortVisual";
import { MatchVisual } from "./ai/MatchVisual";
import { AskVisual } from "./ai/AskVisual";

const visuals: Record<(typeof ai.columns)[number]["id"], ReactNode> = {
  sort: <SortVisual />,
  match: <MatchVisual />,
  ask: <AskVisual />,
};

export function AiSection() {
  return (
    <section aria-labelledby="ai-title" className="container-page pt-32 md:pt-40">
      <SectionHeader id="ai-title" eyebrow={ai.eyebrow} titleLines={ai.titleLines} />

      <div className="mt-14 grid gap-2 md:mt-20 md:grid-cols-3">
        {ai.columns.map((col, i) => (
          <Reveal key={col.id} delay={i * 0.08} className="h-full">
            <article className="card flex h-full flex-col overflow-hidden bg-[#0E0F11]">
              <div
                aria-hidden
                className="mask-fade-card pointer-events-none flex h-[220px] items-center justify-center px-6 pt-6"
              >
                {visuals[col.id]}
              </div>
              <div className="p-6 pt-4 md:p-7 md:pt-4">
                <h3 className="text-[17px] font-medium text-fg">{col.title}</h3>
                <p className="mt-1.5 text-[14px] leading-[1.5] text-muted-fg">
                  {col.body}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
