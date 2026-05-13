'use client';

import { Section } from './Section';
import { EditableText } from '@/components/dev/EditableText';
import { EditableImage } from '@/components/dev/EditableImage';
import { SpotlightCard } from '@/components/fx/SpotlightCard';
import aboutData from '../../../content/about.json';

interface AboutContent {
  heading: string;
  bio: string;
  mindset: string;
  craft: string;
  photoSrc: string;
}

const ABOUT_PATH = 'content/about.json';

export function AboutSection() {
  const about = aboutData as AboutContent;

  function writeField<K extends keyof AboutContent>(key: K) {
    return (next: string) => JSON.stringify({ ...about, [key]: next }, null, 2) + '\n';
  }

  // Derive upload path from photoSrc (strip leading /, prefix with public/)
  const uploadPath = `public${about.photoSrc.startsWith('/') ? about.photoSrc : '/' + about.photoSrc}`;

  return (
    <Section number="02" name="About" tone="light-100">
      <div className="grid md:grid-cols-[250px_1fr] gap-(--space-xl) items-start">
        <div className="rounded-3xl overflow-hidden border border-hairline shadow-md aspect-[4/5] relative bg-(--surface-alt)">
          <EditableImage
            src={about.photoSrc}
            alt="Kevin Nguyen"
            uploadPath={uploadPath}
            width={250}
            height={312}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col gap-(--space-md)">
          <div>
            <EditableText
              as="h2"
              filePath={ABOUT_PATH}
              value={about.heading}
              serialize={writeField('heading')}
              className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight leading-[1.1] mb-(--space-sm)"
            />
            <EditableText
              as="p"
              filePath={ABOUT_PATH}
              value={about.bio}
              serialize={writeField('bio')}
              multiline
              className="text-base leading-relaxed text-foreground/85"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-(--space-sm)">
            <MicroCard label="Mindset">
              <EditableText
                as="span"
                filePath={ABOUT_PATH}
                value={about.mindset}
                serialize={writeField('mindset')}
                multiline
              />
            </MicroCard>
            <MicroCard label="Craft">
              <EditableText
                as="span"
                filePath={ABOUT_PATH}
                value={about.craft}
                serialize={writeField('craft')}
                multiline
              />
            </MicroCard>
          </div>
        </div>
      </div>
    </Section>
  );
}

function MicroCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <SpotlightCard className="p-(--space-md)" borderRadius={16}>
      <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted font-bold mb-1.5">
        {label}
      </div>
      <p className="text-sm leading-relaxed text-foreground/85">{children}</p>
    </SpotlightCard>
  );
}
