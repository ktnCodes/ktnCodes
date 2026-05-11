'use client';

import { Section } from './Section';
import { useChatContext } from '@/components/chat/chat-context';

interface ContactSectionProps {
  email?: string;
  github: string;
  linkedin: string;
}

export function ContactSection({ email, github, linkedin }: ContactSectionProps) {
  const { openWith } = useChatContext();

  function openMemoji() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    openWith();
  }

  return (
    <Section number="05" name="Contact" tone="light-50">
      <div className="text-center max-w-2xl mx-auto py-(--space-lg)">
        <h2 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-(--space-sm)">
          Let's talk.
        </h2>
        <p className="text-base text-muted mb-(--space-lg) leading-relaxed">
          Hiring, collaborating, or just want to nerd out about embedded systems and AI workflows?
          Open to all of it.
        </p>
        <button
          type="button"
          onClick={openMemoji}
          className="inline-flex items-center gap-2 bg-foreground text-background px-(--space-md) py-3 rounded-full text-[15px] font-medium hover:opacity-90 transition-opacity mb-(--space-lg)"
        >
          <span aria-hidden>💬</span> Talk to my Memoji
        </button>
        <div className="flex justify-center items-center gap-(--space-md) text-[13px] text-muted">
          <a href={linkedin} className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <span aria-hidden>↗</span> LinkedIn
          </a>
          <span aria-hidden className="text-hairline">·</span>
          <a href={github} className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <span aria-hidden>↗</span> GitHub
          </a>
          {email && (
            <>
              <span aria-hidden className="text-hairline">·</span>
              <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
                <span aria-hidden>✉</span> Email
              </a>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
