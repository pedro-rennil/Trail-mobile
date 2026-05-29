export interface Trail {
  id: number;
  name: string;
  description?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status?: string;
  trail?: Trail;
  technologies?: string[];
}

export interface AuthResponse {
  token: string;
  expiresAt?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}
