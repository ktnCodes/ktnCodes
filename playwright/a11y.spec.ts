import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage has no axe-detectable a11y violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .disableRules(['region']) // allow main without explicit region in our hero band
    .analyze();
  expect(results.violations).toEqual([]);
});
