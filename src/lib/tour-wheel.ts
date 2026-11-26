/**
 * Wheel/trackpad intent for the guided tour. Pure: it only classifies samples,
 * the caller owns scrolling. One gesture may advance at most one checkpoint:
 * it either stops on the checkpoint it would cross, or, when its momentum is
 * fading short of it, is carried the rest of the way. Leftover momentum of a
 * spent gesture is swallowed until the reader clearly starts again (reversal,
 * a sample above the spent peak, or a calm), so the reader is never locked out.
 */
export type Intent =
  | { kind: 'pass' }
  | { kind: 'swallow' }
  | { kind: 'stop'; at: number }
  | { kind: 'carry'; at: number; velocity: number };

type Gesture = {
  dir: 1 | -1; start: number; lastTime: number; lastAbs: number; peak: number;
  stopAt: number | undefined; spent: boolean;
};

export const GESTURE_GAP_MS = 180;
/**
 * Silence that ends a spent gesture. A stalled main thread (glide plus video
 * decode) opens gaps of 200-250 ms inside one momentum tail; a deliberate second
 * swipe takes longer than that to begin, and touching the pad stops the events.
 */
export const SPENT_CALM_MS = 350;
const MAX_SPENT_MS = 3500;

export function nextCheckpoint(checkpoints: number[], y: number, dir: 1 | -1): number | undefined {
  return dir > 0 ? checkpoints.find((c) => c > y + 3) : [...checkpoints].reverse().find((c) => c < y - 3);
}

export function createWheelGesture() {
  let gesture: Gesture | undefined;
  return {
    /** Returns the intent and whether this sample began a new gesture. */
    next(delta: number, time: number, y: number, checkpoints: number[], viewport: number): { intent: Intent; fresh: boolean } {
      const abs = Math.abs(delta);
      if (abs === 0) return { intent: { kind: 'pass' }, fresh: false };
      const dir: 1 | -1 = delta > 0 ? 1 : -1;
      const previous = gesture;
      // A live gesture is split by a short pause, a reversal or a hard push. A spent
      // gesture is a momentum tail: its gaps (jank) and drops (quantised tails) say
      // nothing about intent, so only a reversal, a sample above its own peak or a
      // calm longer than any stall starts a new one.
      const fresh = !previous
        || dir !== previous.dir
        || (previous.spent
          ? abs > previous.peak || time - previous.lastTime > SPENT_CALM_MS || time - previous.start > MAX_SPENT_MS
          : time - previous.lastTime > GESTURE_GAP_MS || abs > previous.lastAbs * 1.5 + 6);
      if (fresh || !previous) {
        gesture = { dir, start: time, lastTime: time, lastAbs: abs, peak: abs, stopAt: nextCheckpoint(checkpoints, y, dir), spent: false };
      }
      const g = gesture!;
      const dt = Math.max(1, time - g.lastTime);
      const decaying = !fresh && abs <= g.lastAbs;
      g.lastTime = time; g.lastAbs = abs; g.peak = Math.max(g.peak, abs);
      if (g.spent) return { intent: { kind: 'swallow' }, fresh };
      if (g.stopAt === undefined) return { intent: { kind: 'pass' }, fresh };
      const remaining = (g.stopAt - y) * dir;
      if (abs >= remaining) { g.spent = true; return { intent: { kind: 'stop', at: g.stopAt }, fresh }; }
      if (decaying && g.peak >= 12 && abs < g.peak * .35 && remaining < viewport * 1.7) {
        g.spent = true;
        return { intent: { kind: 'carry', at: g.stopAt, velocity: abs / dt }, fresh };
      }
      return { intent: { kind: 'pass' }, fresh };
    },
    reset() { gesture = undefined; },
  };
}
