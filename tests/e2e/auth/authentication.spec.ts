import { test, expect } from '@playwright/test';
import { signInViaUi } from '../../setup/playwright.setup';

test.describe('Authentication', () => {
  test('signs in through the form and lands on the dashboard', async ({ page }) => {
    await signInViaUi(page);

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /Olá,/ })).toBeVisible();
  });

  test('rejects an invalid email before submitting', async ({ page }) => {
    await page.goto('/signin');
    await page.getByLabel(/e-mail/i).fill('not-an-email');
    await page.getByLabel(/^senha/i).fill('whatever');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('E-mail inválido.')).toBeVisible();
    await expect(page).toHaveURL(/\/signin/);
  });

  test('navigates from sign-in to password recovery and back', async ({ page }) => {
    await page.goto('/signin');
    await page.getByRole('link', { name: 'Esqueci minha senha' }).click();

    await expect(page).toHaveURL(/\/recuperar-senha/);
    await expect(page.getByRole('heading', { name: 'Esqueceu a senha?' })).toBeVisible();

    await page.getByRole('link', { name: 'Voltar para o login' }).click();
    await expect(page).toHaveURL(/\/signin/);
  });
});
