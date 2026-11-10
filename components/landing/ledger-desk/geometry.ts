import * as k from "@/components/iso/iso-kit";
import type { Plan, Point3 } from "@/components/iso/iso-kit";
import {
  BEAM,
  BEAM_H,
  BEAM_Z,
  CAB,
  CAB_H,
  CARD_COUNT,
  CARD_H,
  CARD_PITCH,
  CARD_REST_Z,
  CARD_T,
  CARD_W,
  CARRIAGE,
  CARRIAGE_Z,
  DIAL,
  DIAL_H,
  DIAL_R,
  DIAL_TOP,
  DIAL_Z,
  DIAL_FROM,
  DIAL_SPAN,
  DRAWER_FRONT,
  DRAWER_Z,
  FILES,
  FILE_H,
  FOOT_H,
  JAW_H,
  P,
  PLATE,
  PLATE_H,
  POSTS,
  READER,
  READER_H,
  SLOTS,
  at,
  drawerPlan,
  filePlan,
  slotPlan,
  wellPlan,
} from "./view";

/*
 * Static art for the ledger desk, built once on the server as SVG strings.
 * The live component places these in painter's order and moves the groups
 * marked with data-ld attributes.
 */

const S = k.solidSvg;
const L = k.lineSvg;
const D = (points: Point3[], style?: Parameters<typeof k.dotsSvg>[1]) => k.dotsSvg(points.map(at), style);
const byDepth = <T extends [number, number]>(points: T[]) =>
  [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

/** A dark opening on a top face, with its far inner walls showing. */
function opening(plan: Plan, z: number, depth: number) {
  const back: Point3[] = [
    [plan.x, plan.y, z],
    [plan.x + plan.w, plan.y, z],
    [plan.x + plan.w, plan.y, z - depth],
    [plan.x, plan.y, z - depth],
  ];
  const left: Point3[] = [
    [plan.x, plan.y, z],
    [plan.x, plan.y + plan.d, z],
    [plan.x, plan.y + plan.d, z - depth],
    [plan.x, plan.y, z - depth],
  ];
  const quad = (pts: Point3[]) => `M${pts.map((p) => at(p).join(" ")).join("L")}Z`;
  const outline = k.planOutline(plan, z, P, 3);
  return [
    `<path class="ld-void" d="${outline}"/>`,
    `<g clip-path="url(#ld-open-${Math.round(plan.x * 10)}-${Math.round(plan.y * 10)})">`,
    `<clipPath id="ld-open-${Math.round(plan.x * 10)}-${Math.round(plan.y * 10)}"><path d="${outline}"/></clipPath>`,
    `<path class="ld-wall" data-shade="1" d="${quad(back)}"/>`,
    `<path class="ld-wall" data-shade="0" d="${quad(left)}"/>`,
    `</g>`,
    L(outline, { tone: "lo" }),
  ].join("");
}

/** A closed rectangle in the vertical plane y = face, for panels, windows and label holders. */
function faceRect(x0: number, x1: number, z0: number, z1: number, y: number) {
  return `M${[
    [x0, y, z0],
    [x1, y, z0],
    [x1, y, z1],
    [x0, y, z1],
  ]
    .map((p) => at(p as Point3).join(" "))
    .join("L")}Z`;
}

/* ------------------------------------------------------------------ */
/* Plate                                                               */
/* ------------------------------------------------------------------ */

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 20))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(
    S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), {
      tone: "mid",
      inner: L(k.sideSeam(PLATE, -PLATE_H + 3, P, 8), { tone: "faint" }),
    }),
  );
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => [x, y, 0] as Point3), { size: 0.5 }));

  // Ruler strip along the front edge, under the stations.
  const strip: Plan = { x: -172, y: PLATE.y + PLATE.d - 14, w: 156, d: 6, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [1.8, 3.4], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([[strip.x + 2, strip.y + 3, 0.6], [strip.x + strip.w - 2, strip.y + 3, 0.6]], { size: 0.45 }));

  // Label plate with the one engraved word.
  const label: Plan = { x: 2, y: PLATE.y + PLATE.d - 15, w: 46, d: 9, r: 1.2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P, 3), { tone: "faint" }));
  out.push(k.faceTextSvg(k.topMatrix([label.x + 5, label.y + 6.2], 0.8, P, "x"), "MEDIAN", { size: 3.6, tone: "mid" }));
  out.push(D([[label.x + label.w - 4, label.y + 3, 0.8], [label.x + label.w - 4, label.y + label.d - 3, 0.8]], { size: 0.45 }));
  return out.join("");
}

/* ------------------------------------------------------------------ */
/* Gantry                                                              */
/* ------------------------------------------------------------------ */

function post(x: number) {
  const out: string[] = [];
  const foot: Plan = { x: x - 9, y: BEAM.y - 7, w: 18, d: 21, r: 2 };
  out.push(S(k.slabOf(foot, 0, 4, P, 4, 0.6), { tone: "mid" }));
  out.push(D(byDepth(k.corners(foot, 3)).map(([px, py]) => [px, py, 4] as Point3), { size: 0.45 }));
  const col: Plan = { x: x - 5, y: BEAM.y - 2, w: 10, d: 11, r: 1.6 };
  out.push(
    S(k.slabOf(col, 4, BEAM_Z - 4, P, 3, 0.4), {
      tone: "mid",
      inner: L([24, 48, 72].map((z) => k.sideSeam(col, z, P, 3)).join(""), { tone: "faint" }),
    }),
  );
  return out.join("");
}

function beam() {
  const out: string[] = [];
  out.push(S(k.slabOf(BEAM, BEAM_Z, BEAM_H, P, 3, 0.5), { tone: "mid" }));
  // Ruler strip on the beam's top, ticks rooted on its back edge.
  const strip: Plan = { x: -150, y: BEAM.y + 1, w: 270, d: 3, r: 0.6 };
  out.push(S(k.slabOf(strip, BEAM_Z + BEAM_H, 0.4, P, 2), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 2, strip.x + strip.w - 2, 4, 5, strip.y, BEAM_Z + BEAM_H + 0.4, [1, 2], P);
  out.push(L(ticks.minor, { tone: "faint" }), L(ticks.major, { tone: "lo" }));
  // End stops.
  for (const x of [-161, 134]) {
    const stop: Plan = { x: x - 2.5, y: BEAM.y - 1, w: 5, d: BEAM.d + 2, r: 1 };
    out.push(S(k.slabOf(stop, BEAM_Z + BEAM_H, 5, P, 2, 0.4), { tone: "mid" }));
    out.push(D([[x, BEAM.y + BEAM.d / 2, BEAM_Z + BEAM_H + 5]], { size: 0.45 }));
  }
  // Drive motor on the left end, with a vented lid and a knurled hand wheel.
  const motor: Plan = { x: -182, y: BEAM.y - 3, w: 18, d: 13, r: 2 };
  const mz = BEAM_Z + BEAM_H;
  out.push(S(k.slabOf(motor, mz, 12, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(motor, mz + 3, P, 4), { tone: "faint" }) }));
  for (let i = 0; i < 4; i++) {
    out.push(L(k.planOutline({ x: motor.x + 3 + i * 3.4, y: motor.y + 3, w: 1.4, d: 7, r: 0.7 }, mz + 12, P, 2), { tone: "lo" }));
  }
  out.push(D([[motor.x + 2, motor.y + 2, mz + 12], [motor.x + motor.w - 2, motor.y + motor.d - 2, mz + 12]], { size: 0.45 }));
  return out.join("");
}

/* The carriage, built at x = 0 and moved along the beam. */
function carriage() {
  const out: string[] = [];
  const body = CARRIAGE;
  const z0 = CARRIAGE_Z;
  out.push(S(k.slabOf(body, z0, 16, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(body, z0 + 4, P, 4), { tone: "faint" }) }));
  // Bearing blocks on top.
  for (const x of [-7, 7]) {
    const block: Plan = { x: x - 3, y: body.y + 2, w: 6, d: 8, r: 1 };
    out.push(S(k.slabOf(block, z0 + 16, 3, P, 2, 0.4), { tone: "mid" }));
  }
  // Rod gland on top, around the z rod.
  out.push(S(k.cylinder(0, 0, 3.4, z0 + 16, 2.4, P, 24), { tone: "mid" }));
  out.push(L(k.ring(0, 0, 2.2, z0 + 18.4, P, 20), { tone: "lo" }));
  // Front face: a status window and rivets.
  const fy = body.y + body.d;
  out.push(L(faceRect(-7, 3, z0 + 8, z0 + 12, fy), { tone: "lo" }));
  out.push(`<path class="ld-led" data-ld="carriage-led" d="${faceRect(5, 8, z0 + 9, z0 + 11, fy)}"/>`);
  out.push(D([[-9, fy, z0 + 14], [9, fy, z0 + 14], [-9, fy, z0 + 2], [9, fy, z0 + 2]], { size: 0.4 }));
  return out.join("");
}

/* The jaw, built with the gripped card's bottom at z = 0: back finger and front body. */
function jawBack() {
  const top = CARD_H;
  return S(k.slabOf({ x: -6, y: -1.8, w: 12, d: 1.2, r: 0.3 }, top - 3, 3.6, P, 2), { tone: "mid" });
}
function jawFront() {
  const top = CARD_H;
  const out: string[] = [];
  out.push(S(k.slabOf({ x: -6, y: 0.6, w: 12, d: 1.2, r: 0.3 }, top - 3, 3.6, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: -8, y: -3, w: 16, d: 6, r: 1 }, top + 0.6, JAW_H, P, 3, 0.4), { tone: "mid" }));
  out.push(D([[-6, 3, top + 0.6 + JAW_H / 2], [6, 3, top + 0.6 + JAW_H / 2]], { size: 0.4 }));
  return out.join("");
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

/** One index card, bottom edge at z = 0, centred on x = 0, face at y = +CARD_T/2. */
export function cardSvg(lit: boolean) {
  const out: string[] = [];
  const plan: Plan = { x: -CARD_W / 2, y: -CARD_T / 2, w: CARD_W, d: CARD_T, r: 0.2 };
  const fy = CARD_T / 2;
  const tab: Plan = { x: -CARD_W / 2 + 2, y: -CARD_T / 2, w: 8, d: CARD_T, r: 0.2 };
  const rules = [
    [CARD_H - 4, 14],
    [CARD_H - 7, 19],
    [CARD_H - 10, 11],
    [CARD_H - 13, 16],
  ] as const;
  const lines = rules
    .map(([z, len]) => k.segment([-CARD_W / 2 + 3, fy, z], [-CARD_W / 2 + 3 + len, fy, z], P))
    .join("");
  out.push(S(k.slabOf(tab, CARD_H, 2.4, P, 2), { tone: lit ? "hi" : "lo", lit, crease: "none" }));
  out.push(
    S(k.slabOf(plan, 0, CARD_H, P, 2), {
      tone: lit ? "hi" : "mid",
      lit,
      crease: "none",
      inner: L(lines, { tone: lit ? "mid" : "faint", free: true }),
    }),
  );
  return out.join("");
}

/* ------------------------------------------------------------------ */
/* Card files                                                          */
/* ------------------------------------------------------------------ */

function fileBlock(x: number) {
  const plan = filePlan(x);
  const out: string[] = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(plan, 0, 1, P)}" style="filter:blur(5px)"/>`);
  out.push(
    S(k.slabOf(plan, 0, FILE_H, P, 4, 0.8), {
      tone: "mid",
      inner: L(k.sideSeam(plan, 3, P, 4), { tone: "faint" }),
    }),
  );
  out.push(opening(wellPlan(x), FILE_H, 8));
  // Label holder on the front face.
  const fy = plan.y + plan.d;
  out.push(L(faceRect(x - 8, x + 8, 4, 10, fy), { tone: "lo" }));
  out.push(L(k.segment([x - 6, fy, 7.6], [x + 3, fy, 7.6], P), { tone: "faint", free: true }));
  out.push(D([[x - 10, fy, 7], [x + 10, fy, 7]], { size: 0.4 }));
  return out.join("");
}

/** The stack behind the front slot: cards 1..N, moved by the follower. */
function stack(fi: number) {
  const x = FILES[fi].x;
  const cards: string[] = [];
  for (let j = CARD_COUNT; j >= 1; j--) {
    cards.push(
      `<g data-ld="stack-${fi}-${j}" transform="${k.translateAlong(P, [x, -(j - 1) * CARD_PITCH, CARD_REST_Z])}">${cardSvg(false)}</g>`,
    );
  }
  // Back plate behind the last card, against the well's back wall.
  const follower = `<g transform="${k.translateAlong(P, [x, -CARD_COUNT * CARD_PITCH - 2.2, CARD_REST_Z])}">${S(
    k.slabOf({ x: -14, y: -0.9, w: 28, d: 1.8, r: 0.4 }, 0, CARD_H - 4, P, 2),
    { tone: "mid" },
  )}</g>`;
  return `<g clip-path="url(#ld-clip-file-${fi})">${follower}${cards.join("")}</g>`;
}

/* ------------------------------------------------------------------ */
/* Reader                                                              */
/* ------------------------------------------------------------------ */

function reader() {
  const out: string[] = [];
  const plan = READER;
  const top = READER_H;
  out.push(`<path class="iso-halo" d="${k.haloOf(plan, 0, 1, P)}" style="filter:blur(5px)"/>`);
  out.push(S(k.slabOf(k.insetPlan(plan, -1.5), 0, 3, P, 4, 0.4), { tone: "lo" }));
  out.push(
    S(k.slabOf(plan, 3, top - 3, P, 4, 0.8), {
      tone: "mid",
      inner: L(k.sideSeam(plan, top - 5, P, 4), { tone: "faint" }),
    }),
  );
  out.push(opening(slotPlan(plan.x + plan.w / 2), top, 6));
  // Vents behind the slot.
  for (let i = 0; i < 5; i++) {
    out.push(L(k.planOutline({ x: plan.x + 6 + i * 4, y: plan.y + 4, w: 1.4, d: 8, r: 0.7 }, top, P, 2), { tone: "lo" }));
  }
  // Status lamp: a short lens on the top, back right.
  const lamp: [number, number] = [plan.x + plan.w - 8, plan.y + 8];
  out.push(S(k.cylinder(lamp[0], lamp[1], 3.4, top, 1.6, P, 24), { tone: "mid" }));
  out.push(S(k.cylinder(lamp[0], lamp[1], 2.4, top + 1.6, 1.4, P, 24), { tone: "mid" }));
  out.push(`<path class="ld-led" data-ld="reader-led" d="${k.planOutline({ x: lamp[0] - 2.4, y: lamp[1] - 2.4, w: 4.8, d: 4.8, r: 2.4 }, top + 3, P, 6)}"/>`);
  out.push(D([[plan.x + 3, plan.y + 3, top], [plan.x + plan.w - 3, plan.y + plan.d - 3, top], [plan.x + 3, plan.y + plan.d - 3, top]], { size: 0.45 }));

  // Display window on the front face, drawn in the face's own plane.
  const fy = plan.y + plan.d;
  const m = k.sideMatrix([plan.x, fy], top, P, "left");
  out.push(
    `<g transform="${m}">` +
      `<rect class="ld-screen" x="4" y="6" width="28" height="9" rx="1"/>` +
      `<clipPath id="ld-screen-clip"><rect x="4.5" y="6.5" width="27" height="8" rx="0.8"/></clipPath>` +
      `<g clip-path="url(#ld-screen-clip)"><text data-ld="display" class="ld-display" x="18" y="12.3" text-anchor="middle">IDLE</text></g>` +
      `<rect class="iso-line" data-tone="lo" x="4" y="6" width="28" height="9" rx="1"/>` +
      `</g>`,
  );
  // Two buttons beside the window.
  for (const [u, z] of [[37, top - 8.5], [37, top - 12.5]] as const) {
    out.push(L(faceRect(plan.x + u, plan.x + u + 3, z, z + 2, fy), { tone: "lo" }));
  }
  return out.join("");
}

/* ------------------------------------------------------------------ */
/* Cabinet                                                             */
/* ------------------------------------------------------------------ */

function cabinetBody() {
  const out: string[] = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(CAB, 0, 1, P)}" style="filter:blur(6px)"/>`);
  out.push(S(k.slabOf(k.insetPlan(CAB, -1.5), 0, 3, P, 4, 0.4), { tone: "lo" }));
  out.push(
    S(k.slabOf(CAB, 3, CAB_H - 3, P, 4, 1), {
      tone: "mid",
      inner: L(k.sideSeam(CAB, CAB_H - 4, P, 4), { tone: "faint" }),
    }),
  );
  SLOTS.forEach((slot) => out.push(opening(slotPlan(slot.x), CAB_H, 5)));
  // Screws at the top corners and a seam between the slots and the dial.
  out.push(D(k.corners(CAB, 4).map(([x, y]) => [x, y, CAB_H] as Point3), { size: 0.5 }));
  out.push(L(k.lineOnTop([CAB.x, -8], [DIAL[0] - DIAL_R - 4, -8], CAB_H, P), { tone: "faint" }));
  return out.join("");
}

/* A drawer front, built in place (closed) and moved toward the viewer when it opens. */
function drawerFront(x: number) {
  const out: string[] = [];
  const plan = drawerPlan(x);
  const [z0, z1] = DRAWER_Z;
  const fy = plan.y + plan.d;
  out.push(S(k.slabOf(plan, z0, z1 - z0, P, 2, 0.4), { tone: "mid" }));
  // Label holder and its card.
  out.push(L(faceRect(x - 8, x + 8, z1 - 9, z1 - 4, fy), { tone: "lo" }));
  out.push(L(k.segment([x - 6, fy, z1 - 6.5], [x + 2, fy, z1 - 6.5], P), { tone: "faint", free: true }));
  out.push(D([[x - 9.5, fy, z1 - 6.5], [x + 9.5, fy, z1 - 6.5]], { size: 0.4 }));
  // Pull: two posts and a bar.
  const pz = z0 + 7;
  for (const px of [x - 6, x + 6]) {
    out.push(S(k.slabOf({ x: px - 1, y: fy, w: 2, d: 2.4, r: 0.4 }, pz, 2, P, 2), { tone: "mid", crease: "none" }));
  }
  out.push(S(k.slabOf({ x: x - 8, y: fy + 2.4, w: 16, d: 1.6, r: 0.6 }, pz - 0.2, 2.4, P, 2, 0.3), { tone: "mid" }));
  return out.join("");
}

function dial() {
  const out: string[] = [];
  const [x, y] = DIAL;
  out.push(S(k.cylinder(x, y, DIAL_R + 1.6, DIAL_Z, 1.4, P, 48), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, DIAL_R, DIAL_Z + 1.4, DIAL_H - 1.4, P, 64, 0.6), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(x, y, DIAL_R, DIAL_TOP - 2.6, DIAL_TOP, 60, P, 0.3), { tone: "lo" }));
  out.push(L(k.sideArc(x, y, DIAL_R, DIAL_TOP - 2.6, P, 40), { tone: "faint" }));
  out.push(L(k.ring(x, y, DIAL_R - 1.8, DIAL_TOP, P, 64), { tone: "lo" }));
  // Six majors: one per slip in the batch, over three quarters of a turn.
  const ticks = k.radialTicks(x, y, DIAL_R - 2.4, 30, 5, DIAL_TOP, [1, 2.2], P, DIAL_FROM, DIAL_SPAN);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(k.ring(x, y, 1.3, DIAL_TOP, P, 16), { tone: "mid" }));
  return out.join("");
}

/* ------------------------------------------------------------------ */
/* Assembly                                                            */
/* ------------------------------------------------------------------ */

export const ART = {
  plate: plate(),
  postLeft: post(POSTS[0]),
  postRight: post(POSTS[1]),
  beam: beam(),
  files: FILES.map((f, fi) => fileBlock(f.x) + stack(fi)),
  reader: reader(),
  cabinet: cabinetBody(),
  drawers: SLOTS.map((s) => drawerFront(s.x)),
  dial: dial(),
  carriage: carriage(),
  jawBack: jawBack(),
  jawFront: jawFront(),
  card: cardSvg(true),
};

export const DRAWER_FRONT_Y = DRAWER_FRONT;
