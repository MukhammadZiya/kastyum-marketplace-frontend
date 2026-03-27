export function AdminTopbar() {
  return (
    <header className="mb-8 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5">
      <div>
        <p className="text-sm text-slate-500">Signed in as</p>
        <h2 className="text-xl font-semibold">superadmin</h2>
      </div>
      <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
        Single-admin mode
      </span>
    </header>
  );
}

