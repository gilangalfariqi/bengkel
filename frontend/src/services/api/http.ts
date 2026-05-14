export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

import type { ApiResponse } from "@/types/api";
import { isRecord } from "@/types/api";

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem("bengkel_auth");
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed === 'object' && parsed && ('token' in parsed || 'access_token' in parsed)) {
      const token = (parsed as { token?: unknown; access_token?: unknown }).token ?? (parsed as { token?: unknown; access_token?: unknown }).access_token;
      return typeof token === 'string' ? token : null;
    }
    return null;
  } catch {
    return null;
  }
}

type ApiErrorShape = { message?: unknown; errors?: unknown };

function readApiErrorShape(json: unknown): ApiErrorShape | null {
  if (!isRecord(json)) return null;
  const maybeMessage = (json as { message?: unknown }).message;
  const maybeErrors = (json as { errors?: unknown }).errors;
  return maybeMessage !== undefined || maybeErrors !== undefined ? { message: maybeMessage, errors: maybeErrors } : null;
}

export async function apiFetch<T>(
  path: string,
  options: (RequestInit & { params?: Record<string, string | number | boolean> }) = {},
): Promise<ApiResponse<T>> {
  const url = new URL(API_BASE_URL + path);

  if (options.params) {
    for (const [k, v] of Object.entries(options.params)) {
      url.searchParams.set(k, String(v));
    }
  }

  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const timeoutMs = 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url.toString(), {
      ...options,
      headers,
      // Do NOT include cookies/credentials; this app uses bearer token auth only.
      signal: controller.signal,
    });

    const bodyText = await res.text();
    const json = (() => {
      if (!bodyText) return null;
      try {
        return JSON.parse(bodyText);
      } catch {
        return null;
      }
    })();

    if (!res.ok) {
      console.error(`API Error [${res.status}]:`, {
        url: url.toString(),
        status: res.status,
        statusText: res.statusText,
        response: json ?? bodyText,
      });

      // Centralized auth failure handling for SPA.
      if (res.status === 401) {
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem("bengkel_auth");
          }
        } catch {
          // ignore
        }

        return {
          success: false,
          message: "Unauthenticated.",
          data: null,
          errors: undefined,
        };
      }

      const apiError = readApiErrorShape(json);
      const message =
        typeof apiError?.message === "string" ? apiError.message : res.statusText || "An error occurred";

      return {
        success: false,
        message,
        data: null,
        errors: apiError?.errors,
      };
    }


    // If backend returns empty body, avoid JSON parse issues.
    return (json ?? ({ success: true, message: "OK", data: null } as { success: true; message: string; data: T })) as ApiResponse<T>;
  } catch (error: unknown) {
    const err = error as { name?: string; message?: string } | undefined;
    const isAbort = err?.name === 'AbortError';
    console.error("Fetch Error:", {
      url: url.toString(),
      baseUrl: API_BASE_URL,
      timeoutMs,
      isTimeout: isAbort,
      errorType: err?.name,
      errorMessage: error instanceof Error ? error.message : err?.message ?? String(error),
      thrown: typeof error,
    });

    throw error;
  } finally {
    clearTimeout(timeoutId);
    controller.abort();
  }
}

export const http = {
  get: <T>(path: string, options?: RequestInit) => apiFetch<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(path, { ...options, method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(path, { ...options, method: 'PUT', body: body === undefined ? undefined : JSON.stringify(body) }),
  delete: <T>(path: string, options?: RequestInit) => apiFetch<T>(path, { ...options, method: 'DELETE' }),
};

