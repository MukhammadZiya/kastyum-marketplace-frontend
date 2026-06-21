import axios, { isAxiosError } from "axios";
import { apiErrorMessage, parseApiError, type HttpError } from "./errors";

const AUTH_TOKEN_KEY = "kastyum_auth_token";

const apiBaseURL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

/** Public API origin (no trailing slash). Use with `resolveUploadUrl` for stored paths like `uploads/members/…`. */
export const API_BASE_URL = apiBaseURL;

export const apiClient = axios.create({
  baseURL: apiBaseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }
  return config;
});

function storage(): Storage | null {
  try {
    return typeof localStorage !== "undefined" ? localStorage : null;
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  return storage()?.getItem(AUTH_TOKEN_KEY) ?? null;
}

export function setAuthToken(token: string | null): void {
  const store = storage();
  if (token) {
    store?.setItem(AUTH_TOKEN_KEY, token);
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    store?.removeItem(AUTH_TOKEN_KEY);
    delete apiClient.defaults.headers.common.Authorization;
  }
}

// Restore token on page load
const _stored = storage()?.getItem(AUTH_TOKEN_KEY);
if (_stored) {
  apiClient.defaults.headers.common.Authorization = `Bearer ${_stored}`;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!isAxiosError(error)) return Promise.reject(error);
    const parsed = parseApiError(error.response?.data);
    if (parsed) {
      const err = new Error(apiErrorMessage(parsed)) as HttpError;
      err.status = error.response?.status;
      err.apiError = parsed;
      return Promise.reject(err);
    }
    return Promise.reject(error);
  },
);
