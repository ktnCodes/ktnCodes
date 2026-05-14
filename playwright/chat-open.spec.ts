import { test, expect } from '@playwright/test';

test('clicking Memoji opens chat panel and swaps brand band', async ({ page }) => {
  await page.goto('/');
  // Hero h1 is rendered as the first heading; an MDX h1 from the project
  // preview also exists below the hero, so scope to the first match.
  await expect(page.getByRole('heading', { level: 1 }).first()).toContainText('Embedded engineer.');
  // The hero Memoji is a button labeled "Click to chat with Kevin"
  const memoji = page.getByRole('button', { name: /open chat with kevin/i }).first();
  await memoji.click();
  // TerminalChat boot lines appear when the empty state mounts. BrandBand
  // mounts TerminalChat in BOTH the mobile sheet and the desktop slot
  // (each gated on chatActive), so filter to the visible instance.
  await expect(
    page.getByText('Initializing terminal...').filter({ visible: true })
  ).toBeVisible();
  // Hero thesis text should no longer be visible (AnimatePresence mode="wait" unmounts it)
  await expect(page.getByText('Embedded engineer.')).not.toBeVisible();
  // Close re-opens hero (red traffic light has aria-label="Close chat")
  await page
    .getByRole('button', { name: /close chat/i })
    .filter({ visible: true })
    .click();
  await expect(page.getByRole('heading', { level: 1 }).first()).toContainText('Embedded engineer.');
});
