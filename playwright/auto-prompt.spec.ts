import { test, expect } from '@playwright/test';

test('clicking a Finder leaf in chat-active mode auto-prompts the AI', async ({ page }) => {
  // Stub the chat API so we don't depend on a real LLM in CI
  await page.route('**/api/chat', async (route) => {
    // Just return a minimal SSE-ish OK so the chat hook doesn't error
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'text/event-stream' },
      body: 'data: [DONE]\n\n',
    });
  });
  await page.goto('/');
  // Open chat
  await page.getByRole('button', { name: /open chat with kevin/i }).first().click();
  // Both desktop slot + mobile sheet mount TerminalChat on chat-active.
  await expect(
    page.getByText('Initializing terminal...').filter({ visible: true })
  ).toBeVisible();
  // Click a leaf that is visible in the default state (DEFAULT_OPEN points
  // at shipped/ideaverse-os; arkive lives in inflight and would need a
  // folder navigation first).
  await page
    .locator('button:has-text("ideaverse-os.md")')
    .filter({ visible: true })
    .first()
    .click();
  // The user-message bubble should contain "Tell me about". TerminalChat
  // renders in both the mobile sheet and the desktop slot; filter visible.
  await expect(
    page.locator('text=/Tell me about/').filter({ visible: true }).first()
  ).toBeVisible({ timeout: 4000 });
});
