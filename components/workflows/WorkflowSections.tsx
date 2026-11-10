import { controls, howItWorks, templates } from "@/lib/workflows";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeader } from "@/components/landing/SectionHeader";

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="container-page pt-32 md:pt-40">
      <SectionHeader
        id="how-title"
        eyebrow={howItWorks.eyebrow}
        titleLines={howItWorks.titleLines}
      />
      <ol className="mt-14 grid gap-2 md:mt-20 md:grid-cols-3">
        {howItWorks.steps.map((s, i) => (
          <li key={s.title}>
            <Reveal delay={i * 0.08} className="h-full">
              <div className="card flex h-full flex-col gap-10 bg-[#0E0F11] p-6 md:p-7">
                <div className="flex items-center justify-between">
                  <span className="grid size-8 place-items-center rounded-lg border border-line bg-surface-2 text-muted-fg">
                    <s.icon className="size-4" aria-hidden />
                  </span>
                  <span className="text-[12px] text-faint tabular-nums">
                    0{i + 1} · {s.label}
                  </span>
                </div>
                <div>
                  <h3 className="text-[17px] font-medium text-fg">{s.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-[1.5] text-muted-fg">
                    {s.body}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Templates() {
  return (
    <section
      id="templates"
      aria-labelledby="templates-title"
      className="container-page scroll-mt-24 pt-32 md:pt-40"
    >
      <SectionHeader
        id="templates-title"
        eyebrow={templates.eyebrow}
        titleLines={templates.titleLines}
      />
      <ul className="mt-14 grid gap-2 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
        {templates.items.map((t, i) => (
          <li key={t.title}>
            <Reveal delay={(i % 3) * 0.06} className="h-full">
              <article className="card flex h-full flex-col bg-[#0E0F11]">
                <div className="flex items-center gap-3 p-6 pb-5 md:p-7 md:pb-5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-muted-fg">
                    <t.icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="text-[17px] font-medium text-fg">{t.title}</h3>
                </div>
                <div className="mt-auto border-t border-line p-6 pt-5 md:p-7 md:pt-5">
                  <p className="text-[12px] text-faint">
                    {templates.triggerLabel}{" "}
                    <span className="text-muted-fg">{t.trigger}</span>
                  </p>
                  <ol className="mt-3 flex flex-col gap-2">
                    {t.steps.map((step, j) => (
                      <li
                        key={step}
                        className="flex items-center gap-2.5 text-[14px] text-muted-fg"
                      >
                        <span className="grid size-5 shrink-0 place-items-center rounded-full border border-line text-[10.5px] text-faint tabular-nums">
                          {j + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Controls() {
  return (
    <section
      aria-labelledby="controls-title"
      className="container-page pt-32 md:pt-40"
    >
      <SectionHeader
        id="controls-title"
        eyebrow={controls.eyebrow}
        titleLines={controls.titleLines}
      />
      <ul className="mt-14 grid gap-2 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
        {controls.items.map((item, i) => (
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
