import * as k from "@/components/iso/iso-kit";
import {
  CARD_H,
  CARRIAGE_Z,
  DIAL,
  DIAL_FROM,
  DIAL_R,
  DIAL_SPAN,
  DIAL_TOP,
  DRAWER_FRONT,
  DRAWER_OPEN,
  DRAWER_Z,
  JAW_H,
  P,
  SLOTS,
} from "./view";
import { BATCH } from "./model";

/* Paths for the parts that change shape: rebuilt on the client per frame. */

const ROD_R = 1.5;
const ROD_LEN = 62;

/** The z rod: the part below the carriage, and the part that rises out of its gland. */
export function rodOf(x: number, cardZ: number) {
  const bottom = cardZ + CARD_H + 0.6 + JAW_H;
  const top = bottom + ROD_LEN;
  const below = k.solidSvg(k.cylinder(x, 0, ROD_R, bottom, CARRIAGE_Z - bottom, P, 16), { tone: "mid", crease: "none" });
  const glandTop = CARRIAGE_Z + 18.4;
  const above =
    top > glandTop + 0.2
      ? k.solidSvg(k.cylinder(x, 0, ROD_R, glandTop, top - glandTop, P, 16), { tone: "mid", crease: "none" }) +
        k.solidSvg(k.cylinder(x, 0, ROD_R + 0.8, top, 1.4, P, 16), { tone: "mid" })
      : "";
  return { below, above };
}

/** The exposed part of an open drawer: its sides, and the slips inside seen from above. */
export function drawerBodyOf(slot: number, open: number) {
  const depth = open * DRAWER_OPEN;
  if (depth < 0.15) return "";
  const x = SLOTS[slot].x;
  const [z0, z1] = DRAWER_Z;
  const plan = { x: x - 17, y: DRAWER_FRONT, w: 34, d: depth, r: 0.4 };
  const body = k.solidSvg(k.slabOf(plan, z0 + 1, z1 - z0 - 3, P, 2), { tone: "mid", crease: "none" });
  const inside = { x: plan.x + 1.4, y: plan.y, w: plan.w - 2.8, d: Math.max(0.1, depth - 0.2), r: 0 };
  const top = z1 - 2;
  const voidPath = `<path class="ld-void" d="${k.planOutline(inside, top, P, 2)}"/>`;
  // Slip tops filed inside, one every 2.2 units, only where the drawer is out.
  const tops: string[] = [];
  for (let y = DRAWER_FRONT + 1.2; y < DRAWER_FRONT + depth - 0.6; y += 2.2) {
    tops.push(k.lineOnTop([inside.x + 1, y], [inside.x + inside.w - 1, y], top - 1.5, P));
  }
  return body + voidPath + k.lineSvg(tops.join(""), { tone: "lo" });
}

/** The dial needle for this many slips posted. */
export function needleOf(posted: number) {
  const angle = DIAL_FROM + (posted / BATCH.length) * DIAL_SPAN;
  const [x, y] = DIAL;
  const sx = Math.sin(angle);
  const sy = -Math.cos(angle);
  return k.lineOnTop([x - sx * 2.6, y - sy * 2.6], [x + sx * (DIAL_R - 3), y + sy * (DIAL_R - 3)], DIAL_TOP + 0.2, P);
}
