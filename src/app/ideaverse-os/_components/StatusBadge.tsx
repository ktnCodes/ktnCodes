type Props = {
  version: string;
  label: string;
  next?: string;
};

function Dot({ tone = "strong" }: { tone?: "strong" | "soft" }) {
  return (
    <span
      aria-hidden
      className={`inline-block ${
        tone === "strong" ? "h-1.5 w-1.5 bg-iv-wine" : "h-1 w-1 bg-iv-wine/50"
      } rounded-full`}
    />
  );
}

export function StatusBadge({ version, label, next }: Props) {
  return (
    <div className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 border border-iv-wine/30 bg-iv-rose/25 px-3 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-iv-wine">
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <Dot />
        <span>v{version}</span>
      </span>
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <Dot tone="soft" />
        <span>{label}</span>
      </span>
      {next ? (
        <span className="inline-flex items-center gap-2 whitespace-nowrap text-iv-wine/70">
          <Dot tone="soft" />
          <span>{next}</span>
        </span>
      ) : null}
    </div>
  );
}
