import { Section } from './Section';
import { formatSkillCategory } from '@/lib/skills';
import portfolioConfig from '../../../portfolio-config.json';

interface SkillsMap {
  [category: string]: string[];
}

export function TechStackSection() {
  const skills = portfolioConfig.skills as SkillsMap;

  return (
    <Section number="03" name="Tech Stack" tone="light-50">
      <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight leading-[1.1] mb-(--space-md)">
        What I work with.
      </h2>
      <p className="text-base text-muted mb-(--space-lg) max-w-2xl">
        Languages and tools I reach for first. The full canonical list lives in{' '}
        <code className="text-foreground/80">portfolio-config.json</code>; this is the visible cut.
      </p>
      <div className="grid gap-(--space-md) md:grid-cols-2">
        {Object.entries(skills).map(([category, items]) => (
          <div
            key={category}
            className="bg-surface border border-hairline rounded-2xl p-(--space-md)"
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted font-bold mb-(--space-sm)">
              {formatSkillCategory(category)}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {items.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 text-xs rounded-md bg-(--surface-alt) border border-hairline text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
