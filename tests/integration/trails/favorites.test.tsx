import { screen } from '@testing-library/react';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { useStore } from '@/store/useStore';
import { renderWithProviders } from '../../utils/renderWithProviders';
import { trailFixture } from '../../fixtures/trails';

function renderButton() {
  return renderWithProviders(
    <FavoriteButton trailId={trailFixture.id} trailTitle={trailFixture.title} />
  );
}

describe('Favorite trail flow', () => {
  it('starts unfavorited with an accessible "add" label', () => {
    renderButton();
    const button = screen.getByRole('button', {
      name: `Adicionar ${trailFixture.title} aos favoritos`,
    });
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('adds the trail to favorites on first click and persists it in the store', async () => {
    const { user } = renderButton();

    await user.click(screen.getByRole('button'));

    expect(useStore.getState().favorites).toContain(trailFixture.id);
    expect(
      screen.getByRole('button', { name: `Remover ${trailFixture.title} dos favoritos` })
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('toggles the trail back off on a second click', async () => {
    const { user } = renderButton();
    const button = screen.getByRole('button');

    await user.click(button);
    await user.click(button);

    expect(useStore.getState().favorites).not.toContain(trailFixture.id);
  });
});
