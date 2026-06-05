export type AuthUser = {
  name: string;
  role: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  refreshToken: string;
  role: string;
  name: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};