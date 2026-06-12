/**
 * Shared conversion row: solid Resume pill + quiet links for chat, GitHub,
 * and LinkedIn. Social hrefs come in as props (single source of truth is
 * portfolio-config.json via the page); resume and chat targets are static.
 */
interface CtaRowProps {
  github: string;
  linkedin: string;
}

export function CtaRow({ github, linkedin }: CtaRowProps) {
  const quiet = [
    { label: 'Ask my agent', href: '#chat', external: false },
    { label: 'GitHub', href: github, external: true },
    { label: 'LinkedIn', href: linkedin, external: true },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-(--space-sm) gap-y-3">
      <a
        href="/resume.pdf"
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        <span aria-hidden>&#8595;</span>
        Resume (PDF)
      </a>
      {quiet.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
          className="font-mono text-xs text-muted underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
