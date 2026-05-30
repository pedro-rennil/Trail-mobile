// MSW request handlers describing the REST contract the prototype will adopt
// once services/api.ts talks to a real backend. They reuse the same fixtures
// as the rest of the suite to avoid duplicated mock data.

import { http, HttpResponse } from 'msw';
import { trailsFixture } from '../fixtures/trails';
import { userFixture } from '../fixtures/user';

// '*' prefix matches any origin so the same handlers work in node and browser.
export const handlers = [
  http.get('*/api/trails', () => HttpResponse.json(trailsFixture)),

  http.get('*/api/trails/:id', ({ params }) => {
    const trail = trailsFixture.find((t) => t.id === params.id);
    return trail ? HttpResponse.json(trail) : new HttpResponse(null, { status: 404 });
  }),

  http.get('*/api/me', () => HttpResponse.json(userFixture)),

  http.post('*/api/auth/login', () => HttpResponse.json(userFixture)),

  http.post('*/api/auth/password-reset', () => HttpResponse.json({ ok: true })),
];
