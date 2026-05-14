import { test, expect } from '@playwright/test';

test('mobile Finder uses iOS Files drill-in pattern', async ({ page }, testInfo) => {
  // MobileFinder is `md:hidden`; only the iPhone 14 viewport renders it.
  test.skip(testInfo.project.name === 'desktop', 'Tests mobile-only viewport');
  await page.goto('/');
  // Both desktop FinderWindow and MobileFinder render their nodes in DOM;
  // CSS hides one per breakpoint. Filter visible so the test works on both
  // the desktop project (sees desktop matches) and mobile project (mobile).
  const visibleH2 = page
    .locator('h2', { hasText: 'ideaverse-OS' })
    .filter({ visible: true });
  await expect(visibleH2).toBeVisible();
  // MobileFinder's Back button is aria-label "Back"; FinderWindow toolbar
  // uses "Navigate back" so they don't collide.
  const visibleBack = page
    .getByRole('button', { name: /^back$/i })
    .filter({ visible: true });
  await expect(visibleBack).toBeVisible();
  // Tap back → returns to leaf list view in the shipped folder.
  await visibleBack.click();
  await expect(
    page.getByText('ideaverse-os.md').filter({ visible: true })
  ).toBeVisible();
});
