import { screen } from '@testing-library/react';
import ProgressCard from '@/components/ui/ProgressCard';
import { renderWithProviders } from '../../utils/renderWithProviders';
import { makeTrail } from '../../fixtures/trails';

describe('ProgressCard', () => {
  it('shows the trail title, percentage and lesson count', () => {
    const trail = makeTrail({
      title: 'React Fundamentals',
      progress: 62,
      lessonsDone: 15,
      lessonsTotal: 24,
    });
    renderWithProviders(<ProgressCard trail={trail} />);

    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('62%')).toBeInTheDocument();
    expect(screen.getByText('15 de 24 aulas')).toBeInTheDocument();
  });

  it('exposes an accessible progressbar reflecting the clamped value', () => {
    const trail = makeTrail({ title: 'React Fundamentals', progress: 130 });
    renderWithProviders(<ProgressCard trail={trail} />);

    const bar = screen.getByRole('progressbar', { name: /Progresso de React Fundamentals/i });
    expect(bar).toHaveAttribute('aria-valuenow', '100'); // clamped from 130
  });

  it('is a plain group when no handler is supplied', () => {
    const trail = makeTrail({ title: 'React Fundamentals' });
    renderWithProviders(<ProgressCard trail={trail} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('behaves as a button and reports the trail id when interactive', async () => {
    const onOpen = jest.fn();
    const trail = makeTrail({ id: 'react-fundamentals', title: 'React Fundamentals' });
    const { user } = renderWithProviders(<ProgressCard trail={trail} onOpen={onOpen} />);

    await user.click(screen.getByRole('button', { name: /React Fundamentals/i }));
    expect(onOpen).toHaveBeenCalledWith('react-fundamentals');
  });

  it('opens via the keyboard (Enter / Space) when interactive', async () => {
    const onOpen = jest.fn();
    const trail = makeTrail({ id: 'react-fundamentals', title: 'React Fundamentals' });
    const { user } = renderWithProviders(<ProgressCard trail={trail} onOpen={onOpen} />);

    const card = screen.getByRole('button', { name: /React Fundamentals/i });
    card.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onOpen).toHaveBeenCalledTimes(2);
  });
});
