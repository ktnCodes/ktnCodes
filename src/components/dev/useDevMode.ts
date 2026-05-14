'use client';

import { useSyncExternalStore } from 'react';

/**
 * True only when running in dev mode AND on localhost. Production builds
 * always return false so the editor never bleeds to the live site.
 */
export function useDevMode(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServer);
}

function subscribe() {
  return () => {};
}
function getSnapshot(): boolean {
  if (process.env.NODE_ENV !== 'development') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
}
function getServer(): boolean {
  return false;
}
