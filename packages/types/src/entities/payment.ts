import type { PaymentStatus } from "../enums";

export type OctoPrepareResponse = {
  octo_pay_url: string;
  shop_transaction_id: string;
  status: string;
};

export type PaymentStatusResponse = {
  paymentStatus: PaymentStatus;
  octoStatus?: string;
  orderStatus: string;
};
