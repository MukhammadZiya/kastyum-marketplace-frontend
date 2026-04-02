import { useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { useMyOrders } from "../hooks/orders";
import { getAuthToken } from "@repo/api";

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
        <Link to="/signin" className="text-blue-600 font-medium">
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
        <li
          key={o._id}
          className="rounded-lg border border-neutral-200 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-neutral-900">{o.status}</span>
            <span className="font-semibold text-neutral-900">
              ${o.totalAmount.toFixed(2)}
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-600">
            Seller: {o.sellerId.nick}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {o.createdAt
              ? new Date(o.createdAt).toLocaleString()
              : ""}
          </p>
          <ul className="mt-3 space-y-1 border-t border-neutral-100 pt-3 text-sm text-neutral-700">
            {o.items.map((line) => (
              <li key={`${o._id}-${line.productId}`}>
                {line.productTitle} × {line.quantity} — ${line.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export function MyAccountPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Profile");

  return (
    <>
      <Breadcrumb title="My Account" pages={["my account"]} />
      <section className="py-10 bg-neutral-100">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 grid lg:grid-cols-[260px_1fr] gap-8">
          <aside className="bg-white border border-neutral-200 rounded-xl p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-2.5 rounded-md ${activeTab === tab ? "bg-blue-600 text-white" : "hover:bg-neutral-100 text-neutral-700"}`}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>
          </aside>
          <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8">
            {activeTab === "Profile" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-neutral-900">Profile Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <input className="rounded-md border border-neutral-200 bg-neutral-50 py-2.5 px-4" placeholder="First name" />
                  <input className="rounded-md border border-neutral-200 bg-neutral-50 py-2.5 px-4" placeholder="Last name" />
                  <input className="rounded-md border border-neutral-200 bg-neutral-50 py-2.5 px-4 md:col-span-2" placeholder="Email" />
                </div>
              </div>
            )}
            {activeTab === "Address" && <p className="text-neutral-700">Manage your shipping and billing addresses.</p>}
            {activeTab === "Orders" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-neutral-900">Your orders</h2>
                <OrdersPanel />
              </div>
            )}
            {activeTab === "Security" && <p className="text-neutral-700">Update password and security settings.</p>}
          </div>
        </div>
      </section>
    </>
  );
}
