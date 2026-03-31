import { Button } from "@repo/ui";

export type QuickAction = {
  id: string;
  label: string;
  onClick: () => void;
};

type Props = {
  actions: readonly QuickAction[];
};

export function QuickActions({ actions }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((a) => (
        <Button
          key={a.id}
          type="button"
          variant="accent"
          size="md"
          onClick={a.onClick}
        >
          {a.label}
        </Button>
      ))}
    </div>
  );
}
