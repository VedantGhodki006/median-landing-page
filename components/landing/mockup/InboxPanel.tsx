import { Inbox } from "lucide-react";
import { mockup } from "@/lib/content";

export function InboxPanel() {
  const { inbox } = mockup;
  return (
    <div className="card overflow-hidden bg-surface-1/95 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <Inbox className="size-3.5 text-muted-fg" />
          <p className="text-[13px] font-medium text-fg">{inbox.title}</p>
        </div>
        <span className="text-[11px] text-faint">{inbox.count}</span>
      </div>
      <ul>
        {inbox.items.map((item) => (
          <li
            key={item.title}
            className="flex flex-col gap-2 border-b border-line px-4 py-3 last:border-b-0"
          >
            <div>
              <p className="text-[12px] text-fg">{item.title}</p>
              <p className="mt-0.5 text-[11.5px] leading-[1.45] text-muted-fg">
                {item.detail}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-[3px] w-14 overflow-hidden rounded-full bg-white/[0.08]">
                  <span
                    className="block h-full rounded-full bg-white/50"
                    style={{ width: `${item.confidence}%` }}
                  />
                </span>
                <span className="text-[11px] text-muted-fg tabular-nums">
                  {item.confidence}%
                </span>
              </div>
              <span className="rounded-md bg-bright px-2.5 py-1 text-[11px] font-medium text-black">
                {item.action}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
