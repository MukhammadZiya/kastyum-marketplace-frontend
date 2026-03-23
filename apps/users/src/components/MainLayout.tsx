import { Navbar } from "@repo/ui";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-0 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
