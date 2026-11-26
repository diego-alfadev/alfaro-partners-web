import { expect, test } from 'bun:test';
import { reviewIssueViews, hasBlockingReviewIssues, type ReviewIssue } from './review-issues';

const issue = (): ReviewIssue => ({ code: 'source_discrepancy', field: 'price', severity: 'warning',
  status: 'pending', officeValue: 100000, appliedValue: 100000,
  sources: [{ source: 'arctempus', value: 110000 }],
  resolution: 'Se conserva el precio consolidado del Excel.' });

test('review issues show compared values without replacing the consolidated value', () => {
  const input = issue();
  const [view] = reviewIssueViews([input]);
  expect(view!.fieldLabel).toBe('Precio');
  expect(view!.office).toContain('100.000');
  expect(view!.sources[0]!.value).toContain('110.000');
  expect(view!.sources[0]!.label).toBe('Arctempus');
  expect(view!.severityLabel).toBe('Aviso');
  expect(input.appliedValue).toBe(100000);
  expect(reviewIssueViews(undefined)).toEqual([]);
});

test('only a pending blocking issue blocks the release gate', () => {
  expect(hasBlockingReviewIssues([issue()])).toBe(false);
  expect(hasBlockingReviewIssues([{ ...issue(), severity: 'blocking' }])).toBe(true);
  expect(hasBlockingReviewIssues([{ ...issue(), severity: 'blocking', status: 'resolved' }])).toBe(false);
});

test('unknown fields, source kinds, private notes and inconsistent applied values fail closed', () => {
  for (const patch of [{ field: 'address' }, { sources: [{ source: 'private', value: 1 }] },
    { appliedValue: 1 }, { resolution: '/Users/diego/private' }, { resolution: 'private@example.test' }]) {
    expect(() => reviewIssueViews([{ ...issue(), ...patch } as ReviewIssue])).toThrow();
  }
});
