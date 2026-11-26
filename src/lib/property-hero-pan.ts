/** A single, slow reading of the existing photograph, never an invented camera view. */
export function heroPanFrames(frameWidth: number, imageWidth: number, origin = .5): Keyframe[] | null {
  const travel = Math.max(0, imageWidth - frameWidth);
  if (travel < 1) return null;
  return [
    { transform: `translateX(-${travel * Math.min(1, Math.max(0, origin))}px)`, offset: 0, easing: 'ease-in-out' },
    { transform: 'translateX(0px)', offset: 1 / 3, easing: 'ease-in-out' },
    { transform: `translateX(-${travel}px)`, offset: 1 },
  ];
}

export function heroPanShouldPlay(state: {
  mobile: boolean; reduced: boolean; inView: boolean;
  hidden: boolean; paused: boolean; finished: boolean;
}): boolean {
  return state.mobile && !state.reduced && state.inView && !state.hidden && !state.paused && !state.finished;
}

export function initializePropertyHeroPan(hero: HTMLElement): () => void {
  const frame = hero.querySelector<HTMLElement>('.property-hero__media');
  const image = frame?.querySelector<HTMLImageElement>('img');
  const control = hero.querySelector<HTMLButtonElement>('[data-hero-pan-control]');
  if (!frame || !image || !control || typeof image.animate !== 'function'
    || typeof ResizeObserver === 'undefined' || typeof IntersectionObserver === 'undefined') return () => {};

  const mobile = matchMedia('(max-width: 760px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const owner = hero.ownerDocument;
  const events = new AbortController();
  let animation: Animation | undefined;
  let inView = false;
  let paused = false;
  let size = '';

  const syncPlayback = () => {
    const finished = animation?.playState === 'finished';
    control.hidden = !animation || finished;
    control.setAttribute('aria-pressed', String(paused));
    control.setAttribute('aria-label', paused ? 'Reanudar movimiento de la imagen' : 'Pausar movimiento de la imagen');
    if (!animation || finished) { image.style.removeProperty('will-change'); return; }
    const playing = heroPanShouldPlay({ mobile: mobile.matches, reduced: reduced.matches, inView, hidden: owner.hidden, paused, finished });
    image.style.willChange = playing ? 'transform' : 'auto';
    if (playing) animation.play(); else animation.pause();
  };

  const configure = () => {
    const nextSize = `${frame.clientWidth}:${frame.clientHeight}:${mobile.matches}:${reduced.matches}:${image.naturalWidth}:${image.complete}`;
    if (nextSize === size) return;
    size = nextSize;
    const time = Number(animation?.currentTime ?? 0);
    animation?.cancel();
    animation = undefined;
    frame.classList.remove('is-panning');
    control.hidden = true;
    image.style.removeProperty('will-change');
    if (!mobile.matches || reduced.matches || !image.complete || !image.naturalWidth) return;
    // Preserve the actual authored crop (42% on mobile), rather than jumping to 50%.
    const position = getComputedStyle(image).objectPosition.split(' ')[0];
    const origin = position.endsWith('%') ? Number.parseFloat(position) / 100 : .5;
    frame.classList.add('is-panning');
    const frames = heroPanFrames(frame.clientWidth, image.offsetWidth, origin);
    if (!frames) { frame.classList.remove('is-panning'); return; }
    animation = image.animate(frames, { duration: 36000, iterations: 1, fill: 'both' });
    animation.currentTime = time;
    animation.onfinish = () => { control.hidden = true; image.style.removeProperty('will-change'); };
    syncPlayback();
  };

  control.addEventListener('click', () => { paused = !paused; syncPlayback(); }, { signal: events.signal });
  owner.addEventListener('visibilitychange', syncPlayback, { signal: events.signal });
  mobile.addEventListener('change', configure, { signal: events.signal });
  reduced.addEventListener('change', configure, { signal: events.signal });
  image.addEventListener('load', configure, { signal: events.signal });
  const visibility = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncPlayback(); });
  visibility.observe(hero);
  const resize = new ResizeObserver(configure);
  resize.observe(frame);
  configure();

  return () => {
    events.abort();
    visibility.disconnect();
    resize.disconnect();
    animation?.cancel();
    frame.classList.remove('is-panning');
    image.style.removeProperty('will-change');
    control.hidden = true;
  };
}
