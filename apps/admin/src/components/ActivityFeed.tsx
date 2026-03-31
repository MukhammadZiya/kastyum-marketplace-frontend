export type ActivityFeedItem = {
  id: string;
  title: string;
  time: string;
};

type Props = {
  items: readonly ActivityFeedItem[];
};

export function ActivityFeed({ items }: Props) {
  return (
    <ul className="divide-y divide-slate-100">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
        >
          <p className="text-sm text-slate-700">{item.title}</p>
          <span className="shrink-0 text-xs tabular-nums text-slate-400">
            {item.time}
          </span>
        </li>
      ))}
    </ul>
  );
}
