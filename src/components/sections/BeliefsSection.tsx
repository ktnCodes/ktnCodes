'use client';

import Image from 'next/image';
import { Section } from './Section';
import { EditableText } from '@/components/dev/EditableText';
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

  function writeFeatured<K extends keyof Belief>(key: K) {
    return (next: string) =>
      JSON.stringify({ ...beliefs, featured: { ...beliefs.featured, [key]: next } }, null, 2) +
      '\n';
  }
  function writeSupporting<K extends keyof Belief>(idx: number, key: K) {
    return (next: string) => {
      const updated = {
        ...beliefs,
        supporting: beliefs.supporting.map((b, i) => (i === idx ? { ...b, [key]: next } : b)),
      };
      return JSON.stringify(updated, null, 2) + '\n';
    };
  }

  const bgImage = beliefs.featured.bgImage;

  return (
    <Section number="05" name="Beliefs" tone="light-50">
      <div className="mb-(--space-lg)">
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight leading-[1.1] mb-2">
          What I work by.
        </h2>
        <p className="text-base text-muted">Four principles. Earned the hard way.</p>
      </div>
      <div className="grid md:grid-cols-[1.6fr_1fr] gap-(--space-md)">
        {/* Featured — moon image background + dark gradient scrim for text legibility */}
        <div className="relative rounded-3xl overflow-hidden flex flex-col justify-end min-h-[320px] md:min-h-[400px] p-(--space-lg) bg-foreground text-background">
          {bgImage && (
            <>
              <Image
                src={bgImage}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover object-center"
                aria-hidden
              />
              {/* Dark scrim — keeps body copy legible against the moon's bright midband */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.85) 100%)',
                }}
              />
            </>
          )}
          <div className="relative">
            <div className="text-[28px] mb-(--space-md) drop-shadow-md">{beliefs.featured.icon}</div>
            <EditableText
              as="div"
              filePath={BELIEFS_PATH}
              value={beliefs.featured.tag}
              serialize={writeFeatured('tag')}
              className="text-[11px] font-mono font-bold tracking-[0.18em] text-white/70 mb-(--space-sm)"
            />
            {beliefs.featured.headline && (
              <EditableText
                as="h3"
                filePath={BELIEFS_PATH}
                value={beliefs.featured.headline}
                serialize={writeFeatured('headline')}
                className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight mb-(--space-sm) text-white drop-shadow"
              />
            )}
            <EditableText
              as="p"
              filePath={BELIEFS_PATH}
              value={beliefs.featured.body}
              serialize={writeFeatured('body')}
              multiline
              className="text-sm leading-relaxed text-white/85"
            />
          </div>
        </div>
        {/* Supporting */}
        <div className="flex flex-col gap-(--space-sm)">
          {beliefs.supporting.map((b, idx) => (
            <div
              key={b.tag}
              className="bg-surface border border-hairline rounded-2xl p-(--space-md) flex-1"
            >
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
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
