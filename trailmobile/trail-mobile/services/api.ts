import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';

import { getAuthState, signOut, updateAuthTokens } from '@/store/authStore';

// Blinda a baseURL com o IP do host para permitir conexão da API local em emuladores e dispositivos físicos
const baseURL = 'http://192.168.1.10:5108';

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
    const status = error.response?.status;

    // Se for 401, tenta renovar o token
    if (status === 401 && originalRequest && !originalRequest._retry) {
      const refreshToken = getAuthState().session?.refreshToken;

      if (!refreshToken) {
        await signOut();
        Alert.alert('Sessão Expirada', 'Faça login novamente para continuar.');
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
        Alert.alert('Sessão Expirada', 'Faça login novamente para continuar.');
        return Promise.reject(refreshError);
      }
    }

    // Verifica se a tela solicitou pular o tratamento de erro global
    const skipGlobalError =
      originalRequest?.headers?.['X-Skip-Error-Handler'] === 'true' ||
      originalRequest?.headers?.['X-Skip-Error-Handler'] === true;

    if (!skipGlobalError) {
      if (status === 403) {
        Alert.alert('Acesso Negado', 'Apenas Mentores podem realizar esta ação.');
      } else if (status === 404) {
        Alert.alert('Não Encontrado', 'O item ou aluno solicitado não foi encontrado.');
      } else if (!status || status >= 500 || error.code === 'ECONNABORTED') {
        Alert.alert(
          'Erro de Conexão',
          'O servidor está temporariamente indisponível. Verifique sua conexão ou tente novamente.'
        );
      }
    }

    return Promise.reject(error);
  }
);