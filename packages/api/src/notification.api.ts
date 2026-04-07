import type {
  Notification,
  NotificationListQuery,
  PaginatedResult,
} from "@repo/types";
import { apiClient } from "./client";

export async function getNotificationList(
  params?: NotificationListQuery,
): Promise<PaginatedResult<Notification>> {
  const { data } = await apiClient.get<PaginatedResult<Notification>>(
    "/notification/list",
    { params },
  );
  return data;
}

export async function postNotificationRead(id: string): Promise<Notification> {
  const { data } = await apiClient.post<Notification>(
    `/notification/read/${id}`,
  );
  return data;
}
