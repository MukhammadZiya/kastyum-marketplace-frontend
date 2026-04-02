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

export async function getMemberMe(): Promise<Member> {
  const { data } = await apiClient.get<Member>("/member/me");
  return data;
}

export async function postMemberUpdate(
  body: MemberUpdateBody,
): Promise<MemberAuthResponse> {
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
