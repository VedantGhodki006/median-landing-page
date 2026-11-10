import * as k from "@/components/iso/iso-kit";
import "@/components/iso/iso.css";
import "./ledger-desk.css";
import { ART } from "./geometry";
import { CLIPS, FILES, HEIGHT, WIDTH } from "./view";
import { poseAt, readoutOf } from "./model";
import { LedgerDeskLive } from "./LedgerDeskLive";

const LABEL =
  "A ledger desk. A gantry carriage takes slips from two card files, bank lines and gateway settlements, holds each one in a reader while it is matched, and posts it into one of three ledger drawers: revenue, expenses and GST. A dial on the cabinet counts the slips posted.";

function svg() {
  const defs = [
    ...FILES.map((_, i) => `<clipPath id="ld-clip-file-${i}"><path d="${CLIPS[`file-${i}`]}"/></clipPath>`),
    `<clipPath id="ld-card-clip"><path data-ld="card-clip" d="${CLIPS.open}"/></clipPath>`,
  ].join("");

  const drawers = ART.drawers
    .map((front, i) => `<g data-ld="drawer-body-${i}"></g><g data-ld="drawer-${i}">${front}</g>`)
    .join("");

  const live = [
    `<g data-ld="rod-below"></g>`,
    `<g data-ld="jaw-back">${ART.jawBack}</g>`,
    `<g clip-path="url(#ld-card-clip)"><g data-ld="card" style="display:none">${ART.card}</g></g>`,
    `<g data-ld="jaw-front">${ART.jawFront}</g>`,
    `<g data-ld="carriage">${ART.carriage}</g>`,
    `<g data-ld="rod-above"></g>`,
  ].join("");

  return k.figureSvg({
    width: WIDTH,
    height: HEIGHT,
    label: LABEL,
    body: [
      `<defs>${defs}</defs>`,
      ART.plate,
      ART.postLeft,
      ...ART.files,
      ART.reader,
      ART.cabinet,
      drawers,
      ART.dial,
      `<path data-ld="needle" class="iso-line" data-tone="lit" data-free="start" style="stroke-width:1.1"/>`,
      ART.postRight,
      ART.beam,
      live,
    ],
  });
}

const SVG = svg();
const REST = poseAt(0);

export function LedgerDesk() {
  return (
    <figure className="iso ld relative m-0" data-theme="dark">
      <LedgerDeskLive>
        <div key="ld-art" dangerouslySetInnerHTML={{ __html: SVG }} />
      </LedgerDeskLive>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-end font-mono text-[10.5px] tracking-[0.04em]">
        <span data-readout className="text-muted-fg tabular-nums" aria-hidden>
          {readoutOf(REST)}
        </span>
      </div>
    </figure>
  );
}
