import { cn } from "@/lib/utils";
import type { StatusTone } from "@/lib/content";

/** "ok" (synced / matched) is one of the few places the accent is allowed. */
export function StatusChip({ tone, label }: { tone: StatusTone; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] whitespace-nowrap",
        tone === "ok"
          ? "bg-brand-soft text-[#B9BFF0]"
          : "bg-white/[0.06] text-muted-fg"
      )}
    >
      <span
        className={cn(
          "size-1 rounded-full",
          tone === "ok" ? "bg-brand" : "bg-muted-fg"
        )}
      />
      {label}
    </span>
  );
}
