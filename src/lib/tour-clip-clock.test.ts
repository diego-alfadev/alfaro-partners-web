import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { clipCheckpoint, createClipClock, createClipNavigation } from './tour-clip-clock';
import { timedClip } from './guided-tour-motion';

const GLOBALS = ['document', 'innerHeight', 'requestAnimationFrame', 'cancelAnimationFrame'];

/** One fake pinned act (snaps at 1025 and 2575) driven by a manual clock and rAF queue. */
function mountClip(narrow: boolean, play: () => Promise<void> = () => Promise.resolve()) {
  const originals = new Map(GLOBALS.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const realNow = performance.now;
  const frames = new Map<number, FrameRequestCallback>();
  let nextFrame = 0;
  const act = {
    dataset: {} as Record<string, string>, offsetTop: 1000, offsetHeight: 2600,
    querySelectorAll: () => [{ offsetTop: 25 }, { offsetTop: 1575 }],
  };
  class FakeVideo extends EventTarget {
    dataset: Record<string, string> = { state: 'ready' };
    duration = 5;
    seeking = false;
    currentTime = 0;
    playbackRate = 1;
    plays = 0;
    pauses = 0;
    pause() { this.pauses++; }
    play() { this.plays++; return play(); }
    removeAttribute(name: string) { if (name === 'data-playing') delete this.dataset.playing; }
  }
  const video = new FakeVideo();
  let now = 0;
  performance.now = () => now;
  Object.defineProperties(globalThis, {
    document: { configurable: true, value: { hidden: false } },
    innerHeight: { configurable: true, value: 1000 },
    requestAnimationFrame: { configurable: true, value: (callback: FrameRequestCallback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    } },
    cancelAnimationFrame: { configurable: true, value: (id: number) => { frames.delete(id); } },
  });
  const controller = timedClip(act as unknown as HTMLElement, video as unknown as HTMLVideoElement, narrow);
  return {
    act, video, frames, controller,
    frameCount: () => nextFrame,
    at(ms: number) { now = ms; },
    restore() {
      controller.dispose();
      performance.now = realNow;
      for (const [key, descriptor] of originals) {
        if (descriptor) Object.defineProperty(globalThis, key, descriptor);
        else Reflect.deleteProperty(globalThis, key);
      }
    },
  };
}

describe('independent tour clip clock', () => {
  test('only a checkpoint arrival selects a photograph, not finger progress', () => {
    assert.equal(clipCheckpoint(100, 100, 1700), 0);
    assert.equal(clipCheckpoint(1696, 100, 1700), 1);
    assert.equal(clipCheckpoint(900, 100, 1700), undefined);
    assert.equal(clipCheckpoint(1707, 100, 1700), undefined);
  });
  test('mobile completes in one second without another scroll sample', () => {
    const clock = createClipClock(1000);
    clock.request(1, true, 0);
    assert.equal(clock.sample(500).value, .5);
    assert.deepEqual(clock.sample(1000), { value: 1, target: 1, running: false });
  });
  test('desktop owns the shorter 1.4-second duration', () => {
    const clock = createClipClock(1400);
    clock.request(1, true, 100);
    assert.equal(clock.sample(800).value, .5);
    assert.equal(clock.sample(1500).running, false);
  });

  test('desktop starts on departure, ignores tiny jitter and does not replay on arrival', () => {
    const navigation = createClipNavigation();
    const clock = createClipClock(1400);
    assert.equal(navigation.select(100, 100, 1700), 0);
    assert.equal(navigation.select(105, 100, 1700), 0);
    assert.equal(navigation.select(115, 100, 1700), undefined);
    assert.equal(navigation.select(125, 100, 1700), undefined);
    assert.equal(navigation.select(140, 100, 1700), 1);
    clock.request(1, true, 0);
    assert.equal(clock.request(navigation.select(1700, 100, 1700)!, true, 500).value, 500 / 1400);
    assert.equal(clock.sample(1400).running, false);
  });

  test('desktop reverse departure retargets before reaching the original photo', () => {
    const navigation = createClipNavigation();
    navigation.select(100, 100, 1700);
    assert.equal(navigation.select(140, 100, 1700), 1);
    assert.equal(navigation.select(900, 100, 1700), 1);
    assert.equal(navigation.select(888, 100, 1700), undefined);
    assert.equal(navigation.select(870, 100, 1700), 0);
  });

  test('a drag that snaps back to its origin retargets to the original photo', () => {
    const navigation = createClipNavigation();
    assert.equal(navigation.select(100, 100, 1700), 0);
    assert.equal(navigation.select(140, 100, 1700), 1);
    assert.equal(navigation.select(104, 100, 1700), 0);
  });

  test('entering mid-act or resetting layout does not invent desktop intent', () => {
    const navigation = createClipNavigation();
    assert.equal(navigation.select(900, 100, 1700), undefined);
    navigation.select(100, 100, 1700);
    navigation.reset();
    assert.equal(navigation.select(140, 100, 1700), undefined);
  });

  test('the existing reading scrim is structurally layered above video and below copy', () => {
    const css = readFileSync(new URL('../styles/property-guided-tour.css', import.meta.url), 'utf8');
    const markup = readFileSync(new URL('../components/property/GuidedTour.astro', import.meta.url), 'utf8');
    assert.match(css, /\.tour-act--pair\[data-clip-pilot\] \.tour-strip \{[^}]*z-index: 0/);
    assert.match(css, /\.tour-act--pair\[data-clip-pilot\] \.tour-scrim \{[^}]*z-index: 1/);
    assert.match(css, /\.tour-pair__copy \{[^}]*z-index: 2/);
    const pair = markup.slice(markup.indexOf("act.template === 'pair' &&"));
    assert.ok(pair.indexOf('class="tour-scrim"') > pair.indexOf('<video'));
    assert.ok(pair.indexOf('class="tour-pair__copy"') > pair.indexOf('class="tour-scrim"'));
  });
  test('duplicate checkpoint events do not restart or replay', () => {
    const clock = createClipClock(1000);
    clock.request(1, true, 0);
    clock.request(1, true, 500);
    assert.equal(clock.sample(1000).running, false);
    assert.equal(clock.request(1, true, 2000).running, false);
  });
  test('reverse starts at the current frame instead of jumping to the end', () => {
    const clock = createClipClock(1000);
    clock.request(1, true, 0);
    assert.equal(clock.request(0, true, 400).value, .4);
    assert.equal(clock.sample(900).value, .2);
    assert.deepEqual(clock.sample(1400), { value: 0, target: 0, running: false });
  });
  test('rapid retarget has only the latest destination', () => {
    const clock = createClipClock(1000);
    clock.request(1, true, 0);
    clock.request(0, true, 400);
    const before = clock.sample(600).value;
    assert.equal(clock.request(1, true, 600).value, before);
    assert.deepEqual(clock.sample(1600), { value: 1, target: 1, running: false });
  });
  test('pending or failed media uses photographs without late replay', () => {
    const clock = createClipClock(1000);
    assert.deepEqual(clock.request(1, false, 0), { value: 1, target: 1, running: false });
    assert.equal(clock.request(1, true, 200).running, false);
    assert.equal(clock.request(0, false, 300).value, 0);
  });
  test('cancel and deep-link initialization restore real endpoints', () => {
    const clock = createClipClock(1000);
    clock.reset(1);
    assert.equal(clock.request(1, true, 0).running, false);
    clock.request(0, true, 100);
    assert.equal(clock.reset(0).running, false);
    assert.equal(clock.sample(5000).value, 0);
  });

  test('a real post-ready error event makes subsequent reverse use the photo immediately', () => {
    const { act, video, frames, controller, restore } = mountClip(true);
    try {
      controller.sync(1025);
      controller.sync(2575);
      assert.equal(frames.size, 1, 'ready media starts the camera clock');
      video.dispatchEvent(new Event('error'));
      assert.equal(video.dataset.state, 'failed');
      assert.equal(frames.size, 0);
      assert.equal(act.dataset.clipStop, '1');
      assert.ok(video.pauses > 0, 'a playing video never lingers after cancel');
      controller.sync(1025);
      assert.equal(act.dataset.clipStop, '0', 'reverse selects the real photo immediately');
      assert.equal(video.dataset.playing, undefined);
      assert.equal(frames.size, 0, 'failed media never schedules another timed seek');
    } finally {
      restore();
    }
  });

  test('forward travel plays natively at a rate derived from clip and clock durations', () => {
    for (const [narrow, expected] of [[true, 5 / 1], [false, 5 / 1.4]] as const) {
      const { video, frames, controller, restore } = mountClip(narrow);
      try {
        controller.sync(narrow ? 1025 : 1000);
        controller.sync(narrow ? 2575 : 1080);
        assert.equal(video.plays, 1);
        assert.equal(video.currentTime, 0);
        assert.ok(Math.abs(video.playbackRate - expected) < 1e-9);
        assert.equal(frames.size, 1, 'the clock still owns the handoff timing');
      } finally {
        restore();
      }
    }
  });

  test('a very short clock caps the playback rate', () => {
    const { video, controller, restore } = mountClip(true);
    try {
      video.duration = 30;
      controller.sync(1025);
      controller.sync(2575);
      assert.equal(video.playbackRate, 8);
    } finally {
      restore();
    }
  });

  test('native playback is not driven by per-frame seeks and hands off on the clock', () => {
    const { act, video, frames, controller, restore } = mountClip(true);
    try {
      controller.sync(1025);
      controller.sync(2575);
      video.currentTime = 0;
      let writes = 0;
      Object.defineProperty(video, 'currentTime', { configurable: true, get: () => 0, set: () => { writes++; } });
      for (const t of [100, 400, 700]) {
        const [frame] = frames.values();
        frames.clear();
        performance.now = () => t;
        frame(t);
      }
      assert.equal(writes, 0);
      assert.equal(act.dataset.clipStop, '0', 'photo B is not selected while the clock runs');
      performance.now = () => 1000;
      const [last] = frames.values();
      frames.clear();
      last(1000);
      assert.equal(act.dataset.clipStop, '1');
      assert.equal(video.dataset.playing, undefined);
      assert.ok(video.pauses > 0);
      assert.equal(frames.size, 0);
    } finally {
      restore();
    }
  });

  test('retarget while playing pauses and resumes from the frame on screen', () => {
    const { video, controller, restore, at } = mountClip(false);
    try {
      controller.sync(1000);
      controller.sync(1080);
      assert.equal(video.plays, 1);
      const pausesBefore = video.pauses;
      at(700);
      video.currentTime = 1.5;
      controller.sync(1040);
      assert.ok(video.pauses > pausesBefore, 'native playback is paused on retarget');
      assert.equal(video.plays, 1, 'reverse never starts native playback');
      assert.ok(Math.abs(video.currentTime - 1.5) < .05, 'continues from the shown frame, not the clock sample (2.5s)');
    } finally {
      restore();
    }
  });

  test('reverse uses the coalesced seek path, never native playback', () => {
    const { video, frames, controller, restore, at } = mountClip(true);
    try {
      controller.sync(1025);
      controller.sync(2575);
      const [frame] = frames.values();
      frames.clear();
      at(1000);
      frame(1000);
      assert.equal(video.plays, 1);
      controller.sync(1025);
      assert.equal(video.plays, 1);
      assert.ok(Math.abs(video.currentTime - 4.96) < 1e-9, 'starts from the last frame by seeking');
      at(1500);
      const [next] = frames.values();
      next(1500);
      assert.ok(Math.abs(video.currentTime - 2.5) < 1e-9, 'follows the clock backwards');
    } finally {
      restore();
    }
  });

  test('a rejected play() falls back to clock-driven seeks', async () => {
    const { video, frames, controller, restore, at } = mountClip(true, () => Promise.reject(new Error('NotAllowedError')));
    try {
      controller.sync(1025);
      controller.sync(2575);
      at(500);
      await Promise.resolve();
      await Promise.resolve();
      assert.ok(Math.abs(video.currentTime - 2.5) < 1e-9);
      at(750);
      const [frame] = frames.values();
      frame(750);
      assert.ok(Math.abs(video.currentTime - 3.75) < 1e-9);
    } finally {
      restore();
    }
  });

  for (const scenario of [
    { name: 'desktop chapter entry skips the inset band but starts on departure', narrow: false, positions: [1000, 1080, 1300], startsAt: 1 },
    { name: 'desktop deep-link restore never replays and waits through jitter', narrow: false, positions: [1300, 1300, 1312, 1330], startsAt: 3 },
    { name: 'desktop approach stays idle until the pinned photo range', narrow: false, positions: [400, 600, 980, 1080], startsAt: 3 },
    { name: 'mobile starts on finger departure, not on snap arrival', narrow: true, positions: [1025, 1060, 1300, 2575], startsAt: 1 },
  ]) {
    test(scenario.name, () => {
      const { video, frames, controller, frameCount, restore } = mountClip(scenario.narrow);
      try {
        scenario.positions.forEach((y, index) => {
          controller.sync(y);
          assert.equal(frames.size, index < scenario.startsAt ? 0 : 1, `clock at scrollY=${y}`);
          if (index < scenario.startsAt) assert.equal(video.dataset.playing, undefined);
        });
        assert.equal(frameCount(), 1, 'later same-direction samples do not restart the clock');
        assert.equal(video.plays, 1);
      } finally {
        restore();
      }
    });
  }
});

test('a recoverable loading error does not permanently fail the clip controller', () => {
  const { video, controller, restore } = mountClip(true);
  try {
    video.dataset.state = 'loading';
    video.dispatchEvent(new Event('error'));
    assert.equal(video.dataset.state, 'loading', 'the loader owns its source fallback while loading');
    video.dataset.state = 'ready';
    controller.sync(1025);
    controller.sync(2575);
    assert.equal(video.plays, 1, 'a recovered clip still uses native forward playback');
  } finally { restore(); }
});
