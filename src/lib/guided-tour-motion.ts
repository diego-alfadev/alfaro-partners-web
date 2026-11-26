import { animate, inView, scroll } from 'motion';
import { createWheelGesture, nextCheckpoint } from './tour-wheel';
import { createClipClock, createClipNavigation, type ClipStop } from './tour-clip-clock';
import { copyFade, stageMotion, type ActEnter } from './tour-act-blend';

type Values = Record<string, [string | number, string | number]>;
type Bezier = [number, number, number, number];
type Segment = { sel: string; to: Values; from: number; until: number; ease?: Bezier };
type Choreography = { snaps: number[]; segments: (narrow: boolean, act: HTMLElement) => Segment[] };

// Scroll-linked motion reads as calm when it accelerates and settles symmetrically.
const glide: Bezier = [.45, 0, .25, 1];
const settle: Bezier = [.2, .7, .3, 1];
const full = 'inset(0% 0% 0% 0% round 0px)';
// One visible corner radius for every framed photograph (frames, strip, card, rooms).
const inset = (narrow: boolean) => (narrow ? 'inset(8% 10% 8% 10% round 6px)' : 'inset(24% 7% 12% 44% round 6px)');

/** On wide screens the title travels down into the photograph and sits above the caption. */
function revealCopy(narrow: boolean, from: number, until: number): Segment[] {
  if (narrow) return [];
  return [
    { sel: '[data-copy]', to: { y: ['-30svh', '0svh'] }, from, until },
    { sel: '[data-head]', to: { scale: [1, .84] }, from, until },
    // The opening photograph crosses the title early, so the shade has to arrive with it.
    { sel: '[data-shade]', to: { opacity: [0, 1] }, from, until: until + .03 },
  ];
}

/**
 * Each template is a timeline over the pinned scroll range (0 → 1). Transitions
 * live in short windows and the rest are holds, so wherever a reader stops the
 * composition is complete. Snaps mark the holds that close each beat.
 */
const PANEL = 'inset(0% 0% 0% 0% round 0px)';
const SIDE = 'inset(0% 0% 0% 50% round 0px)';

/** Two photographs, arranged by what the second one adds (see PairRelation). */
function pairSegments(narrow: boolean, mode: string): Segment[] {
  const caption: Segment = { sel: '[data-caption]', to: { opacity: [0, 1] }, from: .66, until: .84, ease: settle };
  if (!narrow && mode === 'detail') return [
    { sel: '[data-slide="0"] img', to: { scale: [1.06, 1] }, from: 0, until: .45 },
    // Dimmed as far as the perspective pair, so the card reads as the one photograph in front.
    { sel: '[data-slide="0"] [data-dim]', to: { opacity: [0, .7] }, from: .32, until: .7 },
    { sel: '[data-slide="1"]', to: { y: ['105svh', '0svh'] }, from: .3, until: .72 },
    { sel: '[data-slide="1"] img', to: { scale: [1.08, 1] }, from: .3, until: .8 },
    caption,
  ];
  // Two rooms side by side: the first photograph shrinks into the left frame while
  // the second arrives into the right one. Frames keep the screen's proportion,
  // so neither photograph is cropped to a half-width strip.
  // The radius is set before the .43 scale, so 14px renders as the shared 6px.
  if (!narrow && mode === 'rooms') return [
    { sel: '[data-slide="0"]', to: { x: ['0vw', '-22.5vw'], y: ['0svh', '-14.5svh'], scale: [1, .43], borderRadius: ['0px', '14px'] }, from: .3, until: .72 },
    { sel: '[data-slide="1"]', to: { x: ['75vw', '22.5vw'], y: ['-14.5svh', '-14.5svh'], scale: [.43, .43] }, from: .3, until: .72 },
    { sel: '[data-slide="1"] img', to: { x: ['8%', '0%'] }, from: .3, until: .76 },
    caption,
  ];
  // Perspective (and every pair on narrow screens): the second view slides in over
  // the first, which drifts back and darkens; the frame breathes during the move.
  return [
    { sel: '[data-slide="0"] img', to: { scale: [1.06, 1] }, from: 0, until: .3 },
    { sel: '[data-slide="0"]', to: { x: ['0%', '-30%'] }, from: .3, until: .7 },
    { sel: '[data-slide="0"] [data-dim]', to: { opacity: [0, .7] }, from: .3, until: .7 },
    { sel: '[data-slide="1"]', to: { x: ['100%', '0%'] }, from: .3, until: .7 },
    { sel: '[data-slide="1"] img', to: { x: ['-8%', '0%'] }, from: .3, until: .76 },
    { sel: '[data-strip]', to: { clipPath: [PANEL, narrow ? 'inset(3% 4% 3% 4% round 6px)' : 'inset(4% 3% 4% 3% round 6px)'] }, from: .3, until: .5 },
    { sel: '[data-strip]', to: { clipPath: [narrow ? 'inset(3% 4% 3% 4% round 6px)' : 'inset(4% 3% 4% 3% round 6px)', PANEL] }, from: .5, until: .72 },
    caption,
  ];
}

/** A single photograph opens from an inset frame, or slides in from the side as a panel. */
function revealOpening(narrow: boolean, act: HTMLElement, from: number, until: number): Segment[] {
  // Wide screens: a full-height panel on the right half, framed on the photograph's
  // focal point, widens to full bleed. Both moves share one window so the shift
  // (at most the panel's inset) never uncovers the frame's left edge. No zoom.
  if (act.dataset.entry === 'side' && !narrow) return [
    { sel: '[data-frame]', to: { clipPath: [SIDE, PANEL] }, from, until },
    { sel: '[data-zoom]', to: { x: [getComputedStyle(act).getPropertyValue('--side-shift').trim() || '25%', '0%'] }, from, until },
  ];
  return [
    { sel: '[data-frame]', to: { clipPath: [inset(narrow), full] }, from, until },
    { sel: '[data-zoom]', to: { scale: [1.12, 1] }, from: from - .04, until: until + .08 },
  ];
}

/**
 * Each template is a timeline over the pinned scroll range (0 → 1). Transitions
 * live in short windows and the rest are holds, so wherever a reader stops the
 * composition is complete. Snaps mark the holds that close each beat.
 */
export const choreographies: Record<string, Choreography> = {
  // Opens dimmed on the title; the second beat clears the photograph and lays a
  // dark band under the copy, with place and price.
  cover: {
    snaps: [0, 1],
    segments: (): Segment[] => [
      { sel: '[data-media] img', to: { scale: [1.08, 1] }, from: 0, until: .75 },
      { sel: '[data-veil]', to: { opacity: [.5, .04] }, from: .1, until: .6 },
      { sel: '[data-faldon]', to: { opacity: [0, 1] }, from: .2, until: .6 },
      { sel: '[data-cue]', to: { opacity: [1, 0] }, from: 0, until: .12 },
      { sel: '[data-lede]', to: { opacity: [1, 0] }, from: .05, until: .3 },
      { sel: '[data-title]', to: { y: ['-5svh', '0svh'] }, from: .1, until: .6 },
      { sel: '[data-facts]', to: { opacity: [0, 1], y: ['2svh', '0svh'] }, from: .35, until: .7, ease: settle },
    ],
  },
  // The building entrance doubles as the route: what the visit will show, in order.
  arrival: {
    snaps: [0, 1],
    segments: (narrow, act): Segment[] => {
      const items = act.querySelectorAll('[data-item]').length;
      return [
        { sel: '[data-light]', to: { x: ['-12vw', '10vw'], opacity: [1, .3] }, from: 0, until: .8 },
        { sel: '[data-frame]', to: { clipPath: [narrow ? 'inset(8% 8% 8% 8% round 6px)' : 'inset(10% 16% 10% 16% round 6px)', full] }, from: .05, until: .5 },
        // Climbing the stairs: the frame drifts up the photograph while it settles.
        { sel: '[data-zoom]', to: { scale: [1.1, 1.03], y: ['3%', '-1.5%'] }, from: 0, until: .9 },
        ...Array.from({ length: items }, (_, i): Segment => {
          const from = .3 + i * (.42 / items);
          return { sel: `[data-item="${i}"]`, to: { opacity: [0, 1], y: ['1.6svh', '0svh'] }, from, until: from + .2, ease: settle };
        }),
      ];
    },
  },
  reveal: {
    snaps: [0, 1],
    segments: (narrow, act): Segment[] => [
      { sel: '[data-light]', to: { x: ['-12vw', '10vw'], opacity: [1, 0] }, from: 0, until: .6 },
      ...revealOpening(narrow, act, .12, .62),
      ...revealCopy(narrow, .2, .62),
      { sel: '[data-caption]', to: { opacity: [0, 1], y: ['2.5svh', '0svh'] }, from: .6, until: .8, ease: settle },
    ],
  },
  // A single photograph earns a third beat: the camera walks into it, towards
  // what the next act shows, so the visit reads as one continuous route.
  'reveal-travel': {
    snaps: [0, .5, 1],
    segments: (narrow, act): Segment[] => [
      { sel: '[data-light]', to: { x: ['-12vw', '10vw'], opacity: [1, 0] }, from: 0, until: .34 },
      ...revealOpening(narrow, act, .06, .34),
      ...revealCopy(narrow, .1, .34),
      { sel: '[data-caption]', to: { opacity: [0, 1], y: ['2.5svh', '0svh'] }, from: .3, until: .42, ease: settle },
      { sel: '[data-caption]', to: { opacity: [1, 0] }, from: .56, until: .64 },
      { sel: '[data-travel]', to: { scale: [1, 1] }, from: .56, until: .94 },
      { sel: '[data-caption-next]', to: { opacity: [0, 1], y: ['2.5svh', '0svh'] }, from: .82, until: .94, ease: settle },
    ],
  },
  pair: {
    snaps: [0, 1],
    segments: (narrow, act): Segment[] => [
      { sel: '[data-light]', to: { x: ['-12vw', '10vw'], opacity: [1, .2] }, from: 0, until: .8 },
      ...pairSegments(narrow, act.dataset.mode ?? 'perspective'),
    ],
  },
};

export type Point = [number, string | number, Bezier];
const TRANSFORM_KEYS = ['x', 'y', 'scale'];

function keyframes(points: Point[]) {
  points.sort((p, q) => p[0] - q[0]);
  const values = [points[0][1], ...points.map(([, value]) => value), points[points.length - 1][1]];
  const times = [0, ...points.map(([at]) => at), 1];
  const ease = times.slice(1).map((_, i) => (i % 2 === 1 ? points[i][2] : 'linear'));
  return { values, times, ease };
}

const parse = (value: string | number) => {
  const match = /^(-?[\d.]+)([a-z%]*)$/.exec(String(value));
  return { n: Number(match?.[1] ?? 0), unit: match?.[2] ?? '' };
};

/** A transform prop's value at progress `t`, holding outside its segments and linear inside. */
function valueAt(points: Point[], t: number): string | number {
  if (t <= points[0][0]) return points[0][1];
  for (let i = 0; i < points.length - 1; i++) {
    const [t0, v0] = points[i];
    const [t1, v1] = points[i + 1];
    if (t > t1) continue;
    if (v0 === v1 || t1 === t0) return v1;
    const a = parse(v0), b = parse(v1);
    const n = a.n + (b.n - a.n) * ((t - t0) / (t1 - t0));
    return typeof v1 === 'number' ? n : `${n}${b.unit}`;
  }
  return points[points.length - 1][1];
}

/**
 * x, y and scale of one element are folded into a single `transform` track:
 * independent transforms would be driven from JavaScript on every scroll event,
 * a frame behind the native clip and opacity tracks (lag on phones, flicker on
 * act changes). A plain transform runs on the scroll timeline like the rest.
 */
export function transformTrack(byKey: Map<string, Point[]>) {
  const grid = [...new Set([0, 1, ...[...byKey.values()].flatMap((points) => points.map(([at]) => at))])].sort((p, q) => p - q);
  const compose = (t: number) => {
    const part = (key: string) => (byKey.has(key) ? valueAt(byKey.get(key)!, t) : undefined);
    const x = part('x'), y = part('y'), scale = part('scale');
    return [x !== undefined && `translateX(${x})`, y !== undefined && `translateY(${y})`, scale !== undefined && `scale(${scale})`].filter(Boolean).join(' ');
  };
  const ease = grid.slice(1).map((end, i) => {
    const start = grid[i];
    for (const points of byKey.values()) {
      for (let k = 0; k < points.length - 1; k += 2) {
        if (points[k][0] <= start && points[k + 1][0] >= end && points[k][1] !== points[k + 1][1]) return points[k + 1][2];
      }
    }
    return 'linear' as const;
  });
  return { values: grid.map(compose), times: grid, ease };
}

function track(act: HTMLElement, segments: Segment[]) {
  // Segments sharing an element and property are merged into one keyframe track,
  // so a value can enter and later leave without two animations fighting.
  const elements = new Map<HTMLElement, Map<string, Point[]>>();
  for (const { sel, to, from, until, ease = glide } of segments) {
    const element = act.querySelector<HTMLElement>(sel);
    if (!element) continue;
    const byKey = elements.get(element) ?? new Map<string, Point[]>();
    for (const [key, [a, b]] of Object.entries(to)) byKey.set(key, [...(byKey.get(key) ?? []), [from, a, ease], [until, b, ease]]);
    elements.set(element, byKey);
  }
  const stops: VoidFunction[] = [];
  for (const [element, byKey] of elements) {
    const transforms = new Map([...byKey].filter(([key]) => TRANSFORM_KEYS.includes(key)));
    const tracks: [string, { values: (string | number)[]; times: number[]; ease: (Bezier | 'linear')[] }][] = [...byKey]
      .filter(([key]) => !TRANSFORM_KEYS.includes(key))
      .map(([key, points]) => [key, keyframes(points)]);
    if (transforms.size) {
      for (const points of transforms.values()) points.sort((p, q) => p[0] - q[0]);
      tracks.push(['transform', transformTrack(transforms)]);
    }
    for (const [key, { values, times, ease }] of tracks) {
      const animation = animate(element, { [key]: values }, { duration: 1, times, ease });
      stops.push(scroll(animation, { target: act, offset: ['start start', 'end end'] }));
    }
  }
  return stops;
}

function exit(act: HTMLElement, enters: ActEnter[], index: number) {
  const stage = act.querySelector<HTMLElement>('[data-stage]')!;
  const { offset, keyframes, times } = stageMotion(enters, index, { viewport: innerHeight, act: act.offsetHeight });
  const animation = animate(stage, keyframes, { duration: 1, ease: 'linear', ...(times && { times }) });
  const stops = [scroll(animation, { target: act, offset })];
  const fade = copyFade(enters, index, { viewport: innerHeight, act: act.offsetHeight });
  if (fade) {
    const copy = act.querySelectorAll<HTMLElement>('[data-title], [data-caption]');
    const fading = animate(Array.from(copy), fade.keyframes, { duration: 1, ease: 'linear', times: fade.times });
    stops.push(scroll(fading, { target: act, offset: fade.offset }));
  }
  return () => stops.forEach((stop) => stop());
}

/** Navigation selects a destination; the camera then completes on its own clock. */
export function timedClip(act: HTMLElement, video: HTMLVideoElement, narrow: boolean) {
  const durationMs = narrow ? 1000 : 1400;
  const clock = createClipClock(durationMs);
  const navigation = createClipNavigation();
  let frame = 0;
  let initialized = false;
  let disposed = false;
  let visible = false;
  let finishing = false;
  // True while the video advances by itself; the clock then only decides the handoff.
  let native = false;
  let run = 0;
  let stop: ClipStop = 0;
  let bounds: { start: number; end: number; before: number; after: number } | undefined;
  act.dataset.clipPilot = '';
  act.dataset.clipStop = '0';

  const photo = (at: ClipStop) => { act.dataset.clipStop = String(at); };
  const hide = () => { visible = false; video.removeAttribute('data-playing'); };
  const cancel = (at: ClipStop = stop) => {
    cancelAnimationFrame(frame);
    clock.reset(at);
    stop = at;
    finishing = false;
    native = false;
    run++;
    hide();
    video.pause();
    photo(at);
  };
  const land = () => {
    native = false;
    video.pause();
    photo(stop);
    hide(); // The CSS blend restores the real photograph first, then fades the video: never a frozen AI frame.
    finishing = false;
  };
  const frameTime = (value: number) => Math.min(value * video.duration, Math.max(0, video.duration - .04));
  const seek = () => {
    if (disposed || !video.duration || video.seeking) return;
    const { value, running } = clock.sample(performance.now());
    if (!running && !finishing) return;
    if (!native) {
      // Keep only the latest clock sample, including backward movement.
      const time = frameTime(value);
      if (Math.abs(video.currentTime - time) > .02) video.currentTime = time;
    }
    if (!visible && !video.seeking) {
      visible = true;
      video.dataset.playing = 'true';
    }
    if (finishing && !video.seeking) land();
  };
  /** Forward travel plays natively: a seek per frame stutters, a playbackRate does not. */
  const play = (from: number) => {
    const rate = (1 - from) * video.duration / (durationMs / 1000);
    video.playbackRate = Math.min(8, Math.max(.25, rate));
    const time = frameTime(from);
    if (Math.abs(video.currentTime - time) > .02) video.currentTime = time;
    native = true;
    const token = ++run;
    video.play().catch(() => {
      if (token !== run) return;
      native = false;
      seek();
    });
  };
  const decoded = () => {
    if (disposed) return;
    if (clock.sample(performance.now()).running && !visible) {
      visible = true;
      video.dataset.playing = 'true';
    }
    seek();
  };
  video.addEventListener('seeked', decoded);
  const tick = (now: number) => {
    const state = clock.sample(now);
    if (!state.running) finishing = true;
    seek();
    if (state.running) frame = requestAnimationFrame(tick);
    // A decoder that stalls must not hold the reader on an AI frame indefinitely.
    else if (finishing) land();
  };
  const fail = () => {
    // Loading owns recoverable source failures; a post-ready decoder error is fatal.
    if (video.dataset.state === 'loading') return;
    video.dataset.state = 'failed';
    cancel();
  };
  video.addEventListener('error', fail);

  return {
    sync(y: number) {
      if (disposed) return;
      if (!bounds) {
        const snaps = Array.from(act.querySelectorAll<HTMLElement>('.tour-snap'));
        bounds = {
          start: act.offsetTop + snaps[0].offsetTop,
          end: act.offsetTop + snaps[snaps.length - 1].offsetTop,
          before: act.offsetTop - innerHeight * .5,
          after: act.offsetTop + act.offsetHeight - innerHeight * .5,
        };
      }
      const at: ClipStop = y < (bounds.start + bounds.end) / 2 ? 0 : 1;
      if (document.hidden || y < bounds.before || y > bounds.after) {
        if (initialized) cancel(at);
        navigation.reset();
        initialized = false;
        return;
      }
      if (!initialized) {
        cancel(at);
        // Chapter links land at actTop, not its inset checkpoint. Restore the
        // logical photograph and departure anchor together without replaying.
        navigation.reset(y);
        initialized = true;
        return;
      }
      const checkpoint = navigation.select(y, bounds.start, bounds.end);
      if (checkpoint === undefined || checkpoint === stop) return;
      stop = checkpoint;
      cancelAnimationFrame(frame);
      if (native) {
        // The frame on screen is more accurate than the clock for a retarget.
        if (video.duration) clock.resume(video.currentTime / video.duration);
        native = false;
        run++;
        video.pause();
      }
      const state = clock.request(checkpoint, video.dataset.state === 'ready', performance.now());
      finishing = false;
      if (!state.running) { hide(); photo(checkpoint); return; }
      if (checkpoint === 1 && video.duration) play(state.value);
      seek();
      frame = requestAnimationFrame(tick);
    },
    resetLayout() { bounds = undefined; navigation.reset(); },
    cancel,
    dispose() {
      disposed = true;
      cancel();
      video.removeEventListener('seeked', decoded);
      video.removeEventListener('error', fail);
      delete act.dataset.clipPilot;
      delete act.dataset.clipStop;
    },
  };
}

/** Prime seekable clips; retain the original same-origin URL when blob media is blocked. */
export async function loadClip(video: HTMLVideoElement) {
  if (video.dataset.state) return;
  video.dataset.state = 'loading';
  const loadSource = (source: string) => new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      video.removeEventListener('loadeddata', loaded);
      video.removeEventListener('error', failed);
    };
    const loaded = () => { cleanup(); resolve(); };
    const failed = () => { cleanup(); reject(new Error('Clip source unavailable')); };
    // Register before src/load: cached media can settle before the next task.
    video.addEventListener('loadeddata', loaded);
    video.addEventListener('error', failed);
    const timer = setTimeout(failed, 5000);
    try {
      video.preload = 'auto';
      video.src = source;
      video.load();
      if (video.readyState >= 2) loaded();
    } catch (error) { cleanup(); reject(error); }
  });
  let objectURL: string | undefined;
  try {
    try {
      // The blob path preserves the existing iOS seek/first-frame behavior.
      const response = await fetch(video.dataset.src!);
      if (!response.ok) throw new Error('Clip fetch unavailable');
      objectURL = URL.createObjectURL(await response.blob());
      await loadSource(objectURL);
    } catch {
      if (objectURL) URL.revokeObjectURL(objectURL);
      // A strict media-src may reject blob: while allowing our original MP4.
      // Keep the CSP unchanged; the server supports native byte-range playback.
      await loadSource(video.dataset.src!);
    }
    await video.play().catch(() => {});
    video.pause();
    video.dataset.state = 'ready';
  } catch {
    video.dataset.state = 'failed';
  }
}

/**
 * Checkpoints sit just inside the pinned range, never on its edges. A snap or
 * fling settling with a few pixels of overshoot would otherwise unpin the sticky
 * stage for a frame and make the whole scene jump (seen on iOS and devtools touch).
 * Holds cover the first and last few percent of every act, so nothing shows.
 */
const SNAP_INSET = '2.5svh';
function snapTop(at: number, pinned: boolean) {
  if (pinned && at === 0) return SNAP_INSET;
  if (at === 1) return `calc(100% - 100svh - ${SNAP_INSET})`;
  return `calc(${at} * (100% - 100svh))`;
}

export function mountTour(): () => void {
  const root = document.querySelector<HTMLElement>('[data-tour]');
  if (!root) return () => {};
  const acts = Array.from(root.querySelectorAll<HTMLElement>('[data-act]'));
  const current = root.querySelector<HTMLElement>('[data-current]')!;
  const count = root.querySelector<HTMLElement>('[data-count]')!;
  const announcement = root.querySelector<HTMLElement>('[data-announcement]')!;
  const previous = root.querySelector<HTMLButtonElement>('[data-previous]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]')!;
  const chapters = root.querySelector<HTMLElement>('#tour-chapters')!;
  const curtain = root.querySelector<HTMLElement>('[data-curtain]')!;
  const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-chapter-link]'));
  const gotos = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-goto]'));
  const hint = root.querySelector<HTMLElement>('[data-hint]')!;
  const restarts = Array.from(root.querySelectorAll<HTMLElement>('[data-restart]'));
  const segmentsBar = Array.from(root.querySelectorAll<HTMLElement>('[data-segment]'));
  const html = document.documentElement;
  const abort = new AbortController();
  const { signal } = abort;
  const cleanups: (() => void)[] = [];
  const motion = document.documentElement.classList.contains('tour-motion');
  const narrowQuery = matchMedia('(max-width: 899px)');
  // On touch screens the browser's own mandatory snapping does the checkpoints
  // (one swipe, one stop, native momentum); the JavaScript settle stays off there.
  const touch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  const clips: ReturnType<typeof timedClip>[] = [];

  function choreograph() {
    cleanups.splice(0).forEach((stop) => stop());
    root!.querySelectorAll('.tour-snap').forEach((snap) => snap.remove());
    // Only choreographed acts have a stage animation to carry the dissolve.
    const enters = acts.map((act): ActEnter => (choreographies[act.dataset.act!] && act.dataset.enter === 'dissolve' ? 'dissolve' : undefined));
    for (const [index, act] of acts.entries()) {
      const plan = choreographies[act.dataset.act!];
      for (const at of plan?.snaps ?? [0]) {
        const snap = document.createElement('span');
        snap.className = 'tour-snap';
        snap.style.top = snapTop(at, Boolean(plan) && act !== acts[0]);
        act.append(snap);
      }
      if (!motion) continue;
      if (plan) {
        const clip = act.querySelector<HTMLVideoElement>('video[data-clip]');
        const segments = plan.segments(narrowQuery.matches, act).filter((segment) => !clip || segment.sel === '[data-light]').map((segment) => {
          if (segment.sel !== '[data-travel]') return segment;
          const scale = Number(act.querySelector<HTMLElement>('[data-travel]')?.dataset.scale ?? 1.5);
          return { ...segment, to: { scale: [1, scale] as [number, number] } };
        });
        cleanups.push(...track(act, segments), exit(act, enters, index));
        if (clip) {
          const controller = timedClip(act, clip, narrowQuery.matches);
          clips.push(controller);
          cleanups.push(() => controller.dispose());
        }
      } else {
        const copy = act.querySelector<HTMLElement>('[data-title]');
        if (copy) cleanups.push(inView(act, () => {
          animate(copy, { opacity: [0, 1], transform: ['translateY(3svh)', 'translateY(0svh)'] }, { duration: .9, ease: settle });
        }, { amount: .45 }));
      }
    }
  }

  // Measured once per layout, not per scroll frame: reading layout while the
  // compositor scrolls forces extra main-thread work on every frame.
  let cachedTops: number[] | undefined;
  const snapTops = () => (cachedTops ??= Array.from(root.querySelectorAll<HTMLElement>('.tour-snap'))
    .map((snap) => Math.round(snap.getBoundingClientRect().top + scrollY))
    .sort((a, b) => a - b));
  const actTops = () => acts.map((act) => act.offsetTop);
  let cachedActTops: number[] | undefined;
  addEventListener('resize', () => { cachedTops = undefined; cachedActTops = undefined; clips.forEach((clip) => clip.resetLayout()); }, { passive: true, signal });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clips.forEach((clip) => clip.cancel()); }, { signal });

  let active = -1;
  function sync() {
    clips.forEach((clip) => clip.sync(scrollY));
    const probe = scrollY + innerHeight * .5;
    let index = 0;
    (cachedActTops ??= actTops()).forEach((top, i) => { if (top <= probe) index = i; });
    const tops = snapTops();
    const atStart = scrollY <= 4, atEnd = scrollY >= tops[tops.length - 1] - 4;
    if (previous.disabled !== atStart) previous.disabled = atStart;
    if (next.disabled !== atEnd) next.disabled = atEnd;
    if (index === active) return;
    active = index;
    current.textContent = acts[index].dataset.label!;
    count.textContent = `${index + 1} / ${acts.length}`;
    links.forEach((link, i) => link.toggleAttribute('aria-current', i === index));
    segmentsBar.forEach((segment, i) => { segment.classList.toggle('is-done', i < index); segment.classList.toggle('is-current', i === index); });
    // Load the next two acts ahead of time so no photograph arrives half-decoded.
    for (const act of acts.slice(index + 1, index + 3)) act.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
    if (motion) for (const act of acts.slice(Math.max(0, index - 1), index + 3)) act.querySelectorAll<HTMLVideoElement>('video[data-clip]').forEach((video) => { loadClip(video); });
    announcement.textContent = `${acts[index].dataset.label}, ${index + 1} de ${acts.length}`;
  }

  const LANDING_GUARD_MS = 600;
  let glideTo: ReturnType<typeof animate> | undefined;
  let gliding = false;
  // Where the last wheel gesture landed, so its residual momentum cannot carry on.
  let landing: { y: number; at: number } | undefined;
  function travel(top: number, { duration, ease = [.4, 0, .2, 1] as Bezier, wheelLanding = false }: { duration?: number; ease?: Bezier; wheelLanding?: boolean } = {}) {
    glideTo?.stop();
    landing = undefined;
    const land = () => { if (wheelLanding) landing = { y: top, at: performance.now() }; };
    const distance = Math.abs(top - scrollY);
    if (!motion || distance < 2) { window.scrollTo({ top, behavior: 'instant' }); land(); return; }
    gliding = true;
    // Mandatory snapping would re-snap every intermediate frame of the glide.
    html.classList.add('tour-gliding');
    glideTo = animate(scrollY, top, {
      duration: duration ?? Math.min(1.6, Math.max(.6, distance / 1100)), ease,
      onUpdate: (value) => window.scrollTo({ top: value, behavior: 'instant' }),
      onComplete: () => { gliding = false; glideTo = undefined; html.classList.remove('tour-gliding'); land(); },
    });
  }
  function release() { if (gliding) { glideTo?.stop(); glideTo = undefined; gliding = false; html.classList.remove('tour-gliding'); } }

  // Long distances cut through a dark curtain instead of scrolling past every act.
  let cutting = false;
  async function jump(top: number) {
    if (!motion || Math.abs(top - scrollY) < innerHeight * 2.5) { travel(top); return; }
    if (cutting) return;
    cutting = true; release();
    clips.forEach((clip) => clip.cancel());
    await animate(curtain, { opacity: [0, 1] }, { duration: .32, ease: [.4, 0, 1, 1] });
    window.scrollTo({ top, behavior: 'instant' });
    sync();
    await animate(curtain, { opacity: [1, 0] }, { duration: .6, ease: settle });
    cutting = false;
  }

  function step(direction: 1 | -1) {
    const target = nextCheckpoint(snapTops(), scrollY, direction);
    if (target !== undefined) travel(target);
  }

  // Wheel and trackpad: one gesture advances one checkpoint (see tour-wheel.ts).
  const wheel = createWheelGesture();
  const onWheel = (event: WheelEvent) => {
    if (!motion || cutting || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (chapters.matches(':popover-open')) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    const { intent, fresh } = wheel.next(event.deltaY * unit, event.timeStamp, scrollY, snapTops(), innerHeight);
    if (fresh) release();
    if (intent.kind === 'pass') return;
    event.preventDefault();
    if (intent.kind === 'stop') travel(intent.at, { duration: .34, ease: settle, wheelLanding: true });
    if (intent.kind === 'carry') {
      // Continue at the speed the momentum had, then ease into the checkpoint.
      const distance = Math.abs(intent.at - scrollY);
      const duration = Math.min(1.3, Math.max(.45, (2 * distance) / Math.max(.05, intent.velocity * 1000)));
      travel(intent.at, { duration, ease: [.25, .5, .3, 1], wheelLanding: true });
    }
  };

  // Touch, keyboard and scrollbar: a reader who stops mid-transition is carried
  // on to the composition they were heading to. Never pulls back.
  let lastY = scrollY;
  let heading: 1 | -1 = 1;
  let idle = 0;
  function settleScroll() {
    if (!motion || touch || gliding || cutting) return;
    const tops = snapTops();
    const y = scrollY;
    if (tops.some((top) => Math.abs(top - y) < 6)) return;
    // Residual momentum from the gesture that just landed drifts a few pixels off
    // the checkpoint: settle back to it. Only a real crossing is carried on.
    if (landing) {
      const off = Math.abs(y - landing.y);
      const recent = performance.now() - landing.at < LANDING_GUARD_MS;
      if (off < innerHeight * .1 || (recent && off < innerHeight * .3)) { travel(landing.y, { duration: .3, ease: settle }); return; }
    }
    const target = nextCheckpoint(tops, y, heading);
    if (target !== undefined && Math.abs(target - y) < innerHeight * 1.7) travel(target);
  }

  choreograph();
  cachedTops = undefined;
  sync();
  // Motion keeps each element's last animated value, so the other layout's
  // choreography would inherit stray transforms. Crossing the breakpoint (a
  // rotated tablet, devtools) reloads in place instead; the browser keeps the scroll.
  narrowQuery.addEventListener('change', () => location.reload(), { signal });
  let frame = 0;
  addEventListener('scroll', () => {
    cancelAnimationFrame(frame); frame = requestAnimationFrame(sync);
    if (gliding || cutting) return;
    if (scrollY !== lastY) heading = scrollY > lastY ? 1 : -1;
    lastY = scrollY;
    clearTimeout(idle); idle = window.setTimeout(settleScroll, 140);
  }, { passive: true, signal });
  addEventListener('wheel', onWheel, { passive: false, signal });
  for (const type of ['touchstart', 'pointerdown'] as const) addEventListener(type, () => { release(); wheel.reset(); }, { passive: true, signal });
  // Touch: tapping the photograph advances (left edge goes back), like stories.
  if (touch) root.querySelector('main')!.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a, button, input, [popover]')) return;
    step(event.clientX < innerWidth * .28 ? -1 : 1);
    dismissHint();
  }, { signal });
  previous.addEventListener('click', () => step(-1), { signal });
  next.addEventListener('click', () => step(1), { signal });
  gotos.forEach((link) => link.addEventListener('click', (event) => {
    const act = acts.find(({ id }) => id === link.dataset.goto);
    if (!act) return;
    event.preventDefault();
    if (chapters.matches(':popover-open')) chapters.hidePopover();
    jump(act.offsetTop);
    history.replaceState(history.state, '', `#${act.id}`);
  }, { signal }));
  restarts.forEach((button) => button.addEventListener('click', () => {
    jump(0);
    history.replaceState(history.state, '', location.pathname);
  }, { signal }));
  // Presentation keys: every arrow, page key and space moves one checkpoint.
  const forward = ['ArrowDown', 'ArrowRight', 'PageDown'];
  const backward = ['ArrowUp', 'ArrowLeft', 'PageUp'];
  addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.altKey || event.metaKey || event.ctrlKey) return;
    if ((event.target as HTMLElement).closest('input, textarea, select, button, a, [contenteditable]') && event.key === ' ') return;
    if ((event.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return;
    const space = event.key === ' ';
    if (forward.includes(event.key) || (space && !event.shiftKey)) { event.preventDefault(); step(1); dismissHint(); return; }
    if (backward.includes(event.key) || (space && event.shiftKey)) { event.preventDefault(); step(-1); return; }
    if (event.key === 'Home') { event.preventDefault(); jump(0); return; }
    if (event.key === 'End') { event.preventDefault(); const tops = snapTops(); jump(tops[tops.length - 1]); return; }
    release();
  }, { signal });

  // First-time guidance: how to move through the visit, gone after the first step.
  let hintShown = false;
  const hintTimer = window.setTimeout(() => {
    if (scrollY > 40) return;
    hintShown = true;
    hint.classList.add('is-visible');
    window.setTimeout(dismissHint, 9000);
  }, 1400);
  function dismissHint() {
    clearTimeout(hintTimer);
    if (hintShown) hint.classList.remove('is-visible');
  }
  addEventListener('scroll', () => { if (scrollY > 120) dismissHint(); }, { passive: true, signal });

  return () => { abort.abort(); release(); html.classList.remove('tour-gliding'); clearTimeout(idle); clearTimeout(hintTimer); cleanups.forEach((stop) => stop()); };
}
