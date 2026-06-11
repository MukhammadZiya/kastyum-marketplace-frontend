import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { MAX_PAYMENT_STATUS_ATTEMPTS, usePaymentStatus, usePreparePayment } from "../hooks/payments";
import { useT } from "../i18n";

export function PaymentResultPage() {
  const t = useT();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") ?? undefined;

  const { data, isLoading, dataUpdatedAt, refetch, isRefetching } = usePaymentStatus(orderId);
  const preparePayment = usePreparePayment();
  const [retryError, setRetryError] = useState("");
  const [timedOut, setTimedOut] = useState(false);
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!dataUpdatedAt) return;
    attemptsRef.current += 1;
    if (attemptsRef.current >= MAX_PAYMENT_STATUS_ATTEMPTS) {
      setTimedOut(true);
    }
  }, [dataUpdatedAt]);

  const handleRetry = () => {
    if (!orderId) return;
    setRetryError("");
    preparePayment.mutate(orderId, {
      onSuccess: (res) => {
        window.location.href = res.octo_pay_url;
      },
      onError: (err) => {
        setRetryError(err instanceof Error ? err.message : "Payment initialization failed.");
      },
    });
  };

  const handleRefresh = () => {
    setTimedOut(false);
    attemptsRef.current = 0;
    refetch();
  };

  let content: React.ReactNode;

  if (!orderId) {
    content = (
      <>
        <h2 className="mb-3 text-2xl font-black tracking-tight text-neutral-950">{t("paymentFailed")}</h2>
        <Link to="/" className="inline-flex items-center gap-2 rounded-2xl bg-[#E11D48] px-6 py-3.5 font-black text-white shadow-[0_18px_40px_-22px_rgba(225,29,72,0.7)] transition hover:-translate-y-px hover:bg-[#BE123C]">
          {t("common.backToHome")}
        </Link>
      </>
    );
  } else if (data?.paymentStatus === "PAID") {
    content = (
      <>
        <h2 className="mb-3 text-2xl font-black tracking-tight text-neutral-950">{t("paymentSucceeded")}</h2>
        <Link to="/my-account" className="inline-flex items-center gap-2 rounded-2xl bg-[#E11D48] px-6 py-3.5 font-black text-white shadow-[0_18px_40px_-22px_rgba(225,29,72,0.7)] transition hover:-translate-y-px hover:bg-[#BE123C]">
          {t("paymentBackToOrders")}
        </Link>
      </>
    );
  } else if (data?.paymentStatus === "FAILED") {
    content = (
      <>
        <h2 className="mb-3 text-2xl font-black tracking-tight text-neutral-950">{t("paymentFailed")}</h2>
        {retryError ? (
          <p className="mb-3 text-sm text-red-600" role="alert">
            {retryError}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={preparePayment.isPending}
            onClick={handleRetry}
            className="rounded-2xl bg-[#E11D48] px-6 py-3.5 font-black text-white shadow-[0_18px_40px_-22px_rgba(225,29,72,0.7)] transition hover:-translate-y-px hover:bg-[#BE123C] disabled:opacity-60"
          >
            {preparePayment.isPending ? `${t("paymentRetry")}…` : t("paymentRetry")}
          </button>
          <Link to="/my-account" className="font-black text-[#BE123C] hover:underline">
            {t("paymentBackToOrders")}
          </Link>
        </div>
      </>
    );
  } else if (timedOut) {
    content = (
      <>
        <h2 className="mb-3 text-2xl font-black tracking-tight text-neutral-950">{t("paymentTimeout")}</h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={isRefetching}
            onClick={handleRefresh}
            className="rounded-2xl bg-[#E11D48] px-6 py-3.5 font-black text-white shadow-[0_18px_40px_-22px_rgba(225,29,72,0.7)] transition hover:-translate-y-px hover:bg-[#BE123C] disabled:opacity-60"
          >
            {isRefetching ? `${t("paymentRetry")}…` : t("paymentRetry")}
          </button>
          <Link to="/my-account" className="font-black text-[#BE123C] hover:underline">
            {t("paymentBackToOrders")}
          </Link>
        </div>
      </>
    );
  } else {
    content = (
      <>
        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#FECDD3] border-t-[#E11D48]" />
        <h2 className="mb-3 text-2xl font-black tracking-tight text-neutral-950">{t("paymentProcessing")}</h2>
        {isLoading ? null : (
          <Link to="/my-account" className="font-black text-[#BE123C] hover:underline">
            {t("paymentBackToOrders")}
          </Link>
        )}
      </>
    );
  }

  return (
    <>
      <Breadcrumb title={t("paymentResultTitle")} pages={["checkout", "payment"]} />
      <section className="bg-[#F7F7F8] py-8 sm:py-10">
        <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
          <div className="rounded-3xl border border-neutral-200 bg-white px-4 py-20 text-center shadow-[0_22px_80px_-62px_rgba(15,23,42,0.75)]">
            {content}
          </div>
        </div>
      </section>
    </>
  );
}
