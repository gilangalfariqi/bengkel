import { apiFetch } from "./httpClient";
import type { ApiResponse } from "@/domain/entities/api";
import type { AuthUser } from "@/domain/entities/auth";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

export async function register(payload: RegisterPayload): Promise<ApiResponse<{ user: AuthUser; access_token: string }>> {
  return apiFetch<{ user: AuthUser; access_token: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: LoginPayload): Promise<ApiResponse<LoginResponse>> {
  return apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function me(token?: string): Promise<ApiResponse<AuthUser>> {
  return apiFetch<AuthUser>("/api/auth/me", {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function logout(token?: string): Promise<ApiResponse<null>> {
  return apiFetch<null>("/api/auth/logout", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
