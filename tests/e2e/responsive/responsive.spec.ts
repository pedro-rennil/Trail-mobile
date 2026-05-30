import { test, expect } from '@playwright/test';

// Breakpoints from the test plan. MUI's `md` breakpoint is 900px, which the
// auth feature panel uses (display: { xs: 'none', md: 'flex' }).
const VIEWPORTS = {
  mobile: { width: 640, height: 900 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 900 },
} as const;

test.describe('Responsive layout (sign-in)', () => {
  test('hides the feature panel on mobile (640px)', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/signin');

    await expect(page.getByRole('heading', { name: 'Bem-vindo de volta.' })).toBeVisible();
    await expect(page.getByText('O QUE TE ESPERA')).toBeHidden();
  });

  test('hides the feature panel on tablet (768px, below the md breakpoint)', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/signin');
    await expect(page.getByText('O QUE TE ESPERA')).toBeHidden();
  });

  test('shows the split layout with the feature panel on desktop (1280px)', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/signin');

    await expect(page.getByRole('heading', { name: 'Bem-vindo de volta.' })).toBeVisible();
    await expect(page.getByText('O QUE TE ESPERA')).toBeVisible();
  });
});
