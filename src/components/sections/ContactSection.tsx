import { Section } from './Section';
import { CtaRow } from '@/components/ui/cta-row';

interface ContactSectionProps {
  email?: string;
  github: string;
  linkedin: string;
}

export function ContactSection({ email, github, linkedin }: ContactSectionProps) {
  return (
    <Section number="06" name="Contact" tone="light-100" className="anim-reveal">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
        Let&apos;s talk.
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
        If you are hiring for AI workflow or agentic-systems work, the resume is
        the 30-second version and my agent can answer the rest.
      </p>
      <div className="mt-(--space-md)">
        <CtaRow github={github} linkedin={linkedin} />
      </div>
      {email && (
        <p className="mt-(--space-sm) font-mono text-xs text-muted">
          or email{' '}
          <a
            href={`mailto:${email}`}
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            {email}
          </a>
        </p>
      )}
    </Section>
  );
}
