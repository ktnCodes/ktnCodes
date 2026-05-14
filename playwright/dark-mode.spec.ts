import { test, expect } from '@playwright/test';

test('dark mode toggle swaps palette + hero copy', async ({ page }) => {
  await page.goto('/');
  // MDX project preview h1s also exist on the page; scope to the hero h1.
  const heroH1 = page.getByRole('heading', { level: 1 }).first();
  // Light default — thesis line 1 is "Embedded engineer."
  await expect(heroH1).toContainText('Embedded engineer.');
  // Toggle to dark via the nav button
  await page.getByRole('button', { name: /switch to dark mode/i }).click();
  // Hero copy variant appears -- darkThesis line 3 in content/hero.json
  await expect(heroH1).toContainText('Readable.');
  // data-theme on html element flips to "dark"
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
