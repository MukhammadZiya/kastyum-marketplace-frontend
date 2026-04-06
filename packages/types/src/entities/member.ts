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

/**
 * Shape of `member` in login/signup/profile-update responses from
 * `AuthService.generateToken` (password and `image` are not included).
 */
export type MemberAuthPayload = Omit<Member, "image">;
