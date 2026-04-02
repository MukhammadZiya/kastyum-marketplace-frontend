import axios, { isAxiosError } from "axios";
import { apiErrorMessage, parseApiError, type HttpError } from "./errors";

export const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

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
