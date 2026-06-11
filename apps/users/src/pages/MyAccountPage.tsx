import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  CreditCard,
  LogOut,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Breadcrumb from "../components/Common/Breadcrumb";
import { useMyOrders } from "../hooks/orders";
import { usePreparePayment } from "../hooks/payments";
import { useMemberMe, useMemberUpdate } from "../hooks/members";
import { getAuthToken } from "@repo/api";
import { useT } from "../i18n";
import { clearMarketplaceSession } from "../user-auth";

const tabs = ["Profile", "Address", "Orders", "Security"] as const;

const tabIcons = {
  Profile: UserRound,
  Address: MapPin,
  Orders: ClipboardList,
  Security: ShieldCheck,
} as const;

function accountTabLabel(tab: (typeof tabs)[number], t: ReturnType<typeof useT>) {
  switch (tab) {
    case "Profile":
      return t("accountTabProfile");
    case "Address":
      return t("accountTabAddress");
    case "Orders":
      return t("accountTabOrders");
    case "Security":
      return t("accountTabSecurity");
  }
}

function PayNowButton({ orderId }: { orderId: string }) {
  const t = useT();
  const preparePayment = usePreparePayment();
  const [error, setError] = useState("");

  return (
    <div className="mt-3">
      {error ? (
        <p className="mb-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        disabled={preparePayment.isPending}
        onClick={() => {
          setError("");
          preparePayment.mutate(orderId, {
            onSuccess: (res) => {
              window.location.href = res.octo_pay_url;
            },
            onError: (err) => {
              setError(err instanceof Error ? err.message : "Payment initialization failed.");
            },
          });
        }}
        className="rounded-xl bg-[#E11D48] px-4 py-2 text-sm font-black text-white transition hover:bg-[#BE123C] disabled:opacity-60"
      >
        {preparePayment.isPending ? `${t("payNow")}…` : t("payNow")}
      </button>
    </div>
  );
}

function OrdersPanel() {
  const t = useT();
  const signedIn = !!getAuthToken();
  const { data, isPending, isError, error } = useMyOrders({
    page: 1,
    limit: 20,
  });

  if (!signedIn) {
    return (
      <p className="text-neutral-700">
        <Link to="/signin" className="font-black text-[#BE123C]">
          {t("common.signIn")}
        </Link>{" "}
        to see your orders.
      </p>
    );
  }

  if (isPending) {
    return <p className="text-neutral-600">Loading orders…</p>;
  }

  if (isError) {
    return (
      <p className="text-red-600" role="alert">
        {error instanceof Error ? error.message : "Could not load orders."}
      </p>
    );
  }

  if (!data?.list.length) {
    return <p className="text-neutral-700">You have no orders yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {data.list.map((o) => (
        <li key={o._id} className="rounded-2xl border border-neutral-200 bg-[#FAFAFA] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-neutral-900">{o.status}</span>
            <span className="font-semibold text-neutral-900">
              ${o.totalAmount.toFixed(2)}
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-600">Seller: {o.sellerId.nick}</p>
          <p className="mt-1 text-xs text-neutral-500">
            {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
          </p>
          <ul className="mt-3 space-y-1 border-t border-neutral-100 pt-3 text-sm text-neutral-700">
            {o.items.map((line, idx) => (
              <li key={`${o._id}-${line.productId}-${idx}`}>
                {line.productTitle}
                {line.size || line.color ?
                  <span className="text-neutral-500">
                    {" "}
                    ({[line.size, line.color].filter(Boolean).join(", ")})
                  </span>
                : null}{" "}
                × {line.quantity} — ${line.price.toFixed(2)}
              </li>
            ))}
          </ul>
          {o.paymentStatus !== "PAID" ? <PayNowButton orderId={o._id} /> : null}
        </li>
      ))}
    </ul>
  );
}

function ProfilePanel() {
  const t = useT();
  const { data: me, isPending, isError } = useMemberMe();
  const update = useMemberUpdate();

  const [nick, setNick] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  useEffect(() => {
    if (!me) return;
    setNick(me.nick ?? "");
    setPhone(me.phone ?? "");
  }, [me]);

  if (!getAuthToken()) {
    return (
      <p className="text-neutral-700">
        <Link to="/signin" className="font-black text-[#BE123C]">
          Sign in
        </Link>{" "}
        {t("common.profileSignInToEdit")}
      </p>
    );
  }

  if (isPending) {
    return <p className="text-neutral-600">{t("common.loading")}</p>;
  }

  if (isError || !me) {
    return <p className="text-red-600">{t("common.sessionCouldNotLoad")}</p>;
  }

  const hasChanges =
    nick.trim() !== (me.nick ?? "").trim() ||
    phone.trim() !== (me.phone ?? "").trim() ||
    password.length >= 6;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black tracking-tight text-neutral-950">
        {t("accountTabProfile")}
      </h2>

      <form
        className="max-w-lg space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setMessage(null);
          const body: {
            nick?: string;
            phone?: string;
            password?: string;
          } = {};
          if (nick.trim()) body.nick = nick.trim();
          if (phone.trim()) body.phone = phone.trim();
          if (password.length >= 6) body.password = password;

          update.mutate(
            { body },
            {
              onSuccess: () => {
                setPassword("");
                setMessage({ type: "ok", text: t("common.profileUpdated") });
              },
              onError: (err) => {
                setMessage({
                  type: "err",
                  text: err instanceof Error ? err.message : "Update failed",
                });
              },
            },
          );
        }}
      >
        {message ? (
          <p
            className={message.type === "ok" ? "text-green-700" : "text-red-600"}
            role="status"
          >
            {message.text}
          </p>
        ) : null}

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">
            {t("common.email")}
          </label>
          <input
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-3 font-semibold text-neutral-600"
            readOnly
            value={me.email}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">
            {t("common.profileNickLabel")}
          </label>
          <input
            className="w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">
            {t("common.profilePhoneLabel")}
          </label>
          <input
            className="w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">
            {t("common.profilePasswordHint")}
          </label>
          <input
            type="password"
            className="w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={update.isPending || !hasChanges}
          className="rounded-2xl bg-[#E11D48] px-6 py-3 font-black text-white shadow-[0_18px_40px_-22px_rgba(225,29,72,0.7)] transition hover:-translate-y-px hover:bg-[#BE123C] disabled:translate-y-0 disabled:opacity-60"
        >
          {update.isPending ? t("common.profileSaving") : t("common.profileSave")}
        </button>
      </form>
    </div>
  );
}

export function MyAccountPage() {
  const t = useT();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useMemberMe();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Profile");
  const memberSessionActive = Boolean(getAuthToken());
  const displayName = me?.nick?.trim() || me?.email || t("common.myAccount");

  return (
    <>
      <Breadcrumb title={t("myAccountBreadcrumb")} pages={["my account"]} />
      <section className="bg-white py-8 sm:py-12">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:px-0">
          <div className="min-h-[520px] rounded-[2px] bg-white p-0 sm:p-2">
            {activeTab === "Profile" && <ProfilePanel />}
            {activeTab === "Address" && (
              <div className="rounded-xl bg-white p-6 shadow-[0_24px_80px_-70px_rgba(15,23,42,0.75)]">
                <p className="text-neutral-700">{t("accountAddressPlaceholder")}</p>
              </div>
            )}
            {activeTab === "Orders" && (
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tight text-neutral-950">{t("accountYourOrders")}</h2>
                <OrdersPanel />
              </div>
            )}
            {activeTab === "Security" && (
              <div className="rounded-xl bg-white p-6 shadow-[0_24px_80px_-70px_rgba(15,23,42,0.75)]">
                <p className="text-neutral-700">{t("accountSecurityPlaceholder")}</p>
              </div>
            )}
          </div>

          <aside className="h-fit bg-white p-6 shadow-[0_28px_90px_-60px_rgba(15,23,42,0.55)]">
            <div className="flex flex-col items-center border-b border-neutral-100 pb-7 text-center">
              <span className="flex h-32 w-32 items-center justify-center rounded-full border-[8px] border-[#FFE4EA] bg-neutral-100 text-neutral-400">
                <UserRound className="h-16 w-16" strokeWidth={1.6} />
              </span>
              <p className="mt-4 max-w-[220px] text-sm font-black leading-5 text-[#BE123C]">
                {displayName}
              </p>
            </div>

            <div className="space-y-1 pt-4">
              <Link
                to="/cart"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-black text-neutral-800 transition hover:bg-[#FFF1F2] hover:text-[#BE123C]"
              >
                <CreditCard className="h-5 w-5" strokeWidth={2.1} />
                {t("common.cart")}
              </Link>
              {tabs.map((tab) => (
                <AccountTabButton
                  key={tab}
                  tab={tab}
                  active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  label={accountTabLabel(tab, t)}
                />
              ))}
              {memberSessionActive ?
                <button
                  type="button"
                  onClick={() => {
                    clearMarketplaceSession(queryClient);
                    navigate("/", { replace: true });
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-black text-neutral-800 transition hover:bg-[#FFF1F2] hover:text-[#BE123C]"
                >
                  <LogOut className="h-5 w-5" strokeWidth={2.1} />
                  {t("common.logOut")}
                </button>
              : null}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function AccountTabButton({
  tab,
  active,
  onClick,
  label,
}: {
  tab: (typeof tabs)[number];
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  const Icon = tabIcons[tab];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-black transition ${
        active
          ? "bg-[#FFF1F2] text-[#BE123C]"
          : "text-neutral-800 hover:bg-[#FFF1F2] hover:text-[#BE123C]"
      }`}
    >
      <Icon className="h-5 w-5" strokeWidth={2.1} />
      {label}
    </button>
  );
}
