import type {
  Member,
  MemberAuthResponse,
  MemberLoginBody,
  MemberSignupBody,
  MemberUpdateBody,
} from "@repo/types";
import { apiClient } from "./client";

export async function postMemberSignup(
  body: MemberSignupBody,
): Promise<MemberAuthResponse> {
  const { data } = await apiClient.post<MemberAuthResponse>(
    "/member/signup",
    body,
  );
  return data;
}

export async function postMemberLogin(
  body: MemberLoginBody,
): Promise<MemberAuthResponse> {
  const { data } = await apiClient.post<MemberAuthResponse>(
    "/member/login",
    body,
  );
  return data;
}

export async function postMemberTelegramLogin(
  body: any, // Using any for now to avoid strict type mismatch if TelegramLoginData is not exported everywhere
): Promise<MemberAuthResponse> {
  const { data } = await apiClient.post<MemberAuthResponse>(
    "/member/telegram-login",
    body,
  );
  return data;
}

export async function getMemberMe(): Promise<Member> {
  const { data } = await apiClient.get<Member>("/member/me");
  return data;
}

function appendIfDefined(fd: FormData, key: string, value: string | undefined) {
  if (value !== undefined && value !== "") {
    fd.append(key, value);
  }
}

/**
 * Update profile. When `profileImage` is set, sends multipart form (field name `image`)
 * so the API can save under `uploads/members/`.
 */
export async function postMemberUpdate(
  body: MemberUpdateBody,
  options?: { profileImage?: File | null },
): Promise<MemberAuthResponse> {
  if (options?.profileImage) {
    const fd = new FormData();
    appendIfDefined(fd, "nick", body.nick);
    appendIfDefined(fd, "phone", body.phone);
    appendIfDefined(fd, "password", body.password);
    fd.append("image", options.profileImage, options.profileImage.name);
    const { data } = await apiClient.post<MemberAuthResponse>(
      "/member/update",
      fd,
    );
    return data;
  }

  const { data } = await apiClient.post<MemberAuthResponse>(
    "/member/update",
    body,
  );
  return data;
}

export async function getMemberDetail(id: string): Promise<Member> {
  const { data } = await apiClient.get<Member>(`/member/detail/${id}`);
  return data;
}
