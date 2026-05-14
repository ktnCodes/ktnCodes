'use client';

import type { ReactNode } from 'react';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { AffordanceHint } from './AffordanceHint';
import {
  FinderWindowControllerProvider,
  useFinderWindowController,
} from './finder-window-controller';

interface MacChromeProps {
  children: ReactNode;
  /** Hide the wallpaper/menu/dock on mobile (T15 swap to iOS Files). */
  hideOnMobile?: boolean;
}

/**
 * Interactive macOS-style desktop. Provides the wallpaper, menu bar, dock,
 * mail modal, and affordance hint around the FinderWindow children. The
 * Finder window's traffic lights and the dock's Finder icon both drive a
 * shared window-state controller so close/minimize/fullscreen actually
 * affect the window.
 */
export function MacChrome({ children, hideOnMobile = true }: MacChromeProps) {
  return (
    <FinderWindowControllerProvider>
      <div
        className={`finder-desktop ${hideOnMobile ? 'hidden md:block' : ''}`}
      >
        <MenuBar />
        <Affordance />
        {children}
        <Dock />
      </div>
    </FinderWindowControllerProvider>
  );
}

function Affordance() {
  const ctrl = useFinderWindowController();
  const visible = ctrl?.state === 'closed' || ctrl?.state === 'minimized';
  return <AffordanceHint visible={visible} />;
}
