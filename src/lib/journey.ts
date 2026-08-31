/**
 * Shared scroll-journey state + timing helpers for the 3D experience.
 *
 * The whole experience is one continuous camera path. `journey.target` is the
 * raw scroll progress (0..1) written by the DOM scroll listener; `journey.p`
 * is the spring-smoothed value read every frame inside the 3D scene.
 */
export const journey = {
  /** raw scroll progress 0..1 */
  target: 0,
  /** spring-smoothed progress 0..1 */
  p: 0,
  /** spring velocity */
  v: 0,
  /** manual drag rotation (radians) added on top of the slow auto-spin */
  drag: 0,
  dragV: 0,
};

/** Spring integration with a little weight + overshoot. */
export function advanceJourney(dt: number) {
  const k = 120;
  const d = 16;
  const clamped = Math.min(dt, 0.05);
  const a = (journey.target - journey.p) * k - journey.v * d;
  journey.v += a * clamped;
  journey.p += journey.v * clamped;

  journey.drag += journey.dragV * clamped;
  journey.dragV *= Math.exp(-3.2 * clamped);
}

/** device tier shared with the 3D materials: phones / low-core CPUs run lite */
export const quality = { lite: false };

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** normalized 0..1 progress of p inside [a,b] */
export const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** eased 0..1 with a small overshoot near the end (settles at 1) */
export function overshoot(t: number) {
  const x = clamp01(t);
  const c = 1.70158;
  const c3 = c + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 0 -> 1 -> 0 bump inside [a,b] */
export function bump(p: number, a: number, b: number) {
  const t = range(p, a, b);
  return Math.sin(t * Math.PI);
}

export type Station = "bottle" | "stopper" | "assembly" | "box" | "final";

export function stationFor(p: number): Station {
  if (p < 0.22) return "bottle";
  if (p < 0.44) return "stopper";
  if (p < 0.7) return "assembly";
  if (p < 0.93) return "box";
  return "final";
}

/* ------------------------------ opening ritual ------------------------------ */

/**
 * The seven stages of the forge ritual, in scroll-up order. Every stage is a
 * window of the intro progress value (0..1) so the visuals, the labels and the
 * hairline meter always agree.
 */
export const RITUAL = [
  { n: 1, from: 0.0, to: 0.12, label: "Gold dust awakens" },
  { n: 2, from: 0.12, to: 0.26, label: "Particles converge into a crystal" },
  { n: 3, from: 0.26, to: 0.42, label: "The crystal melts in the furnace" },
  { n: 4, from: 0.42, to: 0.56, label: "Molten glass runs down the pipe" },
  { n: 5, from: 0.56, to: 0.7, label: "The mould fills" },
  { n: 6, from: 0.7, to: 0.86, label: "The mould opens" },
  { n: 7, from: 0.86, to: 1.0, label: "The bottle is released" },
] as const;

export function ritualStage(t: number) {
  const p = clamp01(t);
  for (const s of RITUAL) if (p < s.to) return s;
  return RITUAL[RITUAL.length - 1]!;
}
