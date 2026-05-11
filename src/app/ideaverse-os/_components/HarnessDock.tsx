type Harness = {
  short: string;
  name: string;
};

const harnesses: Harness[] = [
  { short: "C", name: "Claude Code" },
  { short: ">_", name: "Cursor" },
  { short: "X", name: "Codex CLI" },
  { short: "G", name: "Gemini CLI" },
];

export function HarnessDock() {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <ul className="flex items-center gap-2 border border-iv-wine/20 bg-iv-cream-pale px-3 py-2">
        {harnesses.map((h) => (
          <li key={h.short}>
            <div
              title={h.name}
              aria-label={h.name}
              className="flex h-8 w-8 items-center justify-center border border-iv-wine/25 bg-iv-cream font-mono text-[11px] font-semibold text-iv-wine"
            >
              {h.short}
            </div>
          </li>
        ))}
      </ul>
      <div className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
        works in any of these
      </div>
    </div>
  );
}
