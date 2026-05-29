import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config/env';
import type { AuthResponse, LoginPayload, Project } from '../types/models';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function buildErrorMessage(status: number): string {
  if (status === 401) return 'Sessão inválida. Faça login novamente.';
  if (status === 403) return 'Acesso negado para este recurso.';
  if (status === 404) return 'Projeto não encontrado.';
  if (status >= 500) return 'Falha no servidor. Tente novamente em instantes.';
  return 'Não foi possível concluir a solicitação.';
}

async function parseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiError(buildErrorMessage(response.status), response.status);
    }

    const data = await parseJson<T>(response);
    if (data === null) {
      throw new ApiError('Resposta da API sem conteúdo.', response.status);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Tempo limite excedido. Verifique sua conexão.');
    }

    throw new ApiError('Falha de conexão com a API.');
  } finally {
    clearTimeout(timeout);
  }
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getProjectById(
  projectId: string,
  token: string,
): Promise<Project> {
  return request<Project>(`/api/projects/${projectId}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
}
