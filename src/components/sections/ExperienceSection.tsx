'use client';

import { Section } from './Section';
import { EditableText } from '@/components/dev/EditableText';
import configData from '../../../portfolio-config.json';
import type { Experience, PortfolioConfig } from '@/types/portfolio';

const CONFIG_PATH = 'portfolio-config.json';
const config = configData as Omit<PortfolioConfig, 'projects'>;

export function ExperienceSection() {
  const experience = config.experience;

  /**
   * Build the new full portfolio-config.json contents with one role's field
   * mutated. Preserves every other field in the file unchanged.
   */
  function writeRole<K extends keyof Experience>(idx: number, key: K) {
    return (next: string) => {
      const updated = {
        ...config,
        experience: experience.map((r, i) => (i === idx ? { ...r, [key]: next } : r)),
      };
      return JSON.stringify(updated, null, 2) + '\n';
    };
  }

  return (
    <Section number="03" name="Experience" tone="light-50">
      <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight leading-[1.1] mb-(--space-md)">
        Track record.
      </h2>
      <div className="hidden md:grid grid-cols-[200px_1fr_180px] gap-(--space-md) pb-(--space-sm) border-b border-hairline text-[10px] uppercase tracking-[0.18em] text-muted font-bold">
        <div>Period / Org</div>
        <div>Strategic Focus</div>
        <div className="text-right">Impact</div>
      </div>
      <div>
        {experience.map((role, idx) => (
          <Row
            key={`${role.company}-${idx}`}
            role={role}
            idx={idx}
            last={idx === experience.length - 1}
            writeRole={writeRole}
          />
        ))}
      </div>
    </Section>
  );
}

function Row({
  role,
  idx,
  last,
  writeRole,
}: {
  role: Experience;
  idx: number;
  last: boolean;
  writeRole: <K extends keyof Experience>(i: number, key: K) => (next: string) => string;
}) {
  return (
    <div
      className={`md:grid md:grid-cols-[200px_1fr_180px] gap-(--space-md) py-(--space-md) ${
        last ? '' : 'border-b border-(--surface-alt)'
      } items-start flex flex-col`}
    >
      <div className="md:contents">
        <div className="mb-(--space-sm) md:mb-0">
          <div className="text-[12px] text-muted mb-1">{role.duration}</div>
          <div className="text-[15px] font-semibold text-foreground leading-tight">
            {role.company}
          </div>
          <div className="text-[12px] text-muted">{role.position}</div>
        </div>
        <EditableText
          as="p"
          filePath={CONFIG_PATH}
          value={role.description}
          serialize={writeRole(idx, 'description')}
          multiline
          className="text-sm leading-relaxed text-foreground/85 mb-(--space-sm) md:mb-0"
        />
        <div className="md:text-right">
          {role.impact_tag && (
            <EditableText
              as="span"
              filePath={CONFIG_PATH}
              value={role.impact_tag}
              serialize={writeRole(idx, 'impact_tag')}
              className="inline-block text-[10px] font-mono font-bold tracking-[0.15em] text-foreground bg-background border border-foreground rounded-md px-2 py-1.5"
            />
          )}
        </div>
      </div>
    </div>
  );
}
