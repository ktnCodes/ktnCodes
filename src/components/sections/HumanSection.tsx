'use client';

import Image from 'next/image';
import { Section } from './Section';
import { EditableText } from '@/components/dev/EditableText';
import { EditableImage } from '@/components/dev/EditableImage';
import aboutData from '../../../content/about.json';
import beliefsData from '../../../content/beliefs.json';

interface AboutContent {
  heading: string;
  bio: string;
  mindset: string;
  craft: string;
  photoSrc: string;
}

interface BeliefsContent {
  featured: { tag: string; headline: string; body: string; bgImage: string };
  supporting: { tag: string; body: string }[];
}

const ABOUT_PATH = 'content/about.json';

/**
 * The human layer: portrait + bio + beliefs as labeled lines, closed by the
 * featured belief set over the moon photograph. Bio fields stay dev-editable
 * (same wiring the old AboutSection had).
 */
export function HumanSection() {
  const about = aboutData as AboutContent;
  const beliefs = beliefsData as BeliefsContent;

  function writeField<K extends keyof AboutContent>(key: K) {
    return (next: string) => JSON.stringify({ ...about, [key]: next }, null, 2) + '\n';
  }

  const uploadPath = `public${about.photoSrc.startsWith('/') ? about.photoSrc : '/' + about.photoSrc}`;

  return (
    <Section number="05" name="Human" tone="light-50" className="anim-reveal">
      <EditableText
        as="h2"
        filePath={ABOUT_PATH}
        value={about.heading}
        serialize={writeField('heading')}
        className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-(--space-md)"
      />
      <div className="grid grid-cols-1 items-start gap-(--space-lg) md:grid-cols-[260px_1fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-hairline bg-(--surface-alt) shadow-md">
          <EditableImage
            src={about.photoSrc}
            alt="Kevin Nguyen"
            uploadPath={uploadPath}
            width={260}
            height={325}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col gap-(--space-md)">
          <EditableText
            as="p"
            filePath={ABOUT_PATH}
            value={about.bio}
            serialize={writeField('bio')}
            multiline
            className="max-w-prose text-base leading-relaxed text-foreground/85"
          />
          <dl className="flex flex-col gap-2.5 border-t border-hairline pt-(--space-sm)">
            <div className="grid grid-cols-1 gap-x-4 gap-y-0.5 md:grid-cols-[150px_1fr]">
              <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                MINDSET
              </dt>
              <dd className="text-sm leading-relaxed text-foreground/80">
                <EditableText
                  as="span"
                  filePath={ABOUT_PATH}
                  value={about.mindset}
                  serialize={writeField('mindset')}
                  multiline
                />
              </dd>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-0.5 md:grid-cols-[150px_1fr]">
              <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                CRAFT
              </dt>
              <dd className="text-sm leading-relaxed text-foreground/80">
                <EditableText
                  as="span"
                  filePath={ABOUT_PATH}
                  value={about.craft}
                  serialize={writeField('craft')}
                  multiline
                />
              </dd>
            </div>
            {beliefs.supporting.map((belief) => (
              <div
                key={belief.tag}
                className="grid grid-cols-1 gap-x-4 gap-y-0.5 md:grid-cols-[150px_1fr]"
              >
                <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  {belief.tag.toUpperCase()}
                </dt>
                <dd className="text-sm leading-relaxed text-foreground/80">{belief.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Featured belief over the moon photograph. */}
      <div className="moon-card relative mt-(--space-md) min-h-[300px] overflow-hidden rounded-3xl border border-hairline">
        <Image
          src={beliefs.featured.bgImage}
          alt="The moon"
          fill
          sizes="(max-width: 768px) 100vw, 1152px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-neutral-950/55" />
        <div className="relative flex min-h-[300px] flex-col justify-end p-(--space-lg)">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-300">
            {beliefs.featured.tag}
          </p>
          <p className="mt-2 max-w-xl text-2xl font-semibold tracking-tight text-neutral-50 md:text-3xl">
            {beliefs.featured.headline}
          </p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-neutral-200">
            {beliefs.featured.body}
          </p>
        </div>
      </div>
    </Section>
  );
}
