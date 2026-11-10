"use client";

import { useReducedMotion } from "../useReducedMotion";
import { mockup } from "@/lib/content";

const W = 360;
const H = 270;
const NODE_W = 148;
const NODE_H = 30;
const SRC_W = 80;
const SRC_H = 26;
const SRC_Y = 40;

const sourceXs = [46, 136, 226, 316];

type Node = {
  key: keyof typeof mockup.workflow.nodes;
  x: number;
  y: number;
  accent?: boolean;
  muted?: boolean;
};

const nodes: Node[] = [
  { key: "read", x: 180, y: 108 },
  { key: "match", x: 180, y: 162 },
  { key: "books", x: 96, y: 234, accent: true },
  { key: "branch", x: 266, y: 234, muted: true },
];

const top = (y: number, h = NODE_H) => y - h / 2;
const bottom = (y: number, h = NODE_H) => y + h / 2;

const sourceEdge = (x: number) =>
  `M${x} ${bottom(SRC_Y, SRC_H)} C${x} 74 180 66 180 ${top(108)}`;

const MATCH_EDGE = `M180 ${bottom(108)} V${top(162)}`;
const BOOKS_EDGE = `M180 ${bottom(162)} C180 204 96 192 96 ${top(234)}`;
const BRANCH_EDGE = `M180 ${bottom(162)} C180 204 266 192 266 ${top(234)}`;
// One continuous path from a source down to "Books updated".
const PULSE_PATH = `${sourceEdge(136)} V${bottom(162)} C180 204 96 192 96 ${top(234)}`;

const edge = { fill: "none", stroke: "rgba(255,255,255,0.18)", strokeWidth: 1 };

export function WorkflowCanvas() {
  const reduce = useReducedMotion();
  const { workflow } = mockup;

  return (
    <div className="card dot-grid overflow-hidden bg-[#0D0E10]">
      <div className="flex items-center justify-between border-b border-line bg-[#0D0E10] px-3.5 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-white/10" />
          <span className="size-2 rounded-full bg-white/10" />
          <span className="size-2 rounded-full bg-white/10" />
        </div>
        <span className="text-[11px] text-faint">{workflow.title}</span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full font-sans"
        aria-hidden
      >
        {/* edges */}
        {sourceXs.map((x) => (
          <path key={x} d={sourceEdge(x)} {...edge} />
        ))}
        <path d={MATCH_EDGE} {...edge} />
        <path d={BOOKS_EDGE} {...edge} />
        <path d={BRANCH_EDGE} {...edge} strokeDasharray="3 3" />

        {!reduce && (
          <circle r={3} fill="#6D78D5">
            <animateMotion
              dur="2.4s"
              repeatCount="indefinite"
              path={PULSE_PATH}
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.1;0.85;1"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </circle>
        )}

        {/* source nodes */}
        {workflow.sources.map((label, i) => (
          <g
            key={label}
            transform={`translate(${sourceXs[i] - SRC_W / 2} ${top(SRC_Y, SRC_H)})`}
          >
            <rect
              width={SRC_W}
              height={SRC_H}
              rx={6}
              fill="#16171A"
              stroke="rgba(255,255,255,0.12)"
            />
            <text
              x={SRC_W / 2}
              y={SRC_H / 2 + 3.5}
              textAnchor="middle"
              className="fill-muted-fg text-[9.5px]"
            >
              {label}
            </text>
          </g>
        ))}

        {/* pipeline nodes */}
        {nodes.map((n) => (
          <g
            key={n.key}
            transform={`translate(${n.x - NODE_W / 2} ${top(n.y)})`}
          >
            <rect
              width={NODE_W}
              height={NODE_H}
              rx={7}
              fill={n.accent ? "#1A1C2B" : "#16171A"}
              stroke={n.accent ? "#6D78D5" : "rgba(255,255,255,0.12)"}
              strokeWidth={1}
            />
            <circle
              cx={14}
              cy={NODE_H / 2}
              r={3}
              fill={n.accent ? "#6D78D5" : "rgba(255,255,255,0.3)"}
            />
            <text
              x={24}
              y={NODE_H / 2 + 3.5}
              className={
                n.muted ? "fill-muted-fg text-[10px]" : "fill-fg text-[10.5px]"
              }
            >
              {workflow.nodes[n.key]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
