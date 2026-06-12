import { Section } from './Section';
import { getCaseStudies } from '@/lib/home-content';

/** Case studies as runbook entries: SYS-NN, Problem/System/Outcome, metrics. */
export function SystemsSection() {
  const studies = getCaseStudies();
  return (
    <Section number="04" name="Runbook" tone="light-100" className="anim-reveal">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-(--space-md)">
        Systems shipped.
      </h2>
      <div className="divide-y divide-hairline border-t border-hairline">
        {studies.map((cs, i) => (
          <article key={cs.slug} className="py-(--space-md)">
            <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-mono text-xs text-muted">
                {`SYS-${String(i + 1).padStart(2, '0')}`}
              </span>
              <h3 className="font-semibold text-foreground">{cs.title}</h3>
              <span className="rounded-full border border-hairline bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
                {cs.org}
              </span>
              <span className="rounded border border-emerald-600/25 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-emerald-700">
                [SHIPPED]
              </span>
            </header>

            <dl className="mt-(--space-sm) flex flex-col gap-2.5">
              {(
                [
                  ['PROBLEM', cs.problem],
                  ['SYSTEM', cs.system],
                  ['OUTCOME', cs.outcome],
                ] as const
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-1 gap-x-4 gap-y-0.5 md:grid-cols-[90px_1fr]"
                >
                  <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {label}
                  </dt>
                  <dd className="text-sm leading-relaxed text-foreground/80">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-(--space-sm) flex flex-wrap items-center gap-2">
              {cs.metrics.map((metric) => (
                <span
                  key={metric}
                  className="rounded-md border border-hairline bg-surface px-2 py-0.5 font-mono text-[11px] text-muted"
                >
                  {metric}
                </span>
              ))}
            </div>

            {cs.link ? (
              <a
                href={cs.link.href}
                target={cs.link.href.startsWith('http') ? '_blank' : undefined}
                rel={cs.link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="mt-3 inline-block font-mono text-xs text-foreground underline underline-offset-4 transition-colors hover:text-muted"
              >
                {cs.link.label}
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}
