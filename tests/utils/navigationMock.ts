// Single source of truth for the next/navigation mock.
// Imported by jest.setup.ts via jest.mock so every component using the
// App Router hooks works without each test re-declaring the mock.

export const routerMock = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

let pathname = '/';

/** Override the value returned by usePathname() for the next render. */
export function setPathname(value: string): void {
  pathname = value;
}

export const navigationMock = {
  useRouter: () => routerMock,
  usePathname: () => pathname,
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  redirect: jest.fn(),
  notFound: jest.fn(),
};
