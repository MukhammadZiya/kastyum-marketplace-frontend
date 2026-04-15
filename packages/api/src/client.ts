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

export function getAuthToken(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string | null): void {
  if (typeof localStorage === "undefined") {
    if (token) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common.Authorization;
    }
    return;
  }
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    delete apiClient.defaults.headers.common.Authorization;
  }
}

if (typeof localStorage !== "undefined") {
  const stored = localStorage.getItem(AUTH_TOKEN_KEY);
  if (stored) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${stored}`;
  }
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
