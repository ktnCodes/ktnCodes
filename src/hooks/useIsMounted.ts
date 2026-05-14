'use client';

import { useSyncExternalStore } from 'react';

/**
 * Returns `false` during SSR and the first hydration render, then `true`
 * once on the client. Replacement for the `useEffect(() => setMounted(true), [])`
 * pattern that trips the `react-hooks/set-state-in-effect` rule.
 *
 * Use this when you need to read window/document or a client-only theme
 * value without causing a hydration mismatch.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    getClient,
    getServer,
  );
}

function subscribeNoop() {
  return () => {};
}
function getClient(): boolean {
  return true;
}
function getServer(): boolean {
  return false;
}
