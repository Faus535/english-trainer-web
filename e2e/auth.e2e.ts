import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.locator('h1')).toContainText('English Trainer');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should show validation errors on empty submit', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('button[type="submit"]');
    await expect(page.locator('.field-error')).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('a[href="/auth/register"]');
    await expect(page).toHaveURL('/auth/register');
  });

  test('should navigate to forgot password', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('a[href="/auth/forgot-password"]');
    await expect(page).toHaveURL('/auth/forgot-password');
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/auth/login');
    const passwordInput = page.locator('#login-password');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await page.click('.password-toggle');
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
