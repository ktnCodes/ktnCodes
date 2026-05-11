export function SectionEyebrow({
  children,
  number,
}: {
  children: React.ReactNode;
  number?: string;
}) {
  return (
    <div className="flex items-center gap-3 text-muted">
      {number ? (
        <span className="font-mono text-xs tracking-widest">{number}</span>
      ) : null}
      <span className="h-px flex-1 bg-[var(--hairline)] max-w-16" />
      <span className="small-caps text-xs">{children}</span>
    </div>
  );
}
