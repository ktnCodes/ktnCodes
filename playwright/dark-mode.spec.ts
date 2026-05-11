import { test, expect } from '@playwright/test';

test('dark mode toggle swaps palette + hero copy', async ({ page }) => {
  await page.goto('/');
  // Light default — thesis line 1 is "Embedded engineer."
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Embedded engineer.');
  // Toggle to dark via the nav button
  await page.getByRole('button', { name: /switch to dark mode/i }).click();
  // Hero copy variant appears
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Read the source.');
  // data-theme on html element flips to "dark"
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
