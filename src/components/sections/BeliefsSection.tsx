'use client';

import { Section } from './Section';
import { EditableText } from '@/components/dev/EditableText';
import { ShowcaseCard } from '@/components/fx/ShowcaseCard';
import { SpotlightCard } from '@/components/fx/SpotlightCard';
import beliefsData from '../../../content/beliefs.json';

interface Belief {
  icon: string;
  tag: string;
  headline?: string;
  body: string;
  /** Optional background image (path under /public). Featured card only. */
  bgImage?: string;
}

interface BeliefsContent {
  featured: Belief;
  supporting: Belief[];
}

const BELIEFS_PATH = 'content/beliefs.json';

export function BeliefsSection() {
  const beliefs = beliefsData as BeliefsContent;

  function writeSupporting<K extends keyof Belief>(idx: number, key: K) {
    return (next: string) => {
      const updated = {
        ...beliefs,
        supporting: beliefs.supporting.map((b, i) => (i === idx ? { ...b, [key]: next } : b)),
      };
      return JSON.stringify(updated, null, 2) + '\n';
    };
  }

  return (
    <Section number="05" name="Beliefs" tone="light-50">
      <div className="mb-(--space-lg)">
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight leading-[1.1] mb-2">
          What I work by.
        </h2>
        <p className="text-base text-muted">Four principles. Earned the hard way.</p>
      </div>
      <div className="grid md:grid-cols-[1.6fr_1fr] gap-(--space-md)">
        {/* Featured — ShowcaseCard with tilt + parallax */}
        <ShowcaseCard
          tagline={`${beliefs.featured.icon} ${beliefs.featured.tag}`}
          heading={beliefs.featured.headline ?? ''}
          description={beliefs.featured.body}
          imageUrl={beliefs.featured.bgImage ?? ''}
          imageAlt=""
          className="max-w-none"
        />

        {/* Supporting — SpotlightCard with cursor-follow spotlight */}
        <div className="flex flex-col gap-(--space-sm)">
          {beliefs.supporting.map((b, idx) => (
            <SpotlightCard key={b.tag} className="flex-1 p-(--space-md)" borderRadius={16}>
              <div className="text-[18px] mb-2">{b.icon}</div>
              <EditableText
                as="div"
                filePath={BELIEFS_PATH}
                value={b.tag}
                serialize={writeSupporting(idx, 'tag')}
                className="text-[10px] font-mono font-bold tracking-[0.15em] text-foreground mb-1.5"
              />
              <EditableText
                as="p"
                filePath={BELIEFS_PATH}
                value={b.body}
                serialize={writeSupporting(idx, 'body')}
                multiline
                className="text-[13px] leading-relaxed text-foreground/85"
              />
            </SpotlightCard>
          ))}
        </div>
      </div>
    </Section>
  );
}
