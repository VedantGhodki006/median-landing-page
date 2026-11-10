import * as k from "@/components/iso/iso-kit";
import type { Plan, Point3 } from "@/components/iso/iso-kit";

/*
 * World layout for the ledger desk. Units are roughly 1 px of the real
 * thing; x runs along the gantry, y toward the viewer, z up. The plate's
 * top face is z = 0, and every card hangs in the plane y = 0.
 */

export const WIDTH = 640;
export const HEIGHT = 400;
export const AZIMUTH = 56;

/* Base plate on feet. */
export const PLATE: Plan = { x: -186, y: -42, w: 350, d: 86, r: 8 };
export const PLATE_H = 10;
export const FOOT_H = 5;

/* An index card: thin in y, wide in x, standing on its long edge. */
export const CARD_W = 26;
export const CARD_H = 17;
export const CARD_T = 0.8;

/* Two card files: bank statement lines and gateway settlements. */
export const FILE_H = 14;
export const CARD_PITCH = 3.2;
export const CARD_COUNT = 7;
export const CARD_SUNK = 10; // a resting card's bottom sits this far below the rim
export const FILES = [
  { id: "bank", x: -140 },
  { id: "gateway", x: -97 },
] as const;
export const filePlan = (x: number): Plan => ({ x: x - 18, y: -30, w: 36, d: 35, r: 3 });
export const wellPlan = (x: number): Plan => ({ x: x - 15, y: -26.5, w: 30, d: 29, r: 1.6 });

/* The reader, where each slip is matched against the other side. */
export const READER_X = -52;
export const READER_H = 24;
export const READER: Plan = { x: READER_X - 22, y: -18, w: 44, d: 30, r: 3 };
export const READER_DIP = 11; // how far a card goes into the reader

/* The ledger cabinet: three posting slots over three drawers. */
export const CAB: Plan = { x: -10, y: -28, w: 150, d: 42, r: 3.5 };
export const CAB_H = 34;
export const SLOTS = [
  { id: "revenue", x: 16 },
  { id: "expenses", x: 60 },
  { id: "gst", x: 104 },
] as const;
export const slotPlan = (x: number): Plan => ({ x: x - 16, y: -1.4, w: 32, d: 2.8, r: 1.2 });
export const DRAWER_Z = [4, 28] as const;
export const DRAWER_FRONT = CAB.y + CAB.d; // y of the cabinet's front face
export const DRAWER_OPEN = 9;
export const drawerPlan = (x: number): Plan => ({ x: x - 19, y: DRAWER_FRONT - 0.2, w: 38, d: 2, r: 1 });

/* Dial on the cabinet top: the share of today's batch that is posted. */
export const DIAL: [number, number] = [126, -14];
export const DIAL_R = 9.5;
export const DIAL_Z = CAB_H;
export const DIAL_H = 5;
export const DIAL_TOP = DIAL_Z + DIAL_H;

/* Gantry: two uprights carry a beam; the carriage rides the beam. */
export const POSTS = [-176, 154] as const;
export const BEAM_Z = 86;
export const BEAM_H = 8;
export const BEAM: Plan = { x: -182, y: -12, w: 342, d: 7, r: 1.5 };
export const CARRIAGE_Z = BEAM_Z - 6;
export const CARRIAGE: Plan = { x: -11, y: -15, w: 22, d: 17, r: 2 };
export const JAW_H = 4;

/* Heights the card bottom travels between. */
export const CARD_REST_Z = FILE_H - CARD_SUNK;
export const TRAVEL_Z = CAB_H + 8;

export const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [POSTS[0], BEAM.y, BEAM_Z + BEAM_H + 2],
    [POSTS[1], BEAM.y + BEAM.d, BEAM_Z + BEAM_H + 2],
    [CAB.x + CAB.w, CAB.y + CAB.d, CAB_H],
  ],
  WIDTH,
  HEIGHT,
  { pad: 8, azimuth: AZIMUTH },
);

export const at = (point: Point3) => k.iso(point, P);

/**
 * Screen polygon that keeps whatever lies above the near rim of an opening
 * at height z: the near rim (front edge, then right edge) is extended
 * sideways and the polygon is closed far above the figure. A card that sinks
 * through the opening is cut exactly where the rim hides it.
 */
export function aboveRim(plan: Plan, z: number) {
  const rim = [
    at([plan.x, plan.y + plan.d, z]),
    at([plan.x + plan.w, plan.y + plan.d, z]),
    at([plan.x + plan.w, plan.y, z]),
  ].sort((a, b) => a[0] - b[0]);
  const left = rim[0];
  const right = rim[rim.length - 1];
  const pts = [[left[0] - 400, left[1]], ...rim, [right[0] + 400, right[1]], [right[0] + 400, -2000], [left[0] - 400, -2000]];
  return `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`;
}

/** Everything: used while the card is clear of every opening. */
export const OPEN_CLIP = `M-2000 -2000H4000V4000H-2000Z`;

/* The dial's scale: one major per slip, over three quarters of a turn. */
export const DIAL_FROM = -Math.PI * 0.75;
export const DIAL_SPAN = Math.PI * 1.5;

/** Card clip regions by name, as the model's pose refers to them. */
export const CLIPS: Record<string, string> = {
  open: OPEN_CLIP,
  reader: aboveRim(slotPlan(READER.x + READER.w / 2), READER_H),
  ...Object.fromEntries(FILES.map((f, i) => [`file-${i}`, aboveRim(wellPlan(f.x), FILE_H)])),
  ...Object.fromEntries(SLOTS.map((s, i) => [`slot-${i}`, aboveRim(slotPlan(s.x), CAB_H)])),
};
