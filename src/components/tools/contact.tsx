import type { Social } from "@/types/portfolio";

interface Props {
  email: string;
  social: Social;
}

export function Contact({ email, social }: Props) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
      <h3 className="font-semibold">Get in Touch</h3>
      <div className="space-y-2 text-sm">
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-2 text-accent hover:text-accent-hover transition-colors"
        >
          {email}
        </a>
        <a
          href={social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-foreground/80 hover:text-accent transition-colors"
        >
          GitHub &mdash; ktnCodes
        </a>
        <a
          href={social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-foreground/80 hover:text-accent transition-colors"
        >
          LinkedIn &mdash; itskevtrinh
        </a>
      </div>
    </div>
  );
}
