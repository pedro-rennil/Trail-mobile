import { screen, within } from '@testing-library/react';
import Topbar from '@/components/layout/Topbar';
import { renderWithProviders } from '../../utils/renderWithProviders';
import { setPathname } from '../../utils/navigationMock';

describe('Topbar search bar', () => {
  it('exposes an accessible search landmark with a keyboard hint', () => {
    renderWithProviders(<Topbar />);

    const search = screen.getByRole('search');
    expect(search).toBeInTheDocument();
    expect(within(search).getByText('Buscar...')).toBeInTheDocument();
    expect(within(search).getByText('⌘K')).toBeInTheDocument();
  });

  it('reflects the current route in the breadcrumb', () => {
    setPathname('/progresso');
    renderWithProviders(<Topbar />);

    const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(breadcrumb).getByText('Progresso')).toBeInTheDocument();
  });
});
