import { test, expect } from '@playwright/test';

test('landing renders thesis + Finder pre-loads ideaverse-os', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Embedded engineer.');
  await expect(page.getByText('Currently @ John Deere')).toBeVisible();
  // Finder shows "ideaverse-os" pre-selected (in the leaf column)
  await expect(page.locator('text=ideaverse-os.md')).toBeVisible();
  // Preview header shows the project name
  await expect(page.locator('h2', { hasText: 'ideaverse-OS' })).toBeVisible();
});

test('deeplink ?open= round-trips', async ({ page }) => {
  await page.goto('/?open=coding-projects/arkive');
  await expect(page.locator('h2', { hasText: 'Arkive' }).first()).toBeVisible();
});
