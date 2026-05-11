type Row = {
  system: string;
  detail: string;
  highlight?: boolean;
};

const rows: Row[] = [
  {
    system: "Karpathy raw to wiki",
    detail: "No template. You build the structure manually.",
  },
  {
    system: "AI Impact infinite_brain",
    detail:
      "16 node types, 10 edge types. Over-engineered for solo operators.",
  },
  {
    system: "Tiago Forte PARA",
    detail: "Designed for human re-reading, not agent retrieval.",
  },
  {
    system: "Cole Medin AI second brain",
    detail: "Static identity files. No ingestion model. Claude-only.",
  },
  {
    system: "Nick Milo Ideaverse-OS",
    detail: "Vault template only. No LLM build flow.",
  },
  {
    system: "ideaverse-os",
    detail:
      "Position-addressed scaffold + LLM-driven interviewer + harness-agnostic ingestion.",
    highlight: true,
  },
];

export function ComparisonTable() {
  return (
    <div className="overflow-hidden rounded-[2px] border border-iv-wine/15 bg-iv-cream-pale">
      <table className="w-full border-separate border-spacing-0">
        <thead className="hidden sm:table-header-group">
          <tr>
            <th
              scope="col"
              className="border-b border-iv-wine/15 px-5 py-3 text-left font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-iv-ink-soft"
            >
              System
            </th>
            <th
              scope="col"
              className="border-b border-iv-wine/15 px-5 py-3 text-left font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-iv-ink-soft"
            >
              The tradeoff
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const zebra =
              row.highlight
                ? "bg-iv-wine text-iv-cream"
                : i % 2 === 0
                  ? "bg-iv-cream-pale"
                  : "bg-iv-cream";
            const systemColor = row.highlight
              ? "text-iv-amber font-semibold"
              : "text-iv-ink";
            const detailColor = row.highlight
              ? "text-iv-cream-pale"
              : "text-iv-ink-soft";
            return (
              <tr
                key={row.system}
                className={`block border-t border-iv-wine/10 sm:table-row sm:border-t-0 ${zebra}`}
              >
                <td
                  className={`block px-5 pt-4 pb-1 font-mono text-[13px] ${systemColor} sm:table-cell sm:w-1/3 sm:py-3.5 sm:align-top`}
                >
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-ink-soft sm:hidden">
                    System
                  </span>
                  {row.system}
                </td>
                <td
                  className={`block px-5 pb-4 pt-0 text-[14px] leading-[1.5] ${detailColor} sm:table-cell sm:py-3.5 sm:align-top`}
                >
                  <span
                    className={`block text-[10px] font-semibold uppercase tracking-[0.16em] sm:hidden ${
                      row.highlight ? "text-iv-amber/80" : "text-iv-ink-soft"
                    }`}
                  >
                    {row.highlight ? "What ships" : "Tradeoff"}
                  </span>
                  {row.detail}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
