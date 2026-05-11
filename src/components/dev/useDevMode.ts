'use client';

import { useEffect, useState } from 'react';

/**
 * True only when running in dev mode AND on localhost. Production builds
 * always return false so the editor never bleeds to the live site.
 */
export function useDevMode(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')) {
      setEnabled(true);
    }
  }, []);
  return enabled;
}
