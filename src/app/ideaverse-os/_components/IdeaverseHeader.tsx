"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { IdeaverseLogoMark } from "./IdeaverseLogo";

const REPO_URL = "https://github.com/ktnCodes/ideaverse-os";
const VERSION = "v0.1.0";

const NAV_ITEMS = [
  { label: "Why", href: "/ideaverse-os#why" },
  { label: "Walkthrough", href: "/ideaverse-os#walkthrough" },
  { label: "Templates", href: "/ideaverse-os/templates" },
  { label: "Install", href: "/ideaverse-os#install" },
  { label: "Concepts", href: "/ideaverse-os#concepts" },
] as const;

type IdeaverseHeaderProps = {
  /** GitHub star count fetched server-side. null when the API call failed
   *  or the repo doesn't exist yet (pre-publish). */
  stars: number | null;
};

export function IdeaverseHeader({ stars }: IdeaverseHeaderProps) {
  const pathname = usePathname();
  const starLabel = stars === null ? null : formatStarCount(stars);

  function handleHomeClick(e: MouseEvent<HTMLAnchorElement>) {
    // If already on the home route, scroll the iv-scroll container to top
    // instead of triggering a navigation no-op.
    if (pathname === "/ideaverse-os") {
      e.preventDefault();
      const sc = document.querySelector("[data-iv-scroll]");
      if (sc) {
        sc.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-iv-wine/15 bg-iv-cream/95 backdrop-saturate-150">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        {/* Left: brand mark + wordmark — click to return to top */}
        <Link
          href="/ideaverse-os"
          onClick={handleHomeClick}
          className="group inline-flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
        >
          <IdeaverseLogoMark
            className="-mt-0.5 h-10 w-8 transition-transform group-hover:scale-[1.04]"
            ariaLabel="ideaverse-OS home"
            preserveAspectRatio="none"
          />
          <span className="font-iv-display text-[16px] font-semibold text-iv-wine transition-colors group-hover:text-iv-wine-deep">
            00-ideaverse
          </span>
        </Link>

        {/* Right: nav + version pill + github */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav
            aria-label="ideaverse-os sections"
            className="hidden items-center gap-0.5 md:flex lg:gap-1"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <span className="hidden items-center gap-1.5 rounded-full border border-iv-wine/30 bg-iv-rose/25 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-iv-wine lg:inline-flex">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-iv-wine"
            />
            {VERSION}
          </span>

          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={
              starLabel === null
                ? "View ideaverse-os on GitHub"
                : `View ideaverse-os on GitHub (${starLabel} stars)`
            }
            className="inline-flex items-center gap-2 rounded-full border border-iv-wine/15 bg-iv-cream-deep px-3 py-1.5 transition-colors hover:border-iv-wine/40 hover:bg-iv-cream-pale focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
          >
            <GitHubMark className="h-4 w-4 text-iv-ink" />
            {starLabel !== null && (
              <>
                <span className="font-sans text-[12px] font-semibold text-iv-ink">
                  {starLabel}
                </span>
                <span aria-hidden className="text-[12px] text-iv-amber">
                  {"★"}
                </span>
              </>
            )}
          </a>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-2.5 py-1.5 font-sans text-[12.5px] font-medium text-iv-ink transition-colors hover:bg-iv-cream-deep hover:text-iv-wine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
    >
      {children}
    </Link>
  );
}

function formatStarCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(count);
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
        transform="scale(64)"
      />
    </svg>
  );
}
