import { screen, waitFor } from '@testing-library/react';
import SignInPage from '@/app/(auth)/signin/page';
import { api } from '@/services/api';
import { useStore } from '@/store/useStore';
import { renderWithProviders } from '../../utils/renderWithProviders';
import { routerMock } from '../../utils/navigationMock';
import { userFixture } from '../../fixtures/user';

jest.mock('@/services/api');
const mockedApi = jest.mocked(api);

describe('Login flow', () => {
  it('authenticates a valid user and routes to the dashboard', async () => {
    mockedApi.login.mockResolvedValue(userFixture);
    const { user } = renderWithProviders(<SignInPage />);

    await user.type(screen.getByLabelText(/e-mail/i), 'matheus.silva@trail.dev');
    await user.type(screen.getByLabelText(/^senha/i), 'super-secret');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(routerMock.push).toHaveBeenCalledWith('/dashboard'));
    expect(mockedApi.login).toHaveBeenCalledWith('matheus.silva@trail.dev', 'super-secret');
    expect(useStore.getState().user).toEqual(userFixture);
  });

  it('blocks submission and shows an error for an invalid email', async () => {
    const { user } = renderWithProviders(<SignInPage />);

    await user.type(screen.getByLabelText(/e-mail/i), 'not-an-email');
    await user.type(screen.getByLabelText(/^senha/i), 'whatever');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('E-mail inválido.')).toBeInTheDocument();
    expect(mockedApi.login).not.toHaveBeenCalled();
    expect(routerMock.push).not.toHaveBeenCalled();
  });

  it('surfaces an error message when the credentials are rejected', async () => {
    mockedApi.login.mockRejectedValue(new Error('invalid'));
    const { user } = renderWithProviders(<SignInPage />);

    await user.type(screen.getByLabelText(/e-mail/i), 'matheus.silva@trail.dev');
    await user.type(screen.getByLabelText(/^senha/i), 'wrong-password');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('E-mail ou senha inválidos.')).toBeInTheDocument();
    expect(routerMock.push).not.toHaveBeenCalled();
  });
});
