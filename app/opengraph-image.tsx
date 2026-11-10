import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { category, hero } from "@/lib/content";
import { MARK_BOX, MARK_CELL, MARK_CELLS, MARK_RADIUS } from "@/lib/mark";

export const alt = `Median — ${category}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans");
const [medium, semibold] = await Promise.all([
  readFile(join(fontDir, "Geist-Medium.ttf")),
  readFile(join(fontDir, "Geist-SemiBold.ttf")),
]);

export default async function Image() {
  const markHeight = 44;
  const markWidth = (MARK_BOX.width / MARK_BOX.height) * markHeight;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0B0C0E",
          color: "#EDEDEF",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg
            width={markWidth}
            height={markHeight}
            viewBox={`${MARK_BOX.x} ${MARK_BOX.y} ${MARK_BOX.width} ${MARK_BOX.height}`}
          >
            {MARK_CELLS.map((c) => (
              <rect
                key={`${c.x}-${c.y}`}
                x={c.x}
                y={c.y}
                width={MARK_CELL}
                height={MARK_CELL}
                rx={MARK_RADIUS}
                fill={c.accent ? "#6D78D5" : "#FFFFFF"}
              />
            ))}
          </svg>
          <span style={{ fontSize: 52, fontWeight: 600, letterSpacing: -1 }}>
            median
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 68,
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: -2.3,
            }}
          >
            {hero.titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          <span style={{ fontSize: 30, color: "#8A8F98" }}>{category}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: medium, weight: 500, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
      ],
    }
  );
}
