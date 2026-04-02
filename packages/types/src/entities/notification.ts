import type { NotificationType } from "../enums";

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
