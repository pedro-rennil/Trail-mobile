// Runs once before every test file (setupFilesAfterEnv).

import '@testing-library/jest-dom';
import { resetStore } from '../utils/testHelpers';
import { setPathname } from '../utils/navigationMock';

// Mock the App Router globally so any component using useRouter/usePathname works.
// require() is mandatory here — jest.mock factories are hoisted above imports.
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('next/navigation', () => require('../utils/navigationMock').navigationMock);

// ── MSW ───────────────────────────────────────────────────────────────────────
// The prototype's services/api.ts returns local mock data (no network), so the
// MSW *node* server is intentionally NOT started here — integration tests mock
// the api module directly (the real seam). When services/api.ts starts making
// fetch calls, activate interception by uncommenting the block below:
//
//   import { server } from '../mocks/server';
//   beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
//   afterEach(() => server.resetHandlers());
//   afterAll(() => server.close());

afterEach(() => {
  resetStore();
  setPathname('/');
});
