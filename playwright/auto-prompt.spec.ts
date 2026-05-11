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
  await page.getByRole('button', { name: /click to chat with kevin/i }).first().click();
  await expect(page.getByText('Chat with Kevin')).toBeVisible();
  // Click a leaf in the Finder (still visible while chat-active, just dimmed)
  // The auto-prompt sends "Tell me about <name>." as a user message
  const leaf = page.locator('button:has-text("arkive.md")').first();
  await leaf.click();
  // The user-message bubble should contain "Tell me about"
  await expect(page.locator('text=/Tell me about/').first()).toBeVisible({ timeout: 4000 });
});
