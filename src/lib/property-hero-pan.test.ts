import { describe, expect, test } from 'bun:test';
import { heroPanFrames, heroPanShouldPlay, initializePropertyHeroPan } from './property-hero-pan';

describe('mobile property hero pan', () => {
  test('starts at the existing central crop and reveals both image edges without gaps', () => {
    const frames = heroPanFrames(375, 1500, .42);
    expect(frames).toEqual([
      { transform: 'translateX(-472.5px)', offset: 0, easing: 'ease-in-out' },
      { transform: 'translateX(0px)', offset: 1 / 3, easing: 'ease-in-out' },
      { transform: 'translateX(-1125px)', offset: 1 },
    ]);
  });

  test('a photograph that already fits does not acquire artificial travel', () => {
    expect(heroPanFrames(375, 375)).toBeNull();
    expect(heroPanFrames(375, 320)).toBeNull();
  });

  test('autoplay requires mobile, normal motion, visible hero and visible document', () => {
    const allowed = { mobile: true, reduced: false, inView: true, hidden: false, paused: false, finished: false };
    expect(heroPanShouldPlay(allowed)).toBe(true);
    for (const changed of [
      { mobile: false }, { reduced: true }, { inView: false },
      { hidden: true }, { paused: true }, { finished: true },
    ]) expect(heroPanShouldPlay({ ...allowed, ...changed })).toBe(false);
  });

  test('the public initializer handles progressive loading, pause, visibility and reduced motion', () => {
    const old = { matchMedia: globalThis.matchMedia, getComputedStyle: globalThis.getComputedStyle, ResizeObserver: globalThis.ResizeObserver, IntersectionObserver: globalThis.IntersectionObserver };
    const mobile = Object.assign(new EventTarget(), { matches: true });
    const reduced = Object.assign(new EventTarget(), { matches: false });
    let intersect: (entries: { isIntersecting: boolean }[]) => void = () => {};
    let animation: { playState: string; currentTime: number; onfinish?: () => void; play(): void; pause(): void; cancel(): void } | undefined;
    let starts = 0;
    let initialFrame = '';
    const classes = new Set<string>();
    const attrs = new Map<string, string>();
    const style = { willChange: '', removeProperty() { this.willChange = ''; } };
    const owner = Object.assign(new EventTarget(), { hidden: false });
    const image = Object.assign(new EventTarget(), {
      complete: false, naturalWidth: 1800, offsetWidth: 1500, style,
      animate(frames: Keyframe[]) {
        starts++;
        initialFrame = String(frames[0].transform);
        animation = { playState: 'running', currentTime: 0,
          play() { this.playState = 'running'; }, pause() { this.playState = 'paused'; },
          cancel() { this.playState = 'idle'; } };
        return animation;
      },
    });
    const control = Object.assign(new EventTarget(), { hidden: true, setAttribute(name: string, value: string) { attrs.set(name, value); } });
    const frame = { clientWidth: 375, clientHeight: 1000, classList: { add: (s: string) => classes.add(s), remove: (s: string) => classes.delete(s) }, querySelector: () => image };
    const hero = { ownerDocument: owner, querySelector: (s: string) => s === '.property-hero__media' ? frame : control };
    try {
      globalThis.matchMedia = ((query: string) => query.includes('max-width') ? mobile : reduced) as typeof matchMedia;
      globalThis.getComputedStyle = (() => ({ objectPosition: '42% 50%' })) as typeof getComputedStyle;
      globalThis.ResizeObserver = class { observe() {} disconnect() {} } as unknown as typeof ResizeObserver;
      globalThis.IntersectionObserver = class {
        constructor(callback: typeof intersect) { intersect = callback; }
        observe() {} disconnect() {}
      } as unknown as typeof IntersectionObserver;
      const dispose = initializePropertyHeroPan(hero as unknown as HTMLElement);
      expect(starts).toBe(0);
      image.complete = true;
      image.dispatchEvent(new Event('load'));
      expect(starts).toBe(1);
      expect(initialFrame).toBe('translateX(-472.5px)');
      expect(animation?.playState).toBe('paused');
      intersect([{ isIntersecting: true }]);
      expect(animation?.playState).toBe('running');
      control.dispatchEvent(new Event('click'));
      expect(attrs.get('aria-pressed')).toBe('true');
      expect(animation?.playState).toBe('paused');
      owner.hidden = true;
      owner.dispatchEvent(new Event('visibilitychange'));
      control.dispatchEvent(new Event('click'));
      expect(animation?.playState).toBe('paused');
      owner.hidden = false;
      owner.dispatchEvent(new Event('visibilitychange'));
      expect(animation?.playState).toBe('running');
      intersect([{ isIntersecting: false }]);
      expect(animation?.playState).toBe('paused');
      reduced.matches = true;
      reduced.dispatchEvent(new Event('change'));
      expect(control.hidden).toBe(true);
      expect(classes.has('is-panning')).toBe(false);
      dispose();
    } finally {
      Object.assign(globalThis, old);
    }
  });
});
