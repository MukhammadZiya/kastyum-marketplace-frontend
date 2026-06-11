import { useMutation } from "@tanstack/react-query";
import type { OctoPrepareResponse } from "@repo/types";
import { postOctoPreparePayment } from "@repo/api";

export function usePreparePayment() {
  return useMutation<OctoPrepareResponse, Error, string>({
    mutationFn: (orderId: string) => postOctoPreparePayment(orderId),
  });
}
