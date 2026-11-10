import { mockup } from "@/lib/content";
import { formatINR } from "@/lib/format";

export function RevenueStreams() {
  const { streams } = mockup;
  const total = streams.items.reduce((s, x) => s + x.value, 0);
  return (
    <div className="flex flex-col px-5 py-4">
      <p className="text-[12.5px] font-medium text-fg">{streams.title}</p>
      <p className="mt-0.5 text-[11px] text-faint">{streams.subtitle}</p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {streams.items.map((s) => (
          <li key={s.label} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-3 text-[11.5px]">
              <span className="truncate text-muted-fg">{s.label}</span>
              <span className="text-fg tabular-nums">{formatINR(s.value)}</span>
            </div>
            <div className="h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-white/40"
                style={{ width: `${(s.value / total) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
