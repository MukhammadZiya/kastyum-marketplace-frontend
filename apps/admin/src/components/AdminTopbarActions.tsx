import { Badge, Button } from "@repo/ui";

type Props = {
  roleLabel?: string;
  onLogout: () => void;
};

export function AdminTopbarActions({
  roleLabel = "Superadmin",
  onLogout,
}: Props) {
  return (
    <>
      <Badge variant="accent">{roleLabel}</Badge>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-slate-600 hover:text-slate-900"
        onClick={onLogout}
      >
        Log out
      </Button>
    </>
  );
}
