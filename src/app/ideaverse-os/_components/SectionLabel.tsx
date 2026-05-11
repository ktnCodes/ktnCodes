type Props = {
  number: string;
  label: string;
  id?: string;
};

export function SectionLabel({ number, label, id }: Props) {
  return (
    <div
      id={id}
      className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-iv-teal"
    >
      <span className="text-iv-wine">{number}</span>
      <span className="mx-2 text-iv-teal/40">/</span>
      <span>{label}</span>
    </div>
  );
}
