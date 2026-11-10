import { ChevronsUpDown, PanelLeftClose } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockup } from "@/lib/content";

export function Sidebar() {
  return (
    <aside className="flex w-[196px] shrink-0 flex-col gap-4 border-r border-line bg-bg/40 px-3 py-3.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="grid size-5 place-items-center rounded-[5px] bg-fg text-[9px] font-semibold text-black">
            {mockup.orgInitials}
          </span>
          <span className="text-[13px] font-medium text-fg">{mockup.org}</span>
          <ChevronsUpDown className="size-3 text-faint" />
        </div>
        <PanelLeftClose className="size-3.5 text-faint" />
      </div>

      <nav className="flex flex-col gap-3.5">
        {mockup.sidebar.map((group, gi) => (
          <div key={gi} className="flex flex-col gap-0.5">
            {group.group && (
              <p className="px-2 pb-1 text-[11px] text-faint">{group.group}</p>
            )}
            {group.items.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-[5px] text-[12.5px]",
                  item.active
                    ? "bg-white/[0.06] text-fg"
                    : "text-muted-fg"
                )}
              >
                <span
                  className={cn(
                    "grid size-[18px] place-items-center rounded-[4px] border",
                    item.active
                      ? "border-line-strong bg-surface-2 text-fg"
                      : "border-line bg-surface-2/60 text-faint"
                  )}
                >
                  <item.icon className="size-2.5" />
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-[4px] bg-white/[0.08] px-1.5 text-[10.5px] text-fg tabular-nums">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
