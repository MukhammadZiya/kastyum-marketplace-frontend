import type { MemberType } from "@repo/types";

/** Business rule: only SELLER accounts may use the seller dashboard. */
export function accountTypeIsSeller(type: MemberType): boolean {
  return type === "SELLER";
}
