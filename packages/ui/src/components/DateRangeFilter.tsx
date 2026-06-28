import { CalendarDays, X } from "lucide-react";

export type DateRange = { from: string; to: string };

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  labelFrom?: string;
  labelTo?: string;
  clearLabel?: string;
  className?: string;
}

export function DateRangeFilter({
  value,
  onChange,
  labelFrom = "From",
  labelTo = "To",
  clearLabel = "Clear",
  className = "",
}: DateRangeFilterProps) {
  const hasFilter = value.from || value.to;

  const inputClass =
    "rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/10";

  return (
    <div className={`flex flex-wrap items-end gap-3 ${className}`}>
      <CalendarDays className="mb-2 h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
      <div>
        <label className="mb-1 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
          {labelFrom}
        </label>
        <input
          type="date"
          className={inputClass}
          value={value.from}
          max={value.to || undefined}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
          {labelTo}
        </label>
        <input
          type="date"
          className={inputClass}
          value={value.to}
          min={value.from || undefined}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
        />
      </div>
      {hasFilter ? (
        <button
          type="button"
          onClick={() => onChange({ from: "", to: "" })}
          className="mb-0.5 flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-600"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          {clearLabel}
        </button>
      ) : null}
    </div>
  );
}
