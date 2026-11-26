import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { copyFade, stageMotion, type ActEnter } from './tour-act-blend';

const size = { viewport: 1000, act: 2600 };
const drift = { offset: ['end end', 'end start'], keyframes: { transform: ['translateY(0svh)', 'translateY(28svh)'], opacity: [1, .35] } };

describe('stageMotion', () => {
  test('without a flag every act keeps the 28svh drift and .35 fade', () => {
    const enters: ActEnter[] = [undefined, undefined, undefined];
    for (const index of [0, 1, 2]) assert.deepEqual(stageMotion(enters, index, size), drift);
  });

  test('flag on: the previous act pins in place and stays opaque', () => {
    const motion = stageMotion([undefined, undefined, 'dissolve'], 1, size);
    assert.deepEqual(motion.offset, ['end end', 'end start']);
    assert.deepEqual(motion.keyframes, { transform: ['translateY(0svh)', 'translateY(100svh)'] });
    assert.equal(motion.times, undefined);
  });

  test('flag on: the incoming act cancels its rise and fades in over the adjacent range', () => {
    const motion = stageMotion([undefined, undefined, 'dissolve'], 2, size);
    assert.deepEqual(motion.offset, ['start end', 'end start']);
    assert.deepEqual(motion.keyframes.transform.slice(0, 2), ['translateY(-100svh)', 'translateY(0svh)']);
    assert.deepEqual(motion.keyframes.opacity?.slice(0, 2), [0, 1]);
  });

  test('the incoming act keeps its own exit inside the same animation', () => {
    const motion = stageMotion([undefined, undefined, 'dissolve'], 2, size);
    assert.deepEqual(motion.keyframes.transform, ['translateY(-100svh)', 'translateY(0svh)', 'translateY(0svh)', 'translateY(28svh)']);
    assert.deepEqual(motion.keyframes.opacity, [0, 1, 1, .35]);
    // Entry ends after one viewport of the 3600px range; the exit starts one viewport before its end.
    assert.deepEqual(motion.times, [0, 1000 / 3600, 2600 / 3600, 1]);
  });

  test('the entry range is the previous exit range: one viewport of scroll each', () => {
    const [a, b, , end] = stageMotion([undefined, 'dissolve'], 1, size).times!;
    assert.ok(Math.abs((b - a) * (size.viewport + size.act) - size.viewport) < 1e-9);
    assert.equal(end, 1);
  });

  test('the first act has no previous and ignores the flag', () => {
    assert.deepEqual(stageMotion(['dissolve', undefined], 0, size), drift);
  });

  test('only the flagged boundary changes', () => {
    const enters: ActEnter[] = [undefined, undefined, 'dissolve', undefined];
    assert.deepEqual(stageMotion(enters, 0, size), drift);
    assert.deepEqual(stageMotion(enters, 1, size).keyframes.transform[1], 'translateY(100svh)');
    assert.deepEqual(stageMotion(enters, 2, size).offset, ['start end', 'end start']);
    assert.deepEqual(stageMotion(enters, 3, size), drift);
  });

  test('consecutive dissolves pin the middle act on exit and keep it opaque', () => {
    const motion = stageMotion([undefined, 'dissolve', 'dissolve'], 1, size);
    assert.deepEqual(motion.keyframes.transform[3], 'translateY(100svh)');
    assert.deepEqual(motion.keyframes.opacity, [0, 1, 1, 1]);
  });
});

describe('copyFade', () => {
  test('acts away from a dissolve have no copy fade', () => {
    const enters: ActEnter[] = [undefined, undefined, 'dissolve', undefined];
    assert.equal(copyFade(enters, 0, size), undefined);
    assert.equal(copyFade(enters, 3, size), undefined);
  });

  test('the outgoing copy is gone well before the photographs finish crossing', () => {
    const fade = copyFade([undefined, undefined, 'dissolve'], 1, size)!;
    assert.deepEqual(fade.offset, ['end end', 'end start']);
    assert.deepEqual(fade.keyframes.filter, ['opacity(1)', 'opacity(0)', 'opacity(0)']);
    assert.ok(fade.times[1] < .5);
  });

  test('the incoming copy starts only after the outgoing copy is gone and holds afterwards', () => {
    const out = copyFade([undefined, undefined, 'dissolve'], 1, size)!;
    const incoming = copyFade([undefined, undefined, 'dissolve'], 2, size)!;
    const crossing = size.viewport / (size.viewport + size.act);
    assert.deepEqual(incoming.keyframes.filter, ['opacity(0)', 'opacity(0)', 'opacity(1)', 'opacity(1)']);
    assert.ok(incoming.times[1] / crossing > out.times[1]);
    assert.equal(incoming.times[2], crossing);
  });

  test('a middle act between two dissolves fades in, holds and fades out in one animation', () => {
    const fade = copyFade([undefined, 'dissolve', 'dissolve'], 1, size)!;
    assert.equal(fade.keyframes.filter.length, fade.times.length);
    assert.deepEqual(fade.times, [...fade.times].sort((a, b) => a - b));
    assert.deepEqual(fade.keyframes.filter, ['opacity(0)', 'opacity(0)', 'opacity(1)', 'opacity(1)', 'opacity(0)', 'opacity(0)']);
  });
});
