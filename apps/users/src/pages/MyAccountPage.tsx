import { useState } from "react";
import Breadcrumb from "../components/Common/Breadcrumb";

const tabs = ["Profile", "Address", "Orders", "Security"] as const;

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
            {activeTab === "Orders" && <p className="text-neutral-700">Track your order history and statuses.</p>}
            {activeTab === "Security" && <p className="text-neutral-700">Update password and security settings.</p>}
          </div>
        </div>
      </section>
    </>
  );
}

