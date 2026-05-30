import { screen } from '@testing-library/react';
import RequireAuth from '@/components/auth/RequireAuth';
import { renderWithProviders } from '../../utils/renderWithProviders';
import { routerMock } from '../../utils/navigationMock';
import { seedUser } from '../../utils/testHelpers';

describe('RequireAuth', () => {
  it('redirects to /signin and renders nothing when unauthenticated', () => {
    renderWithProviders(
      <RequireAuth>
        <div>conteúdo protegido</div>
      </RequireAuth>
    );

    expect(routerMock.replace).toHaveBeenCalledWith('/signin');
    expect(screen.queryByText('conteúdo protegido')).not.toBeInTheDocument();
  });

  it('renders children for an authenticated user without redirecting', () => {
    seedUser();
    renderWithProviders(
      <RequireAuth>
        <div>conteúdo protegido</div>
      </RequireAuth>
    );

    expect(screen.getByText('conteúdo protegido')).toBeInTheDocument();
    expect(routerMock.replace).not.toHaveBeenCalled();
  });
});
