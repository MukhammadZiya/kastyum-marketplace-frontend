import { API_BASE_URL } from "./client";

/**
 * API stores paths like `uploads/members/<id>.webp` or `uploads/products/<id>.webp`.
 * Static files are served at `{API}/uploads/...`.
 */
export function resolveUploadUrl(
  storedPath: string | undefined | null,
): string {
  if (storedPath == null) return "";
  const s = String(storedPath).trim();
  if (s === "") return "";
  if (/^https?:\/\//i.test(s)) return s;
  const path = s.replace(/^\/+/, "");
  return `${API_BASE_URL}/${path}`;
}
