import { test, expect } from '@playwright/test';

test.describe('App Navigation', () => {
  test('app loads without errors', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(dashboard|auth\/login)/);
  });

  test('settings page is accessible when authenticated', async ({ page }) => {
    // Simulate auth by setting token in localStorage
    await page.goto('/auth/login');
    await page.evaluate(() => {
      localStorage.setItem('et_token', 'fake-token-for-testing');
      localStorage.setItem('et_profile_id', 'fake-profile-id');
      localStorage.setItem('english_modular_profile', JSON.stringify({
        testCompleted: true,
        levels: { listening: 'a1', vocabulary: 'a1', grammar: 'a1', phrases: 'a1', pronunciation: 'a1' },
        moduleProgress: {},
        sessionCount: 0,
        sessionsThisWeek: 0,
        weekStart: null,
      }));
    });
    await page.goto('/settings');
    await expect(page.locator('text=Ajustes')).toBeVisible();
  });
});
