import { describe, it, expect } from 'vitest';
import {
  reduceFinderState,
  type FinderWindowState,
} from './finder-window-controller';

describe('reduceFinderState', () => {
  const allStates: FinderWindowState[] = ['open', 'closed', 'minimized', 'fullscreen'];

  it('close always lands in closed', () => {
    for (const s of allStates) {
      expect(reduceFinderState(s, 'close')).toBe('closed');
    }
  });

  it('minimize always lands in minimized', () => {
    for (const s of allStates) {
      expect(reduceFinderState(s, 'minimize')).toBe('minimized');
    }
  });

  it('open always lands in open', () => {
    for (const s of allStates) {
      expect(reduceFinderState(s, 'open')).toBe('open');
    }
  });

  it('toggleFullscreen flips fullscreen <-> open', () => {
    expect(reduceFinderState('open', 'toggleFullscreen')).toBe('fullscreen');
    expect(reduceFinderState('fullscreen', 'toggleFullscreen')).toBe('open');
  });

  it('toggleFullscreen from non-open/non-fullscreen still goes to fullscreen', () => {
    // Useful invariant: pressing green from a closed or minimized state
    // shouldn't trap the user -- it should pop the window into fullscreen.
    expect(reduceFinderState('closed', 'toggleFullscreen')).toBe('fullscreen');
    expect(reduceFinderState('minimized', 'toggleFullscreen')).toBe('fullscreen');
  });

  it('open -> minimize -> open round-trips cleanly', () => {
    let s: FinderWindowState = 'open';
    s = reduceFinderState(s, 'minimize');
    expect(s).toBe('minimized');
    s = reduceFinderState(s, 'open');
    expect(s).toBe('open');
  });
});
