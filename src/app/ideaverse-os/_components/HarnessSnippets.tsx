type Harness = {
  name: string;
  conventionFile: string;
  invocation: string;
};

const harnesses: Harness[] = [
  { name: "Claude Code", conventionFile: "CLAUDE.md", invocation: "/ideaverse-os build" },
  { name: "Cursor", conventionFile: ".cursorrules", invocation: "/ideaverse-os build" },
  { name: "Codex CLI", conventionFile: "AGENTS.md", invocation: "/ideaverse-os build" },
  { name: "Gemini CLI", conventionFile: "GEMINI.md", invocation: "/ideaverse-os build" },
];

export function HarnessSnippets() {
  return (
    <div className="border border-iv-wine/20 bg-iv-cream-pale">
      <div className="border-b border-iv-wine/15 px-5 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
        Same command, every harness
      </div>
      <ul className="divide-y divide-iv-wine/10">
        {harnesses.map((h) => (
          <li
            key={h.name}
            className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-[140px_1fr_auto] sm:items-baseline sm:gap-6"
          >
            <span className="font-iv-display text-[1rem] font-semibold text-iv-wine">
              {h.name}
            </span>
            <span className="font-mono text-[13.5px] text-iv-ink">
              {h.invocation}
            </span>
            <span className="font-mono text-[12px] text-iv-ink-soft">
              loads via {h.conventionFile}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
