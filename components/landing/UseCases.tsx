import { ArrowRight } from "lucide-react";
import { useCases } from "@/lib/content";
import { Reveal } from "./Reveal";

export function UseCases() {
  return (
    <section
      aria-labelledby="use-cases-title"
      className="container-page pt-32 md:pt-40"
    >
      <Reveal>
        <h2 id="use-cases-title" className="text-[15px] text-muted-fg">
          {useCases.label}
        </h2>
      </Reveal>
      <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-14">
        {useCases.items.map((item, i) => {
          const [first, second] = item.title.split("\n");
          return (
            <li key={item.title}>
              <Reveal delay={(i % 4) * 0.06}>
                <a
                  href={item.href}
                  className="group flex flex-col gap-4 rounded-md lg:px-5"
                >
                  <span className="grid size-5 place-items-center rounded-[5px] bg-surface-2 text-muted-fg ring-1 ring-line">
                    <item.icon className="size-3" aria-hidden />
                  </span>
                  <span className="text-[20px] leading-[1.3] font-medium tracking-[-0.015em] text-muted-fg transition-colors duration-200 group-hover:text-fg md:text-[22px]">
                    {first}
                    <br />
                    <span className="whitespace-nowrap">
                      {second}
                      <ArrowRight
                        className="ml-1 inline size-[0.9em] -translate-y-px transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </span>
                </a>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
