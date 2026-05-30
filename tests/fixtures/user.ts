// User fixtures reuse the project's mock data so there is a single source of truth.

import { MOCK_USER } from '@/mocks/user';
import type { User } from '@/types';

export const userFixture: User = MOCK_USER;

/** Build a user from the base fixture with selective overrides. */
export function makeUser(overrides: Partial<User> = {}): User {
  return { ...MOCK_USER, ...overrides };
}

export const mentorFixture: User = makeUser({ role: 'mentor', name: 'Ana Mentora' });
