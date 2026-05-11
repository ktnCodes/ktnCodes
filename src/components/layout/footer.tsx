import { Mail } from "lucide-react";

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--hairline)] py-10">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <div className="small-caps text-xs text-muted">KTNCODES</div>
          <div className="small-caps text-xs text-foreground">
            KEVIN TRINH NGUYEN
          </div>
          <div className="small-caps text-xs text-muted">AUSTIN, TX</div>
        </div>
        <div className="space-y-1">
          <div className="small-caps text-xs text-muted">CONTACT</div>
          <a
            href="mailto:kevtrinhnguyen@gmail.com"
            className="text-xs text-foreground hover:text-accent flex items-center gap-2"
          >
            <Mail size={14} />
            kevtrinhnguyen@gmail.com
          </a>
          <div className="small-caps text-xs text-muted">
            {`(c) ${new Date().getFullYear()}`}
          </div>
        </div>
        <div className="space-y-1 md:text-right">
          <div className="small-caps text-xs text-muted">SOCIAL</div>
          <div className="flex gap-4 md:justify-end">
            <a
              href="https://github.com/ktnCodes"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="small-caps text-xs text-muted hover:text-accent flex items-center gap-2"
            >
              <GitHubIcon /> GITHUB
            </a>
            <a
              href="https://www.linkedin.com/in/itskevtrinh/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="small-caps text-xs text-muted hover:text-accent flex items-center gap-2"
            >
              <LinkedInIcon /> LINKEDIN
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
