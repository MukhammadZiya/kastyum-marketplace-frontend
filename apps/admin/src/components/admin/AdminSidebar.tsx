import { NAV_ITEMS, type AdminSection } from "../../constants/adminNavigation";

type Props = {
  activeSection: AdminSection;
  onSelect: (section: AdminSection) => void;
};

export function AdminSidebar({ activeSection, onSelect }: Props) {
  return (
    <aside className="w-[280px] border-r border-slate-200 bg-white p-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Marketplace
        </p>
        <h1 className="mt-2 text-2xl font-bold">Admin Panel</h1>
      </div>

      <nav className="space-y-2">
        {NAV_ITEMS.map((item) => {
          const active = item === activeSection;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(item)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

