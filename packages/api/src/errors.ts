import { isAxiosError } from "axios";
import type { ApiErrorBody } from "@repo/types";

export type HttpError = Error & {
  status?: number;
  apiError?: ApiErrorBody;
};

export function parseApiError(data: unknown): ApiErrorBody | undefined {
  if (!data || typeof data !== "object") return undefined;
  const o = data as Record<string, unknown>;
  if (!("code" in o) || !("message" in o)) return undefined;
  const code = o.code;
  const message = o.message;
  if (typeof code !== "number" && typeof code !== "string") return undefined;
  if (typeof message === "string") return { code, message };
  if (
    Array.isArray(message) &&
    message.every((m) => typeof m === "string")
  ) {
    return { code, message };
  }
  return undefined;
}

export function apiErrorMessage(body: ApiErrorBody): string {
  return Array.isArray(body.message)
    ? body.message.join(". ")
    : body.message;
}

export function formatRequestFailureMessage(error: unknown): string {
  const http = error as HttpError;
  if (http?.apiError) {
    return apiErrorMessage(http.apiError);
  }
  if (isAxiosError(error)) {
    if (!error.response && error.message === "Network Error") {
      return "Cannot reach the API. Start the backend (e.g. pnpm start:dev in the API repo) and set VITE_API_BASE_URL in the frontend .env to that server (default http://localhost:3000).";
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Request failed.";
}
