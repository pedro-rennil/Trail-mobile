// MSW worker for the browser. Use during local development / Playwright runs
// when you want to serve the mocked REST contract without a backend:
//
//   import { worker } from '@/tests/mocks/browser';
//   if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') await worker.start();

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
