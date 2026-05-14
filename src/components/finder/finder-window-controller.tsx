'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type FinderWindowState = 'open' | 'closed' | 'minimized' | 'fullscreen';
export type FinderWindowAction =
  | 'close'
  | 'minimize'
  | 'open'
  | 'toggleFullscreen';

/**
 * Pure state reducer. Extracted so it can be unit-tested without needing
 * to render the React provider.
 */
export function reduceFinderState(
  current: FinderWindowState,
  action: FinderWindowAction
): FinderWindowState {
  switch (action) {
    case 'close':
      return 'closed';
    case 'minimize':
      return 'minimized';
    case 'open':
      return 'open';
    case 'toggleFullscreen':
      return current === 'fullscreen' ? 'open' : 'fullscreen';
  }
}

interface ControllerValue {
  state: FinderWindowState;
  close: () => void;
  minimize: () => void;
  toggleFullscreen: () => void;
  open: () => void;
}

const Ctx = createContext<ControllerValue | null>(null);

export function FinderWindowControllerProvider({
  children,
  initial = 'open',
}: {
  children: ReactNode;
  initial?: FinderWindowState;
}) {
  const [state, setState] = useState<FinderWindowState>(initial);
  const value: ControllerValue = {
    state,
    close: () => setState((s) => reduceFinderState(s, 'close')),
    minimize: () => setState((s) => reduceFinderState(s, 'minimize')),
    toggleFullscreen: () =>
      setState((s) => reduceFinderState(s, 'toggleFullscreen')),
    open: () => setState((s) => reduceFinderState(s, 'open')),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Returns null if not inside a provider -- caller decides what to do. */
export function useFinderWindowController() {
  return useContext(Ctx);
}
