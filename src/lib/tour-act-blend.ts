export type ActEnter = 'dissolve' | undefined;

export type StageMotion = {
  /** Scroll range of the act's stage animation, in Motion's `scroll()` offset syntax. */
  offset: [string, string];
  keyframes: { transform: string[]; opacity?: number[] };
  /** Keyframe positions; only present when the entry and the exit share one animation. */
  times?: number[];
};

const DRIFT = 'translateY(28svh)';
const PIN = 'translateY(100svh)';

/**
 * How the stage of act `index` moves when the acts around it change.
 *
 * Acts are stacked in flow, so leaving one normally drifts it down and dims it
 * while the next scrolls up from below. When the NEXT act enters by dissolve, the
 * outgoing stage instead translates by exactly the viewport height the page
 * scrolls, which keeps it pinned in place. The dissolving act cancels its own
 * natural rise the same way and fades in.
 *
 * Entry and exit of one stage are a single animation: Motion animations fill
 * both ways, so two animations on the same `transform` would override each
 * other outside their own range. `viewport` and `act` are in pixels; they place
 * the end of the entry and the start of the exit within the combined range.
 */
export function stageMotion(enters: ActEnter[], index: number, { viewport, act }: { viewport: number; act: number }): StageMotion {
  const dissolveIn = index > 0 && enters[index] === 'dissolve';
  const pinned = enters[index + 1] === 'dissolve';
  const leave = pinned ? PIN : DRIFT;
  const leaveOpacity = pinned ? 1 : .35;

  if (!dissolveIn) {
    return {
      offset: ['end end', 'end start'],
      keyframes: pinned ? { transform: ['translateY(0svh)', PIN] } : { transform: ['translateY(0svh)', DRIFT], opacity: [1, leaveOpacity] },
    };
  }
  const span = viewport + act;
  return {
    offset: ['start end', 'end start'],
    times: [0, viewport / span, act / span, 1],
    keyframes: {
      transform: ['translateY(-100svh)', 'translateY(0svh)', 'translateY(0svh)', leave],
      opacity: [0, 1, 1, leaveOpacity],
    },
  };
}

export type CopyFade = {
  offset: [string, string];
  keyframes: { filter: string[] };
  times: number[];
};

/** Share of the crossing during which the outgoing copy is already gone / the incoming copy has not started. */
const OUT_BY = .4;
const IN_FROM = .55;

/**
 * The dissolve keeps both stages on screen for one viewport of scroll, so their
 * headings and captions would overprint each other. The outgoing copy leaves in the
 * first part of the crossing and the incoming copy arrives in the last, while the
 * photographs cross-fade throughout. `filter: opacity()` is used because the
 * captions already own their `opacity` track. Returns undefined when the act is not
 * next to a dissolve.
 */
export function copyFade(enters: ActEnter[], index: number, { viewport, act }: { viewport: number; act: number }): CopyFade | undefined {
  const dissolveIn = index > 0 && enters[index] === 'dissolve';
  const pinned = enters[index + 1] === 'dissolve';
  const on = 'opacity(1)', off = 'opacity(0)';
  if (!dissolveIn && !pinned) return undefined;
  if (!dissolveIn) return { offset: ['end end', 'end start'], keyframes: { filter: [on, off, off] }, times: [0, OUT_BY, 1] };
  const span = viewport + act;
  const entered = viewport / span;
  const entry = [off, off, on];
  const entryTimes = [0, entered * IN_FROM, entered];
  if (!pinned) return { offset: ['start end', 'end start'], keyframes: { filter: [...entry, on] }, times: [...entryTimes, 1] };
  const leaving = act / span;
  return {
    offset: ['start end', 'end start'],
    keyframes: { filter: [...entry, on, off, off] },
    times: [...entryTimes, leaving, leaving + (viewport / span) * OUT_BY, 1],
  };
}
