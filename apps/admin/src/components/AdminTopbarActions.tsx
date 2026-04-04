import { Badge, Button } from "@repo/ui";
import { useT } from "../i18n";

type Props = {
  roleLabelKey?: string;
  onLogout: () => void;
};

export function AdminTopbarActions({
  roleLabelKey = "common.adminRoleSuperadmin",
  onLogout,
}: Props) {
  const t = useT();
  return (
    <>
      <Badge variant="accent">{t(roleLabelKey)}</Badge>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-slate-600 hover:text-slate-900"
        onClick={onLogout}
      >
        {t("common.adminLogOut")}
      </Button>
    </>
  );
}
