'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { MetalWrap } from '@/components/fx/MetalWrap';
import { useIsMounted } from '@/hooks/useIsMounted';

// `mobile: false` hides a link below sm; the Memoji itself links home, so
// Home is the only one that can afford to collapse. Posts/Contact/Resume must
// stay reachable on phones.
const NAV_LINKS = [
  { href: '/', label: 'Home', mobile: false },
  { href: '/posts', label: 'Posts', mobile: true },
  { href: '/#contact', label: 'Contact', mobile: true },
];

/**
 * Centered floating pill with the Memoji + nav links + theme toggle.
 * Always sticky. Outline is a metal-fx animated ring; no glass bg.
 */
export function FloatingPill() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();
  // Derive at render time: SSR returns false (no window) so the pill
  // renders, then on hydration it computes against the real host.
  // Hides on ideaverse-os.ktncodes.com (and any future product subdomain)
  // where the marketing surface has its own navigation.
  const hideOnSubdomain =
    mounted && typeof window !== 'undefined' &&
    window.location.host.startsWith('ideaverse-os.');

  const isDark = mounted && (resolvedTheme ?? theme) === 'dark';

  if (mounted && hideOnSubdomain) return null;

  return (
    <nav
      aria-label="Primary"
      className="fixed top-(--space-sm) left-1/2 -translate-x-1/2 z-50"
    >
      <MetalWrap>
        <div
          className="flex items-center gap-0 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-colors text-[13px] p-1.5"
        >
          <Link href="/" aria-label="Home" className="mr-1.5 shrink-0">
            <Image
              src="/memoji/idle.png"
              alt=""
              width={32}
              height={32}
              priority
              className="rounded-full"
            />
          </Link>
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || (link.href === '/' && pathname === '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  link.mobile ? 'inline-block' : 'hidden sm:inline-block'
                } px-2.5 sm:px-3 py-1.5 rounded-full transition-colors ${
                  active ? 'text-foreground font-medium' : 'text-muted hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href="/api/resume"
            download="Kevin_Nguyen_Resume.pdf"
            className="inline-block px-2.5 sm:px-3 py-1.5 rounded-full transition-colors text-muted hover:text-foreground"
          >
            Resume
          </a>
          <button
            type="button"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            suppressHydrationWarning
            className="ml-1.5 px-2.5 py-1.5 text-muted hover:text-foreground inline-flex items-center gap-1.5"
          >
            <span aria-hidden>{mounted ? (isDark ? '☀' : '🌙') : '🌙'}</span>
          </button>
        </div>
      </MetalWrap>
    </nav>
  );
}
