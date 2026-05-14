import { test, expect } from '@playwright/test';

/**
 * Covers the new interactive desktop surface added to the homepage:
 * working Finder traffic lights, dock toggles, the Mail modal, and the
 * affordance hint.
 */

test('Finder traffic lights drive window state via the dock', async ({ page }, testInfo) => {
  // The interactive desktop is `hidden md:block`; only renders at md+ widths.
  test.skip(testInfo.project.name === 'mobile', 'Desktop-only surface');
  await page.goto('/');

  const finderWindow = page.locator('.finder-desktop-window');
  await expect(finderWindow).toHaveAttribute('data-state', 'open');

  // Red traffic light closes the window. There are TWO red lights on the
  // page (TerminalChat + FinderWindow); the FinderWindow titlebar one is
  // labeled "Close" while TerminalChat's is "Close chat".
  await page.getByRole('button', { name: /^close$/i }).first().click();
  await expect(finderWindow).toHaveAttribute('data-state', 'closed');

  // Affordance hint appears now that the window is gone.
  await expect(page.locator('.finder-hint')).not.toHaveClass(/hidden/);

  // Click the Finder dock icon to restore.
  await page.getByRole('button', { name: 'Finder' }).click();
  await expect(finderWindow).toHaveAttribute('data-state', 'open');
});

test('Mail dock icon opens the contact modal; Esc dismisses', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Desktop-only surface');
  await page.goto('/');

  const modal = page.locator('.finder-mail-backdrop');
  await expect(modal).not.toHaveClass(/open/);

  await page.getByRole('button', { name: 'Mail', exact: true }).click();
  await expect(modal).toHaveClass(/open/);
  await expect(page.getByText('Want to get in touch?')).toBeVisible();
  // The email text appears on the contact section too; scope to the modal's
  // own pill element via the .finder-mail-email class.
  await expect(page.locator('.finder-mail-email')).toBeVisible();

  // Esc dismisses
  await page.keyboard.press('Escape');
  await expect(modal).not.toHaveClass(/open/);
});

test('Mail modal dismisses via the Not-now button', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Desktop-only surface');
  // Note: clicking the dock Mail icon to re-close is intercepted by the
  // modal backdrop (z-index 40 over dock 25), which is normal macOS-style
  // behavior. The intended dismiss paths are: Esc, backdrop click, or the
  // Not-now button -- we test the explicit button here.
  await page.goto('/');

  const modal = page.locator('.finder-mail-backdrop');
  await page.getByRole('button', { name: 'Mail', exact: true }).click();
  await expect(modal).toHaveClass(/open/);

  await page.getByRole('button', { name: 'Not now' }).click();
  await expect(modal).not.toHaveClass(/open/);
});
