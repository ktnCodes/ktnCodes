import { test, expect } from '@playwright/test';

test('dark mode toggle swaps palette; hero copy stays stable', async ({ page }) => {
  await page.goto('/');
  const heroH1 = page.getByRole('heading', { level: 1 }).first();
  await expect(heroH1).toContainText('I build agentic workflow');
  // Toggle to dark via the nav button
  await page.getByRole('button', { name: /switch to dark mode/i }).click();
  // data-theme on html element flips to "dark"
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  // The positioning message is theme-independent (the old darkThesis swap
  // was retired with the redesign).
  await expect(heroH1).toContainText('I build agentic workflow');
});
