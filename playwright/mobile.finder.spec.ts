import { test, expect } from '@playwright/test';

test('mobile Finder uses iOS Files drill-in pattern', async ({ page }) => {
  await page.goto('/');
  // The mobile Finder has the same content but rendered as a list under md breakpoint
  // Default state has ideaverse-os preview visible
  await expect(page.locator('h2', { hasText: 'ideaverse-OS' })).toBeVisible();
  // Back button is present in the leaf view
  await expect(page.getByRole('button', { name: /^back$/i })).toBeVisible();
  // Tap back → returns to folder view
  await page.getByRole('button', { name: /^back$/i }).click();
  await expect(page.getByText(/arkive\.md/)).toBeVisible();
});
