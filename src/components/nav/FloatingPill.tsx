'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { MetalWrap } from '@/components/fx/MetalWrap';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'Posts' },
  { href: '/#contact', label: 'Contact' },
];

/**
 * Centered floating pill with the Memoji + nav links + theme toggle.
 * Always sticky. Outline is a metal-fx animated ring; no glass bg.
 */
export function FloatingPill() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hideOnSubdomain, setHideOnSubdomain] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Hide on ideaverse-os.ktncodes.com (and any future product subdomain).
    // The marketing surfaces there have their own navigation; the main-site
    // nav links (/posts, /#contact) point at routes that don't exist on the
    // subdomain after the host-based rewrite.
    setHideOnSubdomain(window.location.host.startsWith('ideaverse-os.'));
  }, []);

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
          <Image
            src="/memoji/idle.png"
            alt=""
            width={32}
            height={32}
            priority
            className="rounded-full mr-1.5"
          />
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || (link.href === '/' && pathname === '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`hidden sm:inline-block px-3 py-1.5 rounded-full transition-colors ${
                  active ? 'text-foreground font-medium' : 'text-muted hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
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
