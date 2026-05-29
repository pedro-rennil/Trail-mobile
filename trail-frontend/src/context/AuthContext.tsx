import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { login } from '../services/api';
import { clearToken, getToken, saveToken } from '../services/tokenStorage';

interface AuthContextValue {
  token: string | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getToken()
      .then((storedToken) => setToken(storedToken))
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    const response = await login({ username, password });
    await saveToken(response.token);
    setToken(response.token);
  }, []);

  const signOut = useCallback(async () => {
    await clearToken();
    setToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ token, isLoading, signIn, signOut }),
    [isLoading, signIn, signOut, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
