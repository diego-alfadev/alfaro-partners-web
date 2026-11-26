import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { createWheelGesture } from './tour-wheel';

const checkpoints = [0, 1000, 2000, 3000];
const viewport = 900;

/** Feeds samples 16 ms apart, applying "pass" deltas to y like the browser would. */
function run(deltas: number[], y = 0, start = 0) {
  const wheel = createWheelGesture();
  const intents = deltas.map((delta, i) => {
    const { intent, fresh } = wheel.next(delta, start + i * 16, y, checkpoints, viewport);
    if (intent.kind === 'pass') y += delta;
    if (intent.kind === 'stop' || intent.kind === 'carry') y = intent.at;
    return { kind: intent.kind, fresh, y };
  });
  return { intents, y, wheel };
}

/** A fling may re-anchor while it ramps up; once spent, nothing may count as a new swipe. */
const freshAfterStop = (intents: { kind: string; fresh: boolean }[]) =>
  intents.slice(intents.findIndex(({ kind }) => kind === 'stop' || kind === 'carry') + 1).filter(({ fresh }) => fresh).length;

describe('tour wheel gesture', () => {
  test('a hard fling stops on the next checkpoint and swallows the rest', () => {
    const { intents, y } = run([80, 120, 160, 160, 140, 120, 100, 80, 60, 40, 20, 10, 5, 2]);
    assert.equal(y, 1000);
    assert.equal(intents.filter(({ kind }) => kind === 'stop').length, 1);
    assert.equal(intents.slice(intents.findIndex(({ kind }) => kind === 'stop') + 1).every(({ kind }) => kind === 'swallow'), true);
  });

  test('fading momentum short of the checkpoint is carried to it', () => {
    const { intents, y } = run([20, 40, 60, 60, 40, 25, 15, 8, 4, 2]);
    assert.equal(intents.some(({ kind }) => kind === 'carry'), true);
    assert.equal(y, 1000);
  });

  test('slow deliberate scrolling is left to the browser', () => {
    const { intents } = run([2, 3, 3, 2, 3, 2, 2]);
    assert.equal(intents.every(({ kind }) => kind === 'pass'), true);
  });

  test('a new swipe during swallowed momentum is a fresh gesture', () => {
    const spentAt1000 = () => {
      const wheel = createWheelGesture();
      let y = 0;
      for (const [i, delta] of [100, 160, 200, 300, 400, 300, 260, 220, 190].entries()) {
        const { intent } = wheel.next(delta, i * 16, y, checkpoints, viewport);
        if (intent.kind === 'pass') y += delta;
        if (intent.kind === 'stop') y = intent.at;
      }
      return { wheel, y };
    };
    // Touching the trackpad cuts the momentum dead; the wheel goes quiet, then the new swipe starts.
    const cut = spentAt1000();
    assert.equal(cut.y, 1000);
    const touch = cut.wheel.next(3, 8 * 16 + 400, cut.y, checkpoints, viewport);
    assert.equal(touch.fresh, true);
    assert.equal(touch.intent.kind, 'pass');
    // A push clearly above the spent gesture's peak is also a new swipe.
    const push = spentAt1000();
    assert.equal(push.wheel.next(520, 10 * 16, push.y, checkpoints, viewport).fresh, true);
  });

  test('a pause or a reversal starts a fresh gesture', () => {
    const wheel = createWheelGesture();
    wheel.next(500, 0, 900, checkpoints, viewport);
    assert.equal(wheel.next(-10, 16, 1000, checkpoints, viewport).fresh, true);
    assert.equal(wheel.next(10, 400, 1000, checkpoints, viewport).fresh, true);
  });

  test('a long trackpad fling advances one checkpoint even if its momentum outlasts two seconds', () => {
    const fling = [60, 120, 200, 260, 240];
    const tail = Array.from({ length: 150 }, (_, i) => Math.max(1, Math.round(220 * Math.exp(-i / 40))));
    const { intents, y } = run([...fling, ...tail]);
    assert.equal(y, 1000);
    assert.equal(intents.filter(({ kind }) => kind === 'stop' || kind === 'carry').length, 1);
    assert.equal(freshAfterStop(intents), 0);
  });

  test('momentum that wobbles slightly while fading is not a new swipe', () => {
    const wobbly = [80, 160, 240, 300, 280, 240, 250, 210, 180, 190, 150, 120, 126, 90, 70, 74, 50, 30, 33, 18, 9, 4, 2];
    const { intents, y } = run(wobbly);
    assert.equal(y, 1000);
    assert.equal(freshAfterStop(intents), 0);
  });

  test('scrolling up stops on the previous checkpoint', () => {
    const { y } = run([-120, -200, -300, -400, -300, -200], 1900);
    assert.equal(y, 1000);
  });

  test('no checkpoint ahead lets the browser scroll', () => {
    assert.equal(run([50, 50], 3000).intents.every(({ kind }) => kind === 'pass'), true);
  });

  describe('after a landing', () => {
    /** A fling that stops on 1000 at its 4th sample; returns the gesture, y and the last sample time. */
    function landed() {
      const wheel = createWheelGesture();
      let y = 0; let time = 0;
      for (const delta of [200, 300, 400, 420]) {
        const { intent } = wheel.next(delta, time, y, checkpoints, viewport);
        if (intent.kind === 'pass') y += delta;
        if (intent.kind === 'stop') y = intent.at;
        time += 16;
      }
      assert.equal(y, 1000);
      return { wheel, y, time: time - 16 };
    }
    /** Feeds [delta, gapBeforeMs] samples and returns what the controller would see. */
    function tail(state: ReturnType<typeof landed>, samples: [number, number][]) {
      let { time, y } = state;
      return samples.map(([delta, gap]) => {
        time += gap;
        const { intent, fresh } = state.wheel.next(delta, time, y, checkpoints, viewport);
        if (intent.kind === 'pass') y += delta;
        if (intent.kind === 'stop' || intent.kind === 'carry') y = intent.at;
        return { kind: intent.kind, fresh, y };
      });
    }

    test('a tail with a 250 ms main-thread stall produces no new move', () => {
      const out = tail(landed(), [[300, 16], [240, 16], [180, 16], [120, 250], [90, 16], [70, 16], [40, 16], [14, 16], [4, 16]]);
      assert.equal(out.every(({ kind, fresh }) => kind === 'swallow' && !fresh), true);
    });

    test('a tail that drops below 40 % between samples produces no new move', () => {
      const out = tail(landed(), [[300, 16], [210, 16], [70, 16], [60, 16], [18, 16], [16, 16], [5, 16], [2, 16]]);
      assert.equal(out.every(({ kind, fresh }) => kind === 'swallow' && !fresh), true);
    });

    test('re-accelerating above the spent peak moves to the next checkpoint', () => {
      const out = tail(landed(), [[300, 16], [200, 16], [520, 16], [700, 16], [400, 16], [200, 16]]);
      assert.equal(out[2].fresh, true);
      assert.equal(out.some(({ kind }) => kind === 'stop' || kind === 'carry'), true);
      assert.equal(out[out.length - 1].y, 2000);
    });

    test('a direction reversal moves to the previous checkpoint', () => {
      const out = tail(landed(), [[300, 16], [-60, 16], [-200, 16], [-500, 16], [-900, 16]]);
      assert.equal(out[1].fresh, true);
      assert.equal(out[out.length - 1].y, 0);
    });

    test('a new gesture after a calm period moves', () => {
      const out = tail(landed(), [[200, 16], [60, 16], [40, 400], [200, 16], [500, 16], [900, 16]]);
      assert.equal(out[2].fresh, true);
      assert.equal(out[out.length - 1].y, 2000);
    });

    test('a pause shorter than the calm threshold is still the same gesture', () => {
      const out = tail(landed(), [[200, 16], [60, 330]]);
      assert.equal(out.every(({ kind, fresh }) => kind === 'swallow' && !fresh), true);
    });
  });
});
