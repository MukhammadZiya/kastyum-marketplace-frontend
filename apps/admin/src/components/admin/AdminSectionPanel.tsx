import {
  SECTION_DESCRIPTIONS,
  type AdminSection,
} from "../../constants/adminNavigation";

type Props = {
  activeSection: AdminSection;
};

export function AdminSectionPanel({ activeSection }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8">
      <h3 className="text-2xl font-bold">{activeSection}</h3>
      <p className="mt-3 max-w-3xl text-slate-600">
        {SECTION_DESCRIPTIONS[activeSection]}
      </p>
      <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
        This is a minimal scaffold for the <b>{activeSection}</b> module. We
        can wire each section to backend APIs next.
      </div>
    </section>
  );
}

