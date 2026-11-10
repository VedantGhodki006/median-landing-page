import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { beforeAfter } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

function Column({
  title,
  items,
  after,
}: {
  title: string;
  items: string[];
  after?: boolean;
}) {
  return (
    <div
      className={cn(
        "card h-full p-6 md:p-8",
        after ? "bg-[#0E0F11]" : "bg-[#0C0D0F]"
      )}
    >
      <h3
        className={cn(
          "text-[17px] font-medium",
          after ? "text-fg" : "text-muted-fg"
        )}
      >
        {title}
      </h3>
      <ul className="mt-6 flex flex-col">
        {items.map((item, i) => (
          <li
            key={item}
            className={cn(
              "flex items-start gap-3 border-t border-line py-3.5 text-[15px] leading-[1.45]",
              after ? "text-fg" : "text-muted-fg"
            )}
          >
            {after ? (
              <span
                className={cn(
                  "mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full",
                  // The single accent tick: first "With Median" item only.
                  i === 0 ? "bg-brand text-white" : "bg-white/[0.08] text-fg"
                )}
              >
                <Check className="size-3" strokeWidth={2.5} aria-hidden />
              </span>
            ) : (
              <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full bg-white/[0.04] text-faint">
                <X className="size-3" strokeWidth={2.5} aria-hidden />
              </span>
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BeforeAfter() {
  return (
    <section
      aria-labelledby="before-after-title"
      className="container-page pt-32 md:pt-40"
    >
      <SectionHeader
        id="before-after-title"
        eyebrow={beforeAfter.eyebrow}
        titleLines={beforeAfter.titleLines}
      />
      <div className="mt-14 grid gap-2 md:mt-20 md:grid-cols-2">
        <Reveal className="h-full">
          <Column {...beforeAfter.before} />
        </Reveal>
        <Reveal className="h-full" delay={0.15}>
          <Column {...beforeAfter.after} after />
        </Reveal>
      </div>
    </section>
  );
}
