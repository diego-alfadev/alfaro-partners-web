import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { transformTrack, type Point } from './guided-tour-motion';

const glide: [number, number, number, number] = [.45, 0, .25, 1];
const track = (entries: [string, Point[]][]) => transformTrack(new Map(entries));

describe('transform track', () => {
  test('a lone scale holds before and after its window', () => {
    const { values, times } = track([['scale', [[.12, 1.12, glide], [.62, 1, glide]]]]);
    assert.deepEqual(times, [0, .12, .62, 1]);
    assert.deepEqual(values, ['scale(1.12)', 'scale(1.12)', 'scale(1)', 'scale(1)']);
  });

  test('x, y and scale sharing a window compose in one string', () => {
    const { values } = track([
      ['x', [[.3, '0vw', glide], [.72, '-22.5vw', glide]]],
      ['y', [[.3, '0svh', glide], [.72, '-14.5svh', glide]]],
      ['scale', [[.3, 1, glide], [.72, .43, glide]]],
    ]);
    assert.equal(values[0], 'translateX(0vw) translateY(0svh) scale(1)');
    assert.equal(values.at(-1), 'translateX(-22.5vw) translateY(-14.5svh) scale(0.43)');
  });

  test('the eased interval keeps its curve and holds stay linear', () => {
    const { ease } = track([['y', [[.1, '-5svh', glide], [.6, '0svh', glide]]]]);
    assert.deepEqual(ease, ['linear', glide, 'linear']);
  });

  test('a value entering and later leaving keeps both windows', () => {
    const { values, times } = track([['x', [[.3, '100%', glide], [.5, '0%', glide], [.7, '0%', glide], [.9, '-30%', glide]]]]);
    assert.deepEqual(times, [0, .3, .5, .7, .9, 1]);
    assert.deepEqual(values, ['translateX(100%)', 'translateX(100%)', 'translateX(0%)', 'translateX(0%)', 'translateX(-30%)', 'translateX(-30%)']);
  });

  test('another prop boundary inside a window interpolates linearly', () => {
    const { values } = track([
      ['x', [[0, '0%', glide], [1, '100%', glide]]],
      ['scale', [[.5, 1, glide], [.5, 1, glide]]],
    ]);
    assert.equal(values[1], 'translateX(50%) scale(1)');
  });
});
