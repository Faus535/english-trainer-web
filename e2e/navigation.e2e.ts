import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.setItem('et_token', 'mock-token');
      sessionStorage.setItem('et_profile_id', 'mock-profile-id');
      sessionStorage.setItem('et_email', 'test@test.com');
    });
  });

  test('should show bottom nav on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/dashboard');
    await expect(page.locator('nav.nav')).toBeVisible();
  });

  test('should show sidebar on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/dashboard');
    await expect(page.locator('aside.sidebar')).toBeVisible();
  });
});
