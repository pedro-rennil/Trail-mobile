import { useSyncExternalStore } from 'react';

import { clearStoredSession, persistSession, readStoredSession } from '@/lib/authStorage';
import type { AuthSession } from '@/types/auth';

type AuthState = {
  hasHydrated: boolean;
  session: AuthSession | null;
};

type SessionInput = Omit<AuthSession, 'user'> & {
  user: Omit<AuthSession['user'], 'id'> & { id?: string };
};

const listeners = new Set<() => void>();

let currentState: AuthState = {
  hasHydrated: false,
  session: null,
};

function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

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

export async function saveAuthSession(sessionInput: SessionInput) {
  let id: string = sessionInput.user.id || '';
  if (!id) {
    const decoded = decodeJwt(sessionInput.accessToken);
    id = decoded?.sub || '';
  }

  const session: AuthSession = {
    accessToken: sessionInput.accessToken,
    refreshToken: sessionInput.refreshToken,
    user: {
      id,
      name: sessionInput.user.name,
      role: sessionInput.user.role,
    },
  };

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