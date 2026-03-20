import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('login page renders correctly', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.locator('h1')).toContainText('English Trainer');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('register page renders correctly', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.locator('h1')).toContainText('English Trainer');
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('input#confirmPassword')).toBeVisible();
  });

  test('login form validates required fields', async ({ page }) => {
    await page.goto('/auth/login');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('.field-error')).toHaveCount(2);
  });

  test('register form validates password match', async ({ page }) => {
    await page.goto('/auth/register');
    await page.fill('input#email', 'test@test.com');
    await page.fill('input#password', 'password123');
    await page.fill('input#confirmPassword', 'different');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('.auth-error')).toContainText('contrasenas no coinciden');
  });

  test('navigates between login and register', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('a[href="/auth/register"]');
    await expect(page).toHaveURL(/\/auth\/register/);
    await page.click('a[href="/auth/login"]');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
