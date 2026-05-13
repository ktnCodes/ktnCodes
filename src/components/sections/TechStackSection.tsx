import { Section } from './Section';
import { formatSkillCategory } from '@/lib/skills';
import { getSkillIcon } from '@/lib/skill-icons';
import { SpotlightCard } from '@/components/fx/SpotlightCard';
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
        Languages and tools I reach for first.
      </p>
      <div className="grid gap-(--space-md) md:grid-cols-2">
        {Object.entries(skills).map(([category, items]) => (
          <SpotlightCard key={category} className="p-(--space-md)" borderRadius={16}>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted font-bold mb-(--space-sm)">
              {formatSkillCategory(category)}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {items.map((skill) => {
                const icon = getSkillIcon(skill);
                return (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-md bg-(--surface-alt) border border-hairline text-foreground"
                  >
                    {icon && (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-3.5 h-3.5 shrink-0"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d={icon.path} />
                      </svg>
                    )}
                    {skill}
                  </span>
                );
              })}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
