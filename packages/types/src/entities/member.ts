import type { MemberStatus, MemberType } from "../enums";

export type Member = {
  _id: string;
  nick: string;
  email: string;
  phone?: string;
  image?: string;
  type: MemberType;
  status: MemberStatus;
  createdAt?: string;
  updatedAt?: string;
};
