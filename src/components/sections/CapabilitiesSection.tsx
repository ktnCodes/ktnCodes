import { Section } from './Section';
import { getCapabilities } from '@/lib/home-content';

/** Capabilities as a key:value spec table -- hiring language, no icon cards. */
export function CapabilitiesSection() {
  const items = getCapabilities();
  return (
    <Section number="02" name="Capabilities" tone="light-100" className="anim-reveal">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-(--space-md)">
        The spec sheet.
      </h2>
      <div className="divide-y divide-hairline border-y border-hairline">
        {items.map((cap) => (
          <div
            key={cap.num}
            className="grid grid-cols-1 gap-x-(--space-md) gap-y-1 py-(--space-sm) md:grid-cols-[220px_1fr]"
          >
            <div className="font-mono text-xs text-foreground">
              <span className="mr-2 text-muted">{cap.num}</span>
              {cap.name}
            </div>
            <p className="text-sm leading-relaxed text-muted">{cap.blurb}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
