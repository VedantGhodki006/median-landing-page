import { MARK_BOX, MARK_CELL, MARK_CELLS, MARK_RADIUS } from "@/lib/mark";

/** The Median mark, cropped to the glyph. Squares use currentColor. */
export function MedianMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`${MARK_BOX.x} ${MARK_BOX.y} ${MARK_BOX.width} ${MARK_BOX.height}`}
      className={className}
      aria-hidden
      focusable="false"
    >
      {MARK_CELLS.map((c) => (
        <rect
          key={`${c.x}-${c.y}`}
          x={c.x}
          y={c.y}
          width={MARK_CELL}
          height={MARK_CELL}
          rx={MARK_RADIUS}
          fill={c.accent ? "var(--accent)" : "currentColor"}
        />
      ))}
    </svg>
  );
}
