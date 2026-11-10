"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { canvas, workflowsHero, type CanvasEdge, type CanvasNode } from "@/lib/workflows";
import { StatusChip } from "@/components/landing/StatusChip";
import { useLoop } from "@/components/landing/bento/useLoop";
import { EASE } from "@/components/landing/motion";

const { nodes, edges, tools, board } = canvas;
const byId = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, CanvasNode>;
const LAST = Math.max(...nodes.map((n) => n.step));
// Idle, one step per stage, then two beats where the whole run reads as done.
const STEPS = LAST + 3;
const PORT = 12; // vertical offset of the two ports on an if or a merge

type State = "idle" | "running" | "done";
const stateOf = (n: CanvasNode, step: number): State =>
  step > n.step ? "done" : step === n.step ? "running" : "idle";

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

const midY = (n: CanvasNode) => n.y + n.h / 2;

function outPort(n: CanvasNode, out?: 0 | 1): [number, number] {
  const dy = n.type === "if" ? (out === 1 ? PORT : -PORT) : 0;
  return [n.x + n.w, midY(n) + dy];
}
function inPort(n: CanvasNode, input?: 0 | 1): [number, number] {
  const dy = n.type === "merge" ? (input === 1 ? PORT : -PORT) : 0;
  return [n.x, midY(n) + dy];
}

function edgePath(e: CanvasEdge) {
  const [x1, y1] = outPort(byId[e.from], e.out);
  const [x2, y2] = inPort(byId[e.to], e.in);
  const dx = Math.max(36, (x2 - x1) / 2);
  // On a straight, short link the count sits above the line, clear of the ports.
  const lift = Math.abs(y2 - y1) < 4 ? -13 : 0;
  return {
    d: `M${x1} ${y1}C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`,
    mid: [(x1 + x2) / 2, (y1 + y2) / 2 + lift] as const,
  };
}

const agent = nodes.find((n) => n.type === "agent")!;
const TOOL_R = 21;
const TOOL_Y = agent.y + agent.h + 86;
const TOOL_GAP = 84;
const toolX = (i: number) => agent.x + agent.w / 2 + (i - (tools.length - 1) / 2) * TOOL_GAP;

/** Scales the fixed-size board to the card; below a floor it scrolls sideways instead. */
function useBoardScale() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setScale(Math.min(1, Math.max(width / board.w, 0.62)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, scale };
}

/* ------------------------------------------------------------------ */
/* Parts                                                               */
/* ------------------------------------------------------------------ */

function NodeIcon({ node }: { node: CanvasNode }) {
  if (node.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static SVG mark
      <img
        src={node.logo}
        alt=""
        className="max-h-[18px] max-w-[24px] brightness-0 invert opacity-80"
        draggable={false}
      />
    );
  }
  const Icon = node.icon!;
  return <Icon className="size-[17px]" aria-hidden />;
}

function Port({ x, y, filled }: { x: number; y: number; filled: boolean }) {
  return (
    <span
      className={cn(
        "absolute size-[9px] -translate-1/2 rounded-full border transition-colors duration-500",
        filled ? "border-brand bg-brand" : "border-line-strong bg-[#0E0F11]"
      )}
      style={{ left: x, top: y }}
    />
  );
}

function Node({ node, state }: { node: CanvasNode; state: State }) {
  const isAgent = node.type === "agent";
  return (
    <div
      className="absolute"
      style={{ left: node.x, top: node.y, width: node.w, height: node.h }}
    >
      <div
        className={cn(
          "relative flex h-full items-center gap-3 border bg-[#141518] px-3 transition-[border-color,box-shadow] duration-500",
          node.type === "trigger" ? "rounded-l-[28px] rounded-r-[12px] pl-3.5" : "rounded-[12px]",
          state === "running"
            ? "border-brand/70 shadow-[0_0_0_4px_rgba(109,120,213,0.12)]"
            : state === "done"
              ? "border-line-strong"
              : "border-line"
        )}
      >
        <span
          className={cn(
            "grid shrink-0 place-items-center rounded-[9px] border border-line bg-[#0E0F11] text-fg",
            isAgent ? "size-10" : "size-9"
          )}
        >
          <NodeIcon node={node} />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[12.5px] leading-tight font-medium text-fg">
            {node.title}
          </span>
          <span className="mt-0.5 truncate text-[11px] text-faint">{node.sub}</span>
        </span>

        {node.type === "trigger" && (
          <Zap
            className="absolute -top-2 -left-2 size-4 rounded-full bg-[#0E0F11] p-0.5 text-muted-fg"
            aria-hidden
          />
        )}
        {/* Status badge */}
        <span className="absolute -top-2 -right-2">
          <AnimatePresence initial={false} mode="wait">
            {state === "running" && (
              <motion.span
                key="run"
                className="grid size-[18px] place-items-center rounded-full border border-brand/60 bg-[#0E0F11] text-brand"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <Loader2 className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />
              </motion.span>
            )}
            {state === "done" && (
              <motion.span
                key="done"
                className="grid size-[18px] place-items-center rounded-full bg-brand text-white"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <Check className="size-3" strokeWidth={3} aria-hidden />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>

      {/* Result under the node once it has run. */}
      <motion.span
        className="absolute top-full left-1 mt-1.5 font-mono text-[10.5px] whitespace-nowrap text-muted-fg"
        initial={false}
        animate={{ opacity: state === "done" ? 1 : 0, y: state === "done" ? 0 : -3 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {node.result}
      </motion.span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Canvas                                                              */
/* ------------------------------------------------------------------ */

/** A reconciliation workflow on a node canvas, executing node by node. */
export function WorkflowCanvas() {
  const { ref, step } = useLoop<HTMLDivElement>(STEPS, 1400);
  const { ref: boxRef, scale } = useBoardScale();
  const finished = step > LAST;
  const s = scale ?? 1;

  const ran = nodes.filter((n) => step > n.step);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={workflowsHero.canvasLabel}
      className="card overflow-hidden bg-[#0E0F11]"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 md:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="truncate text-[13px] font-medium text-fg">{canvas.name}</span>
          <StatusChip tone="ok" label={canvas.status} />
        </div>
        <div className="flex items-center gap-3" aria-hidden>
          <span className="hidden text-[12px] text-faint sm:inline">{canvas.runsLabel}</span>
          <span className="hidden rounded-md border border-line p-0.5 text-[11.5px] md:flex">
            <span className="rounded-[5px] bg-white/[0.06] px-2 py-0.5 text-fg">Editor</span>
            <span className="px-2 py-0.5 text-faint">Executions</span>
          </span>
        </div>
      </div>

      {/* Board */}
      <div ref={boxRef} className="dot-grid overflow-x-auto overflow-y-hidden">
        <div
          className={cn("relative transition-opacity duration-300", scale === null && "opacity-0")}
          style={{ width: board.w * s, height: board.h * s }}
        >
          <div
            className="absolute top-0 left-0 origin-top-left"
            style={{ width: board.w, height: board.h, transform: `scale(${s})` }}
          >
            {/* Connections */}
            <svg
              className="absolute inset-0 overflow-visible"
              width={board.w}
              height={board.h}
              viewBox={`0 0 ${board.w} ${board.h}`}
              aria-hidden
            >
              {edges.map((e) => {
                const { d } = edgePath(e);
                const to = byId[e.to];
                const flowing = step === to.step;
                const passed = step > to.step;
                return (
                  <g key={`${e.from}-${e.to}`}>
                    <path
                      d={d}
                      fill="none"
                      strokeWidth={1.5}
                      className="transition-[stroke] duration-500"
                      stroke={passed ? "rgba(109,120,213,0.55)" : "rgba(255,255,255,0.14)"}
                    />
                    {flowing && (
                      <path
                        d={d}
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth={2}
                        strokeDasharray="4 5"
                        strokeLinecap="round"
                        style={{ animation: "wf-flow 0.6s linear infinite" }}
                      />
                    )}
                  </g>
                );
              })}
              {/* Agent tools: dashed attachments under the agent. */}
              {tools.map((t, i) => (
                <path
                  key={t.label}
                  d={`M${agent.x + agent.w / 2 + (i - (tools.length - 1) / 2) * 52} ${agent.y + agent.h}L${toolX(i)} ${TOOL_Y - TOOL_R}`}
                  stroke={step === agent.step ? "var(--accent)" : "rgba(255,255,255,0.14)"}
                  strokeWidth={1}
                  strokeDasharray="2 4"
                  className="transition-[stroke] duration-500"
                />
              ))}
            </svg>

            {/* Item counts on the connections */}
            {edges.map((e) => {
              const { mid } = edgePath(e);
              const shown = step > byId[e.from].step;
              return (
                <motion.span
                  key={`${e.from}-${e.to}-items`}
                  className="absolute -translate-1/2 rounded-full border border-line bg-[#0E0F11] px-1.5 py-px font-mono text-[10px] whitespace-nowrap text-muted-fg"
                  style={{ left: mid[0], top: mid[1] }}
                  initial={false}
                  animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0.9 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {e.items}
                </motion.span>
              );
            })}

            {nodes.map((n) => (
              <Node key={n.id} node={n} state={stateOf(n, step)} />
            ))}

            {/* Ports */}
            {nodes.map((n) => {
              const done = step > n.step;
              const outs: (0 | 1 | undefined)[] = n.type === "if" ? [0, 1] : n.id === "inbox" || n.id === "post" ? [] : [undefined];
              const ins: (0 | 1 | undefined)[] = n.type === "trigger" ? [] : n.type === "merge" ? [0, 1] : [undefined];
              return (
                <span key={`${n.id}-ports`}>
                  {ins.map((p, i) => {
                    const [x, y] = inPort(n, p);
                    return <Port key={`in${i}`} x={x} y={y} filled={step >= n.step} />;
                  })}
                  {outs.map((p, i) => {
                    const [x, y] = outPort(n, p);
                    return <Port key={`out${i}`} x={x} y={y} filled={done} />;
                  })}
                </span>
              );
            })}
            {/* If branch labels */}
            {nodes
              .filter((n) => n.type === "if")
              .flatMap((n) =>
                canvas.ifLabels.map((label, i) => {
                  const [x, y] = outPort(n, i as 0 | 1);
                  return (
                    <span
                      key={`${n.id}-${label}`}
                      className="absolute -translate-y-1/2 pl-2 text-[10px] text-faint"
                      style={{ left: x, top: y + (i === 0 ? -9 : 9) }}
                    >
                      {label}
                    </span>
                  );
                })
              )}

            {/* Agent tools */}
            {tools.map((t, i) => {
              const active = step === agent.step;
              return (
                <div
                  key={t.label}
                  className="absolute flex -translate-x-1/2 flex-col items-center"
                  style={{ left: toolX(i), top: TOOL_Y - TOOL_R }}
                >
                  <span
                    className={cn(
                      "grid place-items-center rounded-full border bg-[#141518] transition-[border-color,color] duration-500",
                      active ? "border-brand/70 text-[#B9BFF0]" : "border-line text-muted-fg"
                    )}
                    style={{ width: TOOL_R * 2, height: TOOL_R * 2 }}
                  >
                    <t.icon className="size-4" aria-hidden />
                  </span>
                  <span className="mt-1.5 text-[10.5px] whitespace-nowrap text-faint">{t.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Execution log */}
      <div className="border-t border-line px-4 py-4 md:px-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] text-faint">{canvas.logTitle}</p>
          <span
            className={cn(
              "font-mono text-[11px] transition-colors duration-500",
              finished ? "text-[#B9BFF0]" : "text-faint"
            )}
          >
            {finished ? canvas.doneLabel : step > 0 ? "Running…" : "Idle"}
          </span>
        </div>
        <ul className="mt-3 grid min-h-[92px] content-start gap-x-8 gap-y-1.5 font-mono text-[11.5px] md:grid-cols-2">
          <AnimatePresence initial={false}>
            {ran.map((n) => (
              <motion.li
                key={n.id}
                className="flex items-start gap-2 text-muted-fg"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span className="mt-[5px] size-1 shrink-0 rounded-full bg-brand" />
                {n.log}
              </motion.li>
            ))}
          </AnimatePresence>
          {step === 0 && <li className="text-faint">{canvas.logIdle}</li>}
        </ul>
      </div>
    </div>
  );
}
