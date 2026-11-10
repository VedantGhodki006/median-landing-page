import { india } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export function BuiltForIndia() {
  return (
    <section
      aria-labelledby="india-title"
      className="container-page pt-32 md:pt-40"
    >
      <SectionHeader
        id="india-title"
        eyebrow={india.eyebrow}
        titleLines={india.titleLines}
      />
      <ul className="mt-14 grid gap-2 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
        {india.items.map((item, i) => (
          <li key={item.title}>
            <Reveal delay={(i % 3) * 0.06} className="h-full">
              <div className="card flex h-full flex-col gap-4 bg-[#0E0F11] p-6 md:p-7">
                <span className="grid size-8 place-items-center rounded-lg border border-line bg-surface-2 text-muted-fg">
                  <item.icon className="size-4" aria-hidden />
                </span>
                <div>
                  <h3 className="text-[17px] font-medium text-fg">{item.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-[1.5] text-muted-fg">
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
