import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { getAuthState, signOut, updateAuthTokens } from '@/store/authStore';

// Blinda a baseURL forçando a plataforma correta e ignorando variáveis de ambiente (evitando cache do Expo)
const baseURL = Platform.OS === 'web' ? 'http://localhost:5108' : 'http://10.0.2.2:5108';

export const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const accessToken = getAuthState().session?.accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getAuthState().session?.refreshToken;

    if (!refreshToken) {
      await signOut();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
      const { token, refreshToken: nextRefreshToken } = response.data as {
        token: string;
        refreshToken: string;
      };

      await updateAuthTokens(token, nextRefreshToken);
      originalRequest.headers.Authorization = `Bearer ${token}`;

      return api(originalRequest);
    } catch (refreshError) {
      await signOut();
      return Promise.reject(refreshError);
    }
  }
);