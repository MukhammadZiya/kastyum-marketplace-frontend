import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { getAllAttributes } from "@repo/api";
import { Button } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import {
  adminAttributesBundleQueryKey,
  useAdminAttributeCreate,
  useAdminAttributeDelete,
} from "../../hooks/admin-attributes";
import { useT } from "../../i18n";

const inputCls =
  "w-full rounded-xl border border-neutral-200 bg-[#FAFAFB] px-4 py-3 text-slate-950 outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/10";

export function CategoriesListPage() {
  const t = useT();
  const [newName, setNewName] = useState("");
  const [addError, setAddError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: bundle, isPending, isError } = useQuery({
    queryKey: adminAttributesBundleQueryKey,
    queryFn: () => getAllAttributes(),
    staleTime: 30_000,
  });

  const categories = bundle?.category ?? [];

  const create = useAdminAttributeCreate();
  const del = useAdminAttributeDelete();

  function handleAdd() {
    const name = newName.trim();
    if (!name) { setAddError(t("common.adminCategoryNameRequired")); return; }
    setAddError("");
    create.mutate(
      { kind: "category", body: { name } },
      {
        onSuccess: () => setNewName(""),
        onError: () => setAddError(t("common.adminCategoryAddError")),
      },
    );
  }

  function handleDelete(id: string) {
    setDeleteId(id);
    del.mutate(
      { kind: "category", id },
      { onSettled: () => setDeleteId(null) },
    );
  }

  return (
    <AdminPageFrame
      title={t("common.adminCategoriesTitle")}
      addon={<p className="text-sm text-slate-500">{t("common.adminCategoriesAddon")}</p>}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Add form */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_8px_32px_-8px_rgba(15,23,42,0.12)]">
          <h2 className="mb-1 text-base font-black text-slate-950">
            {t("common.adminCategoryAddTitle")}
          </h2>
          <p className="mb-4 text-sm text-slate-500">
            {t("common.adminCategoryAddDesc")}
          </p>
          <label className="mb-1.5 block text-sm font-black text-slate-800">
            {t("common.adminCategoryName")}
          </label>
          <input
            className={inputCls}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
            placeholder={t("common.adminCategoryNamePh")}
          />
          {addError && (
            <p className="mt-2 text-sm font-semibold text-red-600">{addError}</p>
          )}
          <Button
            type="button"
            variant="primary"
            size="md"
            className="mt-3 !border-[#E11D48] !bg-[#E11D48] hover:!bg-[#BE123C]"
            onClick={handleAdd}
            disabled={create.isPending || !newName.trim()}
          >
            {create.isPending ? t("common.adminCategoryAdding") : t("common.adminCategoryAdd")}
          </Button>
        </div>

        {/* Category list */}
        <div className="rounded-3xl border border-neutral-200 bg-white shadow-[0_8px_32px_-8px_rgba(15,23,42,0.12)] overflow-hidden">
          <div className="border-b border-neutral-100 px-5 py-4">
            <h2 className="text-base font-black text-slate-950">
              {t("common.adminCategoryListTitle")}
              <span className="ml-2 rounded-full bg-[#FFF1F2] px-2 py-0.5 text-xs font-black text-[#BE123C]">
                {categories.length}
              </span>
            </h2>
          </div>
          {isPending ? (
            <p className="px-5 py-6 text-sm text-slate-500">{t("common.adminLoading")}</p>
          ) : isError ? (
            <p className="px-5 py-6 text-sm font-semibold text-red-600">{t("common.adminCategoryLoadError")}</p>
          ) : categories.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-400">{t("common.adminCategoryEmpty")}</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {categories.map((c) => (
                <li key={c._id} className="flex items-center justify-between gap-4 px-5 py-3">
                  <span className="font-semibold text-slate-900">{c.name}</span>
                  <button
                    type="button"
                    disabled={del.isPending && deleteId === c._id}
                    onClick={() => handleDelete(c._id)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    aria-label={t("common.adminCategoryDelete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminPageFrame>
  );
}
