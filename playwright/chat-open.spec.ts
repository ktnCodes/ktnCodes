import { test, expect } from '@playwright/test';

test('clicking Memoji opens chat panel and swaps brand band', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Embedded engineer.');
  // The hero Memoji is a button labeled "Click to chat with Kevin"
  const memoji = page.getByRole('button', { name: /click to chat with kevin/i }).first();
  await memoji.click();
  // Chat panel header appears
  await expect(page.getByText('Chat with Kevin')).toBeVisible();
  // Hero thesis should no longer be visible
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(0);
  // Close re-opens hero
  await page.getByRole('button', { name: /close chat/i }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Embedded engineer.');
});
