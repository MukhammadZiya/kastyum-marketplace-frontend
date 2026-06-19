import type { MemberStatus, MemberType } from "../enums";
import type { MemberAuthPayload } from "../entities/member";

export type MemberAuthResponse = {
  member: MemberAuthPayload;
  accessToken: string;
};

export type SellerApplicationResponse = {
  status: Extract<MemberStatus, "PENDING">;
  message: string;
  member: MemberAuthPayload;
};

export type TokenPayload = {
  sub: string;
  email: string;
  type: MemberType;
};

export type PaginatedResult<T> = {
  list: T[];
  total: number;
};

export type ApiErrorBody = {
  code: number | string;
  message: string | string[];
};
