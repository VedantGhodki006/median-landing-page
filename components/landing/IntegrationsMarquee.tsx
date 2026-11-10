import { integrations } from "@/lib/content";

const { fileDrop } = integrations;

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-14 pr-14 md:gap-20 md:pr-20"
      aria-hidden={hidden || undefined}
    >
      {integrations.items.map(({ name, logo, mark, height }) => (
        <li
          key={name}
          className="flex h-9 items-center gap-2 text-[19px] font-semibold tracking-[-0.02em] whitespace-nowrap text-[#6B7079]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG marks, no optimisation needed */}
          <img
            src={logo}
            alt={mark ? "" : name}
            style={{ height }}
            className="w-auto opacity-[0.42] brightness-0 invert"
            draggable={false}
          />
          {mark && name}
        </li>
      ))}
      <li className="flex h-9 items-center gap-2 text-[17px] font-medium tracking-[-0.01em] whitespace-nowrap text-[#6B7079]">
        <fileDrop.icon className="size-[18px]" strokeWidth={2.25} aria-hidden />
        {fileDrop.name}
      </li>
    </ul>
  );
}

export function IntegrationsMarquee() {
  return (
    <div className="mt-16 md:mt-20">
      <p className="text-center text-[13px] text-faint">{integrations.label}</p>
      <div className="mask-fade-x group mt-6 flex overflow-hidden">
        {/* Two identical rows translate -50% for a seamless loop. */}
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          <Row />
          <Row hidden />
        </div>
      </div>
    </div>
  );
}
