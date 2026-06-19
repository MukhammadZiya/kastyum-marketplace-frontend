import { useQuery } from "@tanstack/react-query";
import type { PaymentStatusResponse } from "@repo/types";
import { getOctoPaymentStatus } from "@repo/api";

const REFETCH_SCHEDULE_MS = [2000, 2000, 3000, 5000, 5000, 8000, 10000];
export const MAX_PAYMENT_STATUS_ATTEMPTS = 24;

export function paymentKeys(orderId: string | undefined) {
  return ["payment", "status", orderId] as const;
}

export function usePaymentStatus(orderId: string | undefined) {
  return useQuery<PaymentStatusResponse>({
    queryKey: paymentKeys(orderId),
    queryFn: () => getOctoPaymentStatus(orderId as string),
    enabled: !!orderId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return REFETCH_SCHEDULE_MS[0];
      if (data.paymentStatus !== "PROCESSING" && data.paymentStatus !== "UNPAID") {
        return false;
      }
      if (query.state.dataUpdateCount >= MAX_PAYMENT_STATUS_ATTEMPTS) return false;

      const step = Math.min(query.state.dataUpdateCount, REFETCH_SCHEDULE_MS.length - 1);
      return REFETCH_SCHEDULE_MS[step];
    },
  });
}
