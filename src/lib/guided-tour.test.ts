import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { sidePanelShift } from './guided-tour';

describe('side panel shift', () => {
  test('a centred subject moves to the middle of the right-half panel', () => {
    assert.equal(sidePanelShift('50% 55%'), '25%');
  });

  test('a subject already on the right needs a smaller shift', () => {
    assert.equal(sidePanelShift('60% 50%'), '15%');
  });

  test('the shift never uncovers the panel or exceeds its width', () => {
    assert.equal(sidePanelShift('90% 50%'), '0%');
    assert.equal(sidePanelShift('10% 50%'), '50%');
  });

  test('a missing focus falls back to the centre', () => {
    assert.equal(sidePanelShift(undefined), '25%');
  });
});
