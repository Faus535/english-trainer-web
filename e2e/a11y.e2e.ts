import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('login page has proper ARIA labels', async ({ page }) => {
    await page.goto('/auth/login');
    const inputs = page.locator('input');
    for (let i = 0; i < (await inputs.count()); i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      if (id) await expect(page.locator(`label[for="${id}"]`)).toBeVisible();
    }
  });

  test('main content is focusable', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => sessionStorage.setItem('et_token', 'mock-token'));
    await page.goto('/dashboard');
    const main = page.locator('main');
    await expect(main).toHaveAttribute('tabindex', '-1');
  });
});
