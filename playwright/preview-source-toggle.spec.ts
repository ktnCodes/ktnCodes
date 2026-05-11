import { test, expect } from '@playwright/test';

test('Preview/Source toggle swaps view + persists in URL', async ({ page }) => {
  await page.goto('/');
  // Default = Preview view
  await expect(page.getByRole('tab', { name: /preview/i, selected: true })).toBeVisible();
  // Click Source
  await page.getByRole('tab', { name: /source/i }).click();
  await expect(page.getByText(/raw/i).first()).toBeVisible();
  // URL contains view=source
  await expect(page).toHaveURL(/view=source/);
  // Click Preview to flip back
  await page.getByRole('tab', { name: /preview/i }).click();
  await expect(page).not.toHaveURL(/view=source/);
});
