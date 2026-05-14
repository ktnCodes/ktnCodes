import { describe, it, expect } from 'vitest';
import { composeLine, LETTERS } from './BlockArt';

describe('composeLine', () => {
  it('returns 7 rows for any input', () => {
    expect(composeLine('').length).toBe(7);
    expect(composeLine('H').length).toBe(7);
    expect(composeLine('HELLO').length).toBe(7);
    expect(composeLine('IM KEVIN.').length).toBe(7);
  });

  it('renders a single letter exactly as its LETTERS pattern', () => {
    const rows = composeLine('H');
    expect(rows).toEqual(LETTERS.H);
  });

  it('joins letters with a single 1-cell gap (no trailing gap)', () => {
    const rows = composeLine('HE');
    for (let r = 0; r < 7; r++) {
      expect(rows[r]).toBe(LETTERS.H[r] + ' ' + LETTERS.E[r]);
    }
  });

  it('treats unknown characters as a space-equivalent pattern', () => {
    const rows = composeLine('?');
    expect(rows).toEqual(LETTERS[' ']);
  });

  it('produces uniform-width rows for the HELLO line (cell-count invariant)', () => {
    const rows = composeLine('HELLO,');
    const widths = rows.map((r) => r.length);
    expect(new Set(widths).size).toBe(1); // all rows same length
  });

  it('produces uniform-width rows for the IM KEVIN. line', () => {
    const rows = composeLine('IM KEVIN.');
    const widths = rows.map((r) => r.length);
    expect(new Set(widths).size).toBe(1);
  });

  it('only emits the cell characters X and space', () => {
    const rows = composeLine('HELLO, IM KEVIN.');
    for (const row of rows) {
      for (const ch of row) {
        expect(['X', ' ']).toContain(ch);
      }
    }
  });
});
