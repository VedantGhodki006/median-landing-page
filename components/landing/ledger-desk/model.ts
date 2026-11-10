import {
  CARD_REST_Z,
  FILES,
  READER_DIP,
  READER_H,
  READER_X,
  SLOTS,
  TRAVEL_Z,
  CAB_H,
  CARD_H,
} from "./view";

/*
 * The ledger desk's model. A batch of slips arrives in two card files (bank
 * statement lines and gateway settlements). The agent picks each slip, holds
 * it in the reader while it is matched against the other side, and posts it
 * into the ledger drawer it belongs to. Everything the figure shows (the
 * carriage, the card, the drawers, the dial and the readout) comes from
 * `poseAt(t)` below.
 */

type FileId = (typeof FILES)[number]["id"];
type SlotId = (typeof SLOTS)[number]["id"];

export interface Slip {
  file: FileId;
  source: string;
  amount: number;
  ledger: SlotId;
  match: string;
}

export const BATCH: Slip[] = [
  { file: "gateway", source: "Razorpay settlement", amount: 48250, ledger: "revenue", match: "HDFC credit" },
  { file: "bank", source: "AWS invoice", amount: 12400, ledger: "expenses", match: "bill #A-2291" },
  { file: "bank", source: "GSTR-3B payment", amount: 18620, ledger: "gst", match: "challan 0921" },
  { file: "gateway", source: "Cashfree payout", amount: 21900, ledger: "revenue", match: "ICICI credit" },
  { file: "bank", source: "Office rent", amount: 65000, ledger: "expenses", match: "lease #14" },
  { file: "gateway", source: "Stripe settlement", amount: 102300, ledger: "revenue", match: "HDFC credit" },
];

export const LEDGER_NAME: Record<SlotId, string> = {
  revenue: "Revenue",
  expenses: "Expenses",
  gst: "GST",
};

export const inr = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

export type Phase = "travel" | "pick" | "read" | "matched" | "post";

export interface Pose {
  carriageX: number;
  jawZ: number; // z of the card's bottom edge while gripped (jaw sits at jawZ + CARD_H)
  card: { x: number; z: number; shown: boolean; gripped: boolean };
  clip: "open" | `file-${number}` | "reader" | `slot-${number}`;
  advance: number[]; // per file: 0 right after a pick, 1 once the follower has pushed the stack forward a card
  drawers: number[]; // per slot, 0..1 open
  led: number; // 0..1, reader lamp
  posted: number; // dial: slips posted so far in this batch (fractional while it moves)
  slip: number; // index into BATCH
  phase: Phase;
}

const SPEED = 150; // carriage, units per second
const LIFT = 70; // jaw, units per second
const GRAVITY = 520; // units per second squared, scaled to the figure
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

interface Segment {
  from: number;
  to: number;
  apply: (pose: Pose, u: number) => void; // u is 0..1 raw progress
}

const PARK_X: number = SLOTS.find((s) => s.id === BATCH[BATCH.length - 1].ledger)!.x;

const fileIndex = (id: FileId) => FILES.findIndex((f) => f.id === id);
const slotIndex = (id: SlotId) => SLOTS.findIndex((s) => s.id === id);

function buildTimeline() {
  const segments: Segment[] = [];
  let t = 0;
  let x: number = PARK_X; // the carriage starts where the last slip of the batch left it
  let z = TRAVEL_Z;

  const add = (dur: number, apply: Segment["apply"]) => {
    segments.push({ from: t, to: t + dur, apply });
    t += dur;
  };
  const move = (to: number, slip: number, carrying: boolean) => {
    const from = x;
    const dur = Math.max(0.5, Math.abs(to - from) / SPEED + 0.25);
    add(dur, (p, u) => {
      p.carriageX = from + (to - from) * ease(u);
      p.phase = "travel";
      p.slip = slip;
      if (carrying) p.card.x = p.carriageX;
    });
    x = to;
  };
  const jaw = (to: number, carrying: boolean, phase: Phase, extra?: (p: Pose, u: number) => void) => {
    const from = z;
    const dur = Math.max(0.35, Math.abs(to - from) / LIFT);
    add(dur, (p, u) => {
      p.jawZ = from + (to - from) * ease(u);
      p.phase = phase;
      if (carrying) p.card.z = p.jawZ;
      extra?.(p, u);
    });
    z = to;
  };
  const hold = (dur: number, apply: Segment["apply"]) => add(dur, apply);

  BATCH.forEach((slip, i) => {
    const fi = fileIndex(slip.file);
    const si = slotIndex(slip.ledger);
    const fileX = FILES[fi].x;

    // 1. Fly to the file and take the front card.
    move(fileX, i, false);
    hold(0.01, (p) => {
      p.card.x = fileX;
      p.card.z = CARD_REST_Z;
      p.card.shown = true;
      p.card.gripped = false;
      p.clip = `file-${fi}`;
      p.advance[fi] = 0;
    });
    jaw(CARD_REST_Z, false, "pick");
    hold(0.25, (p) => {
      p.card.gripped = true;
      p.phase = "pick";
    });
    jaw(TRAVEL_Z, true, "pick", (p, u) => {
      if (u > 0.98) p.clip = "open";
    });
    // The file's follower pushes the stack one card forward.
    const stackFrom = t;
    hold(0.01, () => {});
    segments.push({
      from: stackFrom,
      to: stackFrom + 0.9,
      apply: (p, u) => {
        p.advance[fi] = ease(u);
      },
    });

    // 2. Hold it in the reader while it is matched.
    move(READER_X, i, true);
    hold(0.01, (p) => {
      p.clip = "reader";
    });
    jaw(READER_H - READER_DIP, true, "read");
    hold(1.1, (p, u) => {
      p.phase = u < 0.55 ? "read" : "matched";
      p.led = u < 0.55 ? 0.35 + 0.35 * Math.sin(u * 40) ** 2 : 1;
    });
    jaw(TRAVEL_Z, true, "matched", (p, u) => {
      p.led = 1 - u;
      if (u > 0.98) p.clip = "open";
    });

    // 3. Post it: lower into the slot, let go, the drawer takes it.
    const slotX = SLOTS[si].x;
    move(slotX, i, true);
    hold(0.01, (p) => {
      p.clip = `slot-${si}`;
    });
    const releaseZ = CAB_H - 9;
    jaw(releaseZ, true, "post");
    hold(0.15, (p) => {
      p.card.gripped = false;
      p.phase = "post";
    });
    const fall = CARD_H + 4;
    const fallDur = Math.sqrt((2 * fall) / GRAVITY);
    hold(fallDur, (p, u) => {
      const s = u * fallDur;
      p.card.z = releaseZ - 0.5 * GRAVITY * s * s;
    });
    hold(0.01, (p) => {
      p.card.shown = false;
    });
    const postedFrom = t;
    // The drawer slides out to receive the slip, then closes, while the jaw rises.
    segments.push({
      from: postedFrom,
      to: postedFrom + 1.6,
      apply: (p, u) => {
        const open = u < 0.35 ? ease(u / 0.35) : u < 0.6 ? 1 : 1 - ease((u - 0.6) / 0.4);
        p.drawers[si] = open;
        p.posted = i + ease(clamp01(u / 0.6));
      },
    });
    jaw(TRAVEL_Z, false, "post");
    hold(0.9, (p) => {
      p.phase = "post";
    });
  });

  // End of batch: the dial sweeps back to zero as the next batch starts.
  const resetFrom = t;
  segments.push({
    from: resetFrom,
    to: resetFrom + 0.9,
    apply: (p, u) => {
      p.posted = BATCH.length * (1 - ease(u));
    },
  });
  t += 0.9;

  return { segments, duration: t };
}

const TIMELINE = buildTimeline();
export const CYCLE = TIMELINE.duration;

export function restPose(): Pose {
  return {
    carriageX: PARK_X,
    jawZ: TRAVEL_Z,
    card: { x: 0, z: CARD_REST_Z, shown: false, gripped: false },
    clip: "open",
    advance: FILES.map(() => 1),
    drawers: SLOTS.map(() => 0),
    led: 0,
    posted: 0,
    slip: 0,
    phase: "travel",
  };
}

/** The whole figure's state at time t (seconds, looping). */
export function poseAt(time: number): Pose {
  const t = ((time % CYCLE) + CYCLE) % CYCLE;
  const pose = restPose();
  // Segments are in time order; apply every one that has started, clamped,
  // so state carries forward exactly as it would have if played.
  for (const seg of TIMELINE.segments) {
    if (seg.from > t) break;
    const u = seg.to === seg.from ? 1 : clamp01((t - seg.from) / (seg.to - seg.from));
    seg.apply(pose, u);
  }
  return pose;
}

/** A still frame for reduced motion: the first slip, matched in the reader. */
export const STILL_TIME = (() => {
  for (let t = 0; t < CYCLE; t += 0.05) {
    const p = poseAt(t);
    if (p.phase === "matched" && p.led === 1) return t + 0.3;
  }
  return 0;
})();

export function readoutOf(pose: Pose) {
  const slip = BATCH[pose.slip];
  const amount = inr(slip.amount);
  switch (pose.phase) {
    case "pick":
      return `${slip.source} · ${amount}`;
    case "read":
      return `Matching ${amount} to ${slip.match}`;
    case "matched":
      return `Matched · ${slip.match}`;
    case "post":
      return `${amount} → ${LEDGER_NAME[slip.ledger]}`;
    default:
      return `${Math.floor(pose.posted + 0.001)} of ${BATCH.length} posted`;
  }
}
