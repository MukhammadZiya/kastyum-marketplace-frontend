import type { NotificationType } from "../enums";
import type { Member } from "./member";

export type Notification = {
  _id: string;
  receiverId: string;
  message: string;
  type: NotificationType;
  targetId?: string;
  readAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

/** `GET /admin/notification/list` — `receiverId` is populated as a member document. */
export type NotificationAdminListItem = Omit<Notification, "receiverId"> & {
  receiverId: Member;
};
