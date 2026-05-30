import { test, expect } from '@playwright/test';
import { seedAuth } from '../../setup/playwright.setup';

test.describe('Protected routes', () => {
  test('redirects an unauthenticated visitor from /dashboard to /signin', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/signin/);
  });

  test('also protects /progresso', async ({ page }) => {
    await page.goto('/progresso');
    await expect(page).toHaveURL(/\/signin/);
  });

  test('lets an authenticated user reach the dashboard', async ({ page }) => {
    await seedAuth(page);
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /Olá,/ })).toBeVisible();
  });
});
