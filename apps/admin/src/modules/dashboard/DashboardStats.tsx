import { StatCard } from "@repo/ui";

export type DashboardStat = {
  label: string;
  value: string;
  hint?: string;
};

type Props = {
  stats: DashboardStat[];
};

export function DashboardStats({ stats }: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <StatCard
          key={s.label}
          label={s.label}
          value={s.value}
          hint={s.hint}
        />
      ))}
    </div>
  );
}
