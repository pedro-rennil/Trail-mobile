// Shared Playwright helpers. Imported by e2e specs — keeps auth seeding and
// the login flow in one place so specs stay focused on behaviour.

import type { Page } from '@playwright/test';
import { MOCK_USER } from '../../mocks/user';

const PERSIST_KEY = 'trail-auth';

/**
 * Seed an authenticated session by pre-populating the Zustand persist store,
 * matching the shape written by zustand/middleware `persist`. Must be called
 * before the first navigation.
 */
export async function seedAuth(page: Page, user = MOCK_USER): Promise<void> {
  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(
        key as string,
        JSON.stringify({ state: { user: value, favorites: [] }, version: 0 })
      );
    },
    [PERSIST_KEY, user] as const
  );
}

/** Drive the real sign-in form end to end and wait for the dashboard. */
export async function signInViaUi(
  page: Page,
  email = 'matheus.silva@trail.dev',
  password = 'super-secret'
): Promise<void> {
  await page.goto('/signin');
  await page.getByLabel(/e-mail/i).fill(email);
  await page.getByLabel(/^senha/i).fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL('**/dashboard');
}
