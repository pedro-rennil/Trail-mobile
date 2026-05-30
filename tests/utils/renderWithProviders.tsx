import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/lib/theme';

function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export interface RenderWithProvidersResult extends RenderResult {
  /** Pre-configured user-event instance — prefer this over fireEvent. */
  user: UserEvent;
}

/**
 * Render a component inside the app's MUI theme and return a ready-to-use
 * user-event instance. Mirrors how components render in production.
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderWithProvidersResult {
  const user = userEvent.setup();
  const result = render(ui, { wrapper: Providers, ...options });
  return { user, ...result };
}

// Re-export the RTL surface so suites import everything from one place.
export * from '@testing-library/react';
export { userEvent };
