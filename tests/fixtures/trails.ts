// Trail fixtures reuse the project's mock data so there is a single source of
// truth. Builders add per-test overrides without copying the shape.

import { MOCK_TRAILS } from '@/mocks/trails';
import type { Trail } from '@/types';

export const trailsFixture: Trail[] = MOCK_TRAILS;
export const trailFixture: Trail = MOCK_TRAILS[0];

/** Build a trail from the base fixture with selective overrides. */
export function makeTrail(overrides: Partial<Trail> = {}): Trail {
  return { ...MOCK_TRAILS[0], ...overrides };
}
