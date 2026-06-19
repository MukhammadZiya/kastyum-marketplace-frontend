import type { OctoPrepareResponse, PaymentStatusResponse } from "@repo/types";
import { apiClient } from "./client";

export async function postOctoPreparePayment(
  orderId: string,
): Promise<OctoPrepareResponse> {
  const { data } = await apiClient.post<OctoPrepareResponse>(
    "/payments/octo/prepare",
    { orderId },
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
