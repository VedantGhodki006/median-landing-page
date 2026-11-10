import { cn } from "@/lib/utils";
import { brand } from "@/lib/content";
import { MedianMark } from "./MedianMark";

/** Mark + wordmark. The mark stands in for the "M", so the text reads
 *  "edian" right after it. Sized by font-size: the mark scales with the text. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-[0.06em] text-[20px] leading-none font-semibold tracking-[-0.02em] text-fg",
        className
      )}
    >
      <MedianMark className="h-[0.72em] w-auto shrink-0" />
      <span className="sr-only">{brand.name}</span>
      <span aria-hidden>{brand.name.slice(1)}</span>
    </span>
  );
}
