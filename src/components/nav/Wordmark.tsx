import Link from 'next/link';

export function Wordmark() {
  return (
    <Link
      href="/"
      className="fixed top-(--space-md) left-(--space-md) z-40 font-semibold text-foreground tracking-tight text-[18px] hover:opacity-80 transition-opacity"
    >
      ktncodes.
    </Link>
  );
}
