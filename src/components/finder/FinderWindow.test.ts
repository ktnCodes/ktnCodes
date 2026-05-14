import { describe, it, expect } from 'vitest';
import { clampColumnWidth, COLUMN_MIN, COLUMN_MAX } from './FinderWindow';

describe('clampColumnWidth', () => {
  it('returns values inside the range unchanged', () => {
    expect(clampColumnWidth(180)).toBe(180);
    expect(clampColumnWidth(220)).toBe(220);
    expect(clampColumnWidth(COLUMN_MIN)).toBe(COLUMN_MIN);
    expect(clampColumnWidth(COLUMN_MAX)).toBe(COLUMN_MAX);
  });

  it('clamps below the minimum', () => {
    expect(clampColumnWidth(0)).toBe(COLUMN_MIN);
    expect(clampColumnWidth(-100)).toBe(COLUMN_MIN);
    expect(clampColumnWidth(COLUMN_MIN - 1)).toBe(COLUMN_MIN);
  });

  it('clamps above the maximum', () => {
    expect(clampColumnWidth(1000)).toBe(COLUMN_MAX);
    expect(clampColumnWidth(COLUMN_MAX + 1)).toBe(COLUMN_MAX);
  });

  it('handles fractional inputs without NaN', () => {
    expect(clampColumnWidth(199.5)).toBe(199.5);
    expect(Number.isNaN(clampColumnWidth(199.5))).toBe(false);
  });
});
