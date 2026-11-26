export type ClipStop = 0 | 1;

export function clipCheckpoint(y: number, start: number, end: number): ClipStop | undefined {
  if (Math.abs(y - start) <= 6) return 0;
  if (Math.abs(y - end) <= 6) return 1;
  return undefined;
}

/**
 * A meaningful departure starts the camera on every device. On touch the stage is
 * pinned, so waiting for native snap arrival left the finger with no visible effect
 * and delayed the clip by the whole snap animation.
 */
export function createClipNavigation() {
  let anchor: number | undefined;
  return {
    reset(restoredY?: number) { anchor = restoredY; },
    select(y: number, start: number, end: number): ClipStop | undefined {
      const arrived = clipCheckpoint(y, start, end);
      if (arrived !== undefined) { anchor = y; return arrived; }
      if (anchor === undefined || y < start || y > end) return undefined;
      const movement = y - anchor;
      if (Math.abs(movement) < 24) return undefined;
      anchor = y;
      return movement > 0 ? 1 : 0;
    },
  };
}

/** A camera clock, deliberately independent of scroll distance and finger speed. */
export function createClipClock(durationMs: number) {
  let value = 0;
  let target: ClipStop = 0;
  let from = 0;
  let started = 0;
  let running = false;

  const sample = (now: number) => {
    if (running) {
      const elapsed = Math.min(1, Math.max(0, (now - started) / durationMs));
      value = from + (target - from) * elapsed;
      if (elapsed === 1) running = false;
    }
    return { value, target, running };
  };
  const reset = (stop: ClipStop) => {
    target = stop;
    value = stop;
    running = false;
    return { value, target, running };
  };
  return {
    sample,
    reset,
    /** Rebases on the frame actually shown; the next request continues from it. */
    resume(frame: number) {
      value = Math.min(1, Math.max(0, frame));
      from = value;
      running = false;
    },
    request(stop: ClipStop, ready: boolean, now: number) {
      sample(now);
      if (stop === target) return { value, target, running };
      if (!ready) return reset(stop);
      from = value;
      target = stop;
      started = now;
      running = value !== target;
      return { value, target, running };
    },
  };
}
