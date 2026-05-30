// MSW server for Node (Jest). Activate in tests/setup/jest.setup.ts once
// services/api.ts performs real network requests — see the note there.

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
