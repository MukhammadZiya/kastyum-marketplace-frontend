import {
  SELLER_SECTION_DESCRIPTIONS,
  type SellerSection,
} from "../../constants/sellerNavigation";

type Props = {
  activeSection: SellerSection;
};

export function SellerSectionPanel({ activeSection }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8">
      <h3 className="text-2xl font-bold">{activeSection}</h3>
      <p className="mt-3 max-w-3xl text-slate-600">
        {SELLER_SECTION_DESCRIPTIONS[activeSection]}
      </p>
      <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
        This is a minimal scaffold for the <b>{activeSection}</b> module.
        It is ready to connect with backend APIs in the next step.
      </div>
    </section>
  );
}

