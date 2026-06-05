import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { AuthSession } from '@/types/auth';

const ACCESS_TOKEN_KEY = 'trail.accessToken';
const REFRESH_TOKEN_KEY = 'trail.refreshToken';
const USER_NAME_KEY = 'trail.userName';
const USER_ROLE_KEY = 'trail.userRole';

function isWeb() {
  return Platform.OS === 'web';
}

function readWebValue(key: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(key);
}

function writeWebValue(key: string, value: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, value);
}

function deleteWebValue(key: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(key);
}

export async function readStoredSession(): Promise<AuthSession | null> {
  const [accessToken, refreshToken, name, role] = isWeb()
    ? [
        readWebValue(ACCESS_TOKEN_KEY),
        readWebValue(REFRESH_TOKEN_KEY),
        readWebValue(USER_NAME_KEY),
        readWebValue(USER_ROLE_KEY),
      ]
    : await Promise.all([
        SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.getItemAsync(USER_NAME_KEY),
        SecureStore.getItemAsync(USER_ROLE_KEY),
      ]);

  if (!accessToken || !refreshToken || !name || !role) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    user: {
      name,
      role,
    },
  };
}

export async function persistSession(session: AuthSession): Promise<void> {
  if (isWeb()) {
    writeWebValue(ACCESS_TOKEN_KEY, session.accessToken);
    writeWebValue(REFRESH_TOKEN_KEY, session.refreshToken);
    writeWebValue(USER_NAME_KEY, session.user.name);
    writeWebValue(USER_ROLE_KEY, session.user.role);
    return;
  }

  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, session.accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, session.refreshToken),
    SecureStore.setItemAsync(USER_NAME_KEY, session.user.name),
    SecureStore.setItemAsync(USER_ROLE_KEY, session.user.role),
  ]);
}

export async function clearStoredSession(): Promise<void> {
  if (isWeb()) {
    deleteWebValue(ACCESS_TOKEN_KEY);
    deleteWebValue(REFRESH_TOKEN_KEY);
    deleteWebValue(USER_NAME_KEY);
    deleteWebValue(USER_ROLE_KEY);
    return;
  }

  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_NAME_KEY),
    SecureStore.deleteItemAsync(USER_ROLE_KEY),
  ]);
}