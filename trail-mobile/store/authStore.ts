import { useSyncExternalStore } from 'react';

import { clearStoredSession, persistSession, readStoredSession } from '@/lib/authStorage';
import type { AuthSession } from '@/types/auth';

type AuthState = {
  hasHydrated: boolean;
  session: AuthSession | null;
};

type SessionInput = AuthSession;

const listeners = new Set<() => void>();

let currentState: AuthState = {
  hasHydrated: false,
  session: null,
};

function setState(nextState: Partial<AuthState>) {
  currentState = {
    ...currentState,
    ...nextState,
  };
  listeners.forEach((listener) => listener());
}

export function getAuthState() {
  return currentState;
}

export function useAuthStore<T>(selector: (state: AuthState) => T) {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => selector(currentState),
    () => selector(currentState)
  );
}

export async function hydrateAuthSession() {
  const session = await readStoredSession();

  setState({
    hasHydrated: true,
    session,
  });
}

export async function saveAuthSession(session: SessionInput) {
  await persistSession(session);
  setState({
    hasHydrated: true,
    session,
  });
}

export async function updateAuthTokens(accessToken: string, refreshToken: string) {
  if (!currentState.session) {
    return;
  }

  const nextSession: AuthSession = {
    ...currentState.session,
    accessToken,
    refreshToken,
  };

  await persistSession(nextSession);
  setState({ session: nextSession });
}

export async function signOut() {
  await clearStoredSession();
  setState({
    session: null,
  });
}