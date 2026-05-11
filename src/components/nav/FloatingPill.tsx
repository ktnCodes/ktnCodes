'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'Posts' },
  { href: '/#contact', label: 'Contact' },
];

/**
 * Centered floating glass pill with the Memoji + nav links + theme toggle.
 * Always sticky. Background opacity 70% → 85% as the user scrolls past the
 * hero (cheap window scrollY check; could be IntersectionObserver later).
 */
export function FloatingPill() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 200);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDark = mounted && (resolvedTheme ?? theme) === 'dark';

  return (
    <nav
      aria-label="Primary"
      className="fixed top-(--space-sm) left-1/2 -translate-x-1/2 z-50 flex items-center gap-0 rounded-full border border-hairline shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md transition-colors text-[13px] p-1.5"
      style={{ background: scrolled ? 'var(--pill-bg-scrolled)' : 'var(--pill-bg)' }}
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
        className="ml-1.5 px-2.5 py-1.5 border-l border-hairline text-muted hover:text-foreground inline-flex items-center gap-1.5"
      >
        <span aria-hidden>{mounted ? (isDark ? '☀' : '🌙') : '🌙'}</span>
      </button>
    </nav>
  );
}
