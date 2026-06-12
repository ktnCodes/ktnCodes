import { test, expect } from '@playwright/test';

test('landing renders hero + Finder pre-loads the workspace README', async ({ page }) => {
  await page.goto('/');
  // MDX preview content also renders headings; scope to the first (hero) h1.
  await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(
    'I build agentic workflow'
  );
  // Hero chips render for both desktop + mobile breakpoints; CSS hides one.
  await expect(page.getByText('Currently @ John Deere').first()).toBeVisible();
  // Finder shows README.md pre-selected (in the _root leaf column).
  await expect(page.locator('text=README.md').first()).toBeVisible();
  // Preview pane renders the pitch heading -- desktop + mobile both render
  // it in DOM (CSS hides one), so take the first match.
  await expect(
    page.locator('h2', { hasText: 'AI workflow engineer' }).first()
  ).toBeVisible();
});

test('deeplink ?open= round-trips', async ({ page }) => {
  // arkive.md has frontmatter `folder: inflight`, so the URL must address
  // that folder slug -- not the older `coding-projects/` path.
  await page.goto('/?open=inflight/arkive');
  await expect(page.locator('h2', { hasText: 'Arkive' }).first()).toBeVisible();
});
