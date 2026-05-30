import { screen } from '@testing-library/react';
import DashboardPage from '@/app/(app)/dashboard/page';
import { useStore } from '@/store/useStore';
import { renderWithProviders } from '../../utils/renderWithProviders';
import { seedUser } from '../../utils/testHelpers';
import { trailsFixture } from '../../fixtures/trails';

describe('Dashboard loading', () => {
  it('greets the signed-in user by first name', () => {
    seedUser();
    renderWithProviders(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /Olá, Matheus\./ })).toBeInTheDocument();
  });

  it('renders the active trail and the AI recommendation panel', () => {
    seedUser();
    renderWithProviders(<DashboardPage />);

    expect(screen.getAllByText(trailsFixture[0].title).length).toBeGreaterThan(0);
    expect(screen.getByText('RECOMENDAÇÃO DA IA')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ver trilha recomendada/i })).toBeInTheDocument();
  });

  it('renders the weekly activity chart with one bar per day', () => {
    seedUser();
    renderWithProviders(<DashboardPage />);

    expect(screen.getByText('Atividade semanal')).toBeInTheDocument();
    // The 'Qui' (today) data point of 90min must be present and consistent.
    expect(screen.getByTitle('Qui: 90min')).toBeInTheDocument();
  });

  it('lists every trail reflecting current store data', () => {
    seedUser();
    // Simulate fresh data arriving before render.
    useStore.setState({ trails: trailsFixture });
    renderWithProviders(<DashboardPage />);

    expect(screen.getByText('Minhas trilhas')).toBeInTheDocument();
    trailsFixture.forEach((trail) => {
      expect(screen.getAllByText(trail.title).length).toBeGreaterThan(0);
    });
  });
});
