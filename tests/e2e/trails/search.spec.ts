import { test, expect } from '@playwright/test';
import { seedAuth } from '../../setup/playwright.setup';

test.describe('Trails — browse & search', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page);
  });

  test('lists the student trails on the dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('Minhas trilhas', { exact: true })).toBeVisible();
    await expect(page.getByText('React Fundamentals').first()).toBeVisible();
  });

  test('opens a trail from the dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'Continuar' }).first().click();
    await expect(page).toHaveURL(/\/trilha\//);
  });

  test('exposes the global search landmark with its keyboard hint', async ({ page }) => {
    await page.goto('/dashboard');
    const search = page.getByRole('search');
    await expect(search).toBeVisible();
    await expect(search.getByText('⌘K')).toBeVisible();
  });

  // The ⌘K command palette / live trail search is not implemented yet. The logic
  // (filterTrails + useDebouncedValue) is unit-tested; enable this once the UI ships.
  test.fixme('filters trails as the user types in the search box', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('searchbox').fill('next');
    await expect(page.getByText('Advanced Next.js')).toBeVisible();
    await expect(page.getByText('React Fundamentals')).toBeHidden();
  });
});
