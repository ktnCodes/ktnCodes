import { test, expect } from '@playwright/test';

test('landing renders thesis + Finder pre-loads ideaverse-os', async ({ page }) => {
  await page.goto('/');
  // MDX project preview also renders h1s; scope to the first (hero) heading.
  await expect(page.getByRole('heading', { level: 1 }).first()).toContainText('Embedded engineer.');
  // Eyebrow renders for both desktop + mobile breakpoints; CSS hides one.
  await expect(page.getByText('Currently @ John Deere').first()).toBeVisible();
  // Finder shows "ideaverse-os" pre-selected (in the leaf column)
  await expect(page.locator('text=ideaverse-os.md').first()).toBeVisible();
  // Preview header shows the project name -- desktop + mobile both render
  // it in DOM (CSS hides one), so take the first match.
  await expect(page.locator('h2', { hasText: 'ideaverse-OS' }).first()).toBeVisible();
});

test('deeplink ?open= round-trips', async ({ page }) => {
  // arkive.md has frontmatter `folder: inflight`, so the URL must address
  // that folder slug -- not the older `coding-projects/` path.
  await page.goto('/?open=inflight/arkive');
  await expect(page.locator('h2', { hasText: 'Arkive' }).first()).toBeVisible();
});
