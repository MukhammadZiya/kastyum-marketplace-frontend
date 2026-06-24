import { useMutation } from "@tanstack/react-query";
import type { OctoPrepareResponse } from "@repo/types";
import { postOctoPreparePayment } from "@repo/api";

export function usePreparePayment() {
  return useMutation<OctoPrepareResponse, Error, { orderId: string; phone?: string }>({
    mutationFn: (params) => postOctoPreparePayment(params),
  });
}
