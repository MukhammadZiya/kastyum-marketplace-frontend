import { useT } from "../../i18n";

type Props = {
  labelKey: string;
  suffixKey: string;
};

export function SellerFormPlaceholder({ labelKey, suffixKey }: Props) {
  const t = useT();
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-500">
      {t(labelKey)} — {t(suffixKey)}
    </div>
  );
}
