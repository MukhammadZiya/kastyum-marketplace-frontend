import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { useMyOrders } from "../hooks/orders";
import { useMemberMe, useMemberUpdate } from "../hooks/members";
import { getAuthToken } from "@repo/api";
import { useT } from "../i18n";
import { clearMarketplaceSession } from "../user-auth";

const tabs = ["Profile", "Address", "Orders", "Security"] as const;

function OrdersPanel() {
  const signedIn = !!getAuthToken();
  const { data, isPending, isError, error } = useMyOrders({
    page: 1,
    limit: 20,
  });

  if (!signedIn) {
    return (
      <p className="text-neutral-700">
        <Link to="/signin" className="font-medium text-blue-600">
          Sign in
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
        <li key={o._id} className="rounded-lg border border-neutral-200 p-4">
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
        <Link to="/signin" className="font-medium text-blue-600">
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
      <h2 className="text-2xl font-semibold text-neutral-900">Profile</h2>

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
            className="w-full rounded-md border border-neutral-200 bg-neutral-100 py-2.5 px-4 text-neutral-600"
            readOnly
            value={me.email}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">
            {t("common.profileNickLabel")}
          </label>
          <input
            className="w-full rounded-md border border-neutral-200 bg-neutral-50 py-2.5 px-4"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">
            {t("common.profilePhoneLabel")}
          </label>
          <input
            className="w-full rounded-md border border-neutral-200 bg-neutral-50 py-2.5 px-4"
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
            className="w-full rounded-md border border-neutral-200 bg-neutral-50 py-2.5 px-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={update.isPending || !hasChanges}
          className="rounded-lg bg-neutral-900 px-6 py-2.5 text-white hover:bg-blue-600 disabled:opacity-60"
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
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Profile");
  const memberSessionActive = Boolean(getAuthToken());

  return (
    <>
      <Breadcrumb title="My Account" pages={["my account"]} />
      <section className="bg-neutral-100 py-10">
        <div className="mx-auto grid max-w-[1170px] gap-8 px-4 sm:px-8 lg:grid-cols-[260px_1fr] xl:px-0">
          <aside className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`w-full rounded-md px-4 py-2.5 text-left ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {memberSessionActive ?
              <div className="mt-3 border-t border-neutral-200 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    clearMarketplaceSession(queryClient);
                    navigate("/", { replace: true });
                  }}
                  className="w-full rounded-md px-4 py-2.5 text-left text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                >
                  {t("common.logOut")}
                </button>
              </div>
            : null}
          </aside>
          <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
            {activeTab === "Profile" && <ProfilePanel />}
            {activeTab === "Address" && (
              <p className="text-neutral-700">Manage your shipping and billing addresses.</p>
            )}
            {activeTab === "Orders" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-neutral-900">Your orders</h2>
                <OrdersPanel />
              </div>
            )}
            {activeTab === "Security" && (
              <p className="text-neutral-700">Update password and security settings.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
