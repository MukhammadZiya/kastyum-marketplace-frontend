import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  CreditCard,
  KeyRound,
  LogOut,
  MapPin,
  UserRound,
} from "lucide-react";
import Breadcrumb from "../components/Common/Breadcrumb";
import { useMyOrders } from "../hooks/orders";
import { usePreparePayment } from "../hooks/payments";
import { useMemberMe, useMemberUpdate } from "../hooks/members";
import { getAuthToken } from "@repo/api";
import { useT } from "../i18n";
import { clearMarketplaceSession } from "../user-auth";

const tabs = ["Profile", "Address", "Orders", "Password"] as const;

const tabIcons = {
  Profile: UserRound,
  Address: MapPin,
  Orders: ClipboardList,
  Password: KeyRound,
} as const;

function accountTabLabel(tab: (typeof tabs)[number], t: ReturnType<typeof useT>) {
  switch (tab) {
    case "Profile":
      return t("accountTabProfile");
    case "Address":
      return t("accountTabAddress");
    case "Orders":
      return t("accountTabOrders");
    case "Password":
      return t("accountChangePassword");
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
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!me || initialized.current) return;
    setNick(me.nick ?? "");
    setPhone(me.phone ?? "");
    initialized.current = true;
  }, [me]);

  if (!getAuthToken()) {
    return (
      <p className="text-neutral-700">
        <Link to="/signin" className="font-black text-[#BE123C]">
          {t("common.signIn")}
        </Link>{" "}
        {t("common.profileSignInToEdit")}
      </p>
    );
  }

  if (isPending) return <p className="text-neutral-600">{t("common.loading")}</p>;
  if (isError || !me) return <p className="text-red-600">{t("common.sessionCouldNotLoad")}</p>;

  const inputClass = "w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white";
  const hasProfileChanges =
    nick.trim() !== (me.nick ?? "").trim() ||
    phone.trim() !== (me.phone ?? "").trim();

  return (
    <div className="max-w-lg">
      <h2 className="mb-6 text-2xl font-black tracking-tight text-neutral-950">
        {t("accountTabProfile")}
      </h2>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setMessage(null);
          const body: { nick?: string; phone?: string } = {};
          if (nick.trim()) body.nick = nick.trim();
          if (phone.trim()) body.phone = phone.trim();
          update.mutate({ body }, {
            onSuccess: () => setMessage({ type: "ok", text: t("common.profileUpdated") }),
            onError: (err) => setMessage({ type: "err", text: err instanceof Error ? err.message : "Update failed" }),
          });
        }}
      >
        {message ? (
          <p className={message.type === "ok" ? "text-green-700" : "text-red-600"} role="status">
            {message.text}
          </p>
        ) : null}
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">{t("common.email")}</label>
          <input className="w-full rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-3 font-semibold text-neutral-600" readOnly value={me.email} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">{t("common.profileNickLabel")}</label>
          <input className={inputClass} value={nick} onChange={(e) => setNick(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">{t("common.profilePhoneLabel")}</label>
          <input type="tel" placeholder="+998 90 123 45 67" className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <button
          type="submit"
          disabled={update.isPending || !hasProfileChanges}
          className="rounded-2xl bg-[#E11D48] px-6 py-3 font-black text-white shadow-[0_18px_40px_-22px_rgba(225,29,72,0.7)] transition hover:-translate-y-px hover:bg-[#BE123C] disabled:translate-y-0 disabled:opacity-60"
        >
          {update.isPending ? t("common.profileSaving") : t("common.profileSave")}
        </button>
      </form>
    </div>
  );
}

function PasswordPanel() {
  const t = useT();
  const { data: me, isPending, isError } = useMemberMe();
  const update = useMemberUpdate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMessage, setPwMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  if (!getAuthToken()) return null;
  if (isPending) return <p className="text-neutral-600">{t("common.loading")}</p>;
  if (isError || !me) return <p className="text-red-600">{t("common.sessionCouldNotLoad")}</p>;

  const inputClass = "w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white";

  const passwordsTyped = newPassword.length > 0 && confirmPassword.length > 0;
  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit = !update.isPending && currentPassword.length > 0 && newPassword.length >= 6 && passwordsMatch;

  return (
    <div className="max-w-lg">
      <h2 className="mb-6 text-2xl font-black tracking-tight text-neutral-950">
        {t("accountChangePassword")}
      </h2>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setPwMessage(null);
          update.mutate(
            { body: { password: newPassword } },
            {
              onSuccess: () => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setPwMessage({ type: "ok", text: t("accountPasswordChanged") });
              },
              onError: (err) => {
                const msg = err instanceof Error ? err.message : "Update failed";
                const isWrongPassword =
                  msg.toLowerCase().includes("password") ||
                  msg.toLowerCase().includes("incorrect") ||
                  msg.toLowerCase().includes("unauthorized") ||
                  msg.includes("401");
                setPwMessage({
                  type: "err",
                  text: isWrongPassword ? t("accountCurrentPasswordWrong") : msg,
                });
              },
            },
          );
        }}
      >
        {pwMessage ? (
          <p className={pwMessage.type === "ok" ? "text-green-700" : "text-red-600"} role="status">
            {pwMessage.text}
          </p>
        ) : null}

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">{t("accountCurrentPassword")}</label>
          <input
            type="password"
            className={inputClass}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">{t("accountNewPassword")}</label>
          <input
            type="password"
            className={inputClass}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
          />
          {newPassword.length > 0 && newPassword.length < 6 && (
            <p className="mt-1 text-xs text-amber-600">{t("signUpPasswordPlaceholder")}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">{t("signUpConfirmPassword")}</label>
          <input
            type="password"
            className={`${inputClass} ${passwordsTyped ? (passwordsMatch ? "border-green-400 focus:border-green-500" : "border-red-400 focus:border-red-500") : ""}`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          {passwordsTyped && !passwordsMatch && (
            <p className="mt-1 text-xs text-red-600">{t("signUpPasswordMismatch")}</p>
          )}
          {passwordsTyped && passwordsMatch && (
            <p className="mt-1 text-xs text-green-600">✓ {t("accountPasswordsMatch")}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-2xl bg-[#E11D48] px-6 py-3 font-black text-white shadow-[0_18px_40px_-22px_rgba(225,29,72,0.7)] transition hover:-translate-y-px hover:bg-[#BE123C] disabled:translate-y-0 disabled:opacity-60"
        >
          {update.isPending ? t("common.profileSaving") : t("accountChangePassword")}
        </button>
      </form>
    </div>
  );
}

const ADDRESS_KEY = "iberry_user_addresses";

function loadAddresses(): string[] {
  try {
    return JSON.parse(localStorage.getItem(ADDRESS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function AddressPanel() {
  const t = useT();
  const { data: me, isPending, isError } = useMemberMe();

  const [addresses, setAddresses] = useState<string[]>(loadAddresses);
  const [input, setInput] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  if (!getAuthToken()) {
    return (
      <p className="text-neutral-700">
        <Link to="/signin" className="font-black text-[#BE123C]">
          {t("common.signIn")}
        </Link>{" "}
        {t("common.profileSignInToEdit")}
      </p>
    );
  }

  if (isPending) return <p className="text-neutral-600">{t("common.loading")}</p>;
  if (isError || !me) return <p className="text-red-600">{t("common.sessionCouldNotLoad")}</p>;

  function save(updated: string[]) {
    setAddresses(updated);
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(updated));
  }

  function addAddress(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || addresses.includes(trimmed)) return;
    save([...addresses, trimmed]);
    setInput("");
  }

  function removeAddress(idx: number) {
    save(addresses.filter((_, i) => i !== idx));
    if (editingIdx === idx) setEditingIdx(null);
  }

  function startEdit(idx: number) {
    setEditingIdx(idx);
    setEditValue(addresses[idx]);
  }

  function saveEdit(idx: number) {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    const updated = [...addresses];
    updated[idx] = trimmed;
    save(updated);
    setEditingIdx(null);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black tracking-tight text-neutral-950">
        {t("accountTabAddress")}
      </h2>

      {addresses.length > 0 && (
        <ul className="max-w-lg space-y-3">
          {addresses.map((addr, idx) => (
            <li
              key={idx}
              className="rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3"
            >
              {editingIdx === idx ? (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    autoFocus
                    className="w-full rounded-xl border border-[#E11D48] bg-white px-3 py-2 text-sm font-semibold outline-none resize-none"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(idx)}
                      className="rounded-xl bg-[#E11D48] px-4 py-1.5 text-xs font-black text-white hover:bg-[#BE123C] transition"
                    >
                      {t("common.profileSave")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIdx(null)}
                      className="rounded-xl border border-neutral-200 px-4 py-1.5 text-xs font-black text-neutral-600 hover:bg-neutral-100 transition"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E11D48]" strokeWidth={2.2} />
                    <span className="text-sm font-semibold text-neutral-800">{addr}</span>
                  </div>
                  <div className="flex shrink-0 gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(idx)}
                      className="text-xs font-black text-neutral-400 hover:text-[#E11D48] transition"
                    >
                      {t("edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAddress(idx)}
                      className="text-xs font-black text-neutral-400 hover:text-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <form className="max-w-lg space-y-4" onSubmit={addAddress}>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">
            {t("accountAddressLabel")}
          </label>
          <textarea
            rows={2}
            placeholder={t("accountAddressPlaceholder")}
            className="w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim()}
          className="rounded-2xl bg-[#E11D48] px-6 py-3 font-black text-white shadow-[0_18px_40px_-22px_rgba(225,29,72,0.7)] transition hover:-translate-y-px hover:bg-[#BE123C] disabled:translate-y-0 disabled:opacity-60"
        >
          {t("accountAddressAdd")}
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
            {activeTab === "Address" && <AddressPanel />}
            {activeTab === "Orders" && (
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tight text-neutral-950">{t("accountYourOrders")}</h2>
                <OrdersPanel />
              </div>
            )}
            {activeTab === "Password" && <PasswordPanel />}
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
