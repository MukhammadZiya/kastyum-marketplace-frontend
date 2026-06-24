import type { OctoPrepareResponse, PaymentStatusResponse } from "@repo/types";
import { apiClient } from "./client";

export async function postOctoPreparePayment(
  params: { orderId: string; phone?: string },
): Promise<OctoPrepareResponse> {
  const { data } = await apiClient.post<OctoPrepareResponse>(
    "/payments/octo/prepare",
    { orderId: params.orderId, ...(params.phone ? { phone: params.phone } : {}) },
  );
  return data;
}

export async function getOctoPaymentStatus(
  orderId: string,
): Promise<PaymentStatusResponse> {
  const { data } = await apiClient.get<PaymentStatusResponse>(
    `/payments/octo/status/${orderId}`,
  );
  return data;
}
