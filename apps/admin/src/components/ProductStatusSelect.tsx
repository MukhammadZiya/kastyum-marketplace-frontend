import type { ProductStatus } from "@repo/types";

const STATUS_OPTIONS: ProductStatus[] = ["ACTIVE", "INACTIVE", "DELETE"];

function statusClass(status: ProductStatus) {
  if (status === "ACTIVE") return "border-[#FFE4EA] bg-[#FFF1F2] text-[#BE123C]";
  if (status === "DELETE") return "border-red-100 bg-red-50 text-red-700";
  return "border-slate-200 bg-slate-100 text-slate-600";
}

type Props = {
  value: ProductStatus;
  disabled?: boolean;
  onChange: (status: ProductStatus) => void;
};

export function ProductStatusSelect({ value, disabled, onChange }: Props) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as ProductStatus)}
      className={`inline-flex min-w-[110px] cursor-pointer rounded-full border px-2.5 py-1 text-xs font-black outline-none transition focus:ring-4 focus:ring-[#E11D48]/10 disabled:cursor-not-allowed disabled:opacity-60 ${statusClass(value)}`}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
