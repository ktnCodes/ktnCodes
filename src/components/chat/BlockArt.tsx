/**
 * Pure-CSS-grid renderer for block-ASCII art. Each letter is a 7-row
 * pattern of `X` (filled) and ` ` (empty) cells. Rendered as `<span>` cells
 * inside a flexbox grid so the layout never depends on a font's full-block
 * (U+2588) glyph metrics -- bullet-proof across browsers and themes.
 */

/** 7-row patterns. Width varies per letter; rows in a letter must match. */
export const LETTERS: Record<string, string[]> = {
  H: ['X   X', 'X   X', 'X   X', 'XXXXX', 'X   X', 'X   X', 'X   X'],
  E: ['XXXXX', 'X    ', 'X    ', 'XXXX ', 'X    ', 'X    ', 'XXXXX'],
  L: ['X    ', 'X    ', 'X    ', 'X    ', 'X    ', 'X    ', 'XXXXX'],
  O: [' XXX ', 'X   X', 'X   X', 'X   X', 'X   X', 'X   X', ' XXX '],
  I: ['XXXXX', '  X  ', '  X  ', '  X  ', '  X  ', '  X  ', 'XXXXX'],
  M: ['X   X', 'XX XX', 'X X X', 'X X X', 'X   X', 'X   X', 'X   X'],
  K: ['X   X', 'X  X ', 'X X  ', 'XX   ', 'X X  ', 'X  X ', 'X   X'],
  V: ['X   X', 'X   X', 'X   X', 'X   X', ' X X ', ' X X ', '  X  '],
  N: ['X   X', 'XX  X', 'X X X', 'X X X', 'X X X', 'X  XX', 'X   X'],
  ',': ['  ', '  ', '  ', '  ', '  ', ' X', 'X '],
  '.': ['  ', '  ', '  ', '  ', '  ', '  ', 'XX'],
  ' ': ['   ', '   ', '   ', '   ', '   ', '   ', '   '],
};

/**
 * Compose a single line of text into 7 rows of "X"/" " characters. Inserts
 * a 1-cell gap between letters (no trailing gap). Unknown characters fall
 * back to a space.
 */
export function composeLine(text: string): string[] {
  const rows = ['', '', '', '', '', '', ''];
  const chars = [...text];
  chars.forEach((char, idx) => {
    const pat = LETTERS[char] ?? LETTERS[' '];
    for (let r = 0; r < 7; r++) {
      rows[r] += pat[r];
      if (idx < chars.length - 1) rows[r] += ' ';
    }
  });
  return rows;
}

export function BlockArt({ text }: { text: string }) {
  const rows = composeLine(text);
  return (
    <div className="term-art-grid" aria-label={text} role="img">
      {rows.map((row, r) => (
        <div className="term-art-row" key={r}>
          {[...row].map((c, i) => (
            <span
              key={i}
              className={c === 'X' ? 'term-art-on' : 'term-art-off'}
              aria-hidden
            />
          ))}
        </div>
      ))}
    </div>
  );
}
