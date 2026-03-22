import { test, expect } from '@playwright/test';

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.setItem('et_token', 'mock-token');
      sessionStorage.setItem('et_profile_id', 'mock-profile-id');
    });
  });

  test('should display settings page', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('h2')).toContainText('Ajustes');
  });
});
