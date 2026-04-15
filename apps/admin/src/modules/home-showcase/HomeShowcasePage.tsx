import { useEffect, useMemo, useState } from "react";
import type { HomeShowcaseSlotConfig } from "@repo/types";
import {
  formatRequestFailureMessage,
  resolveUploadUrl,
  type HomeShowcaseSection,
} from "@repo/api";
import { Button, Card } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { useT } from "../../i18n";
import {
  useAdminHomeShowcaseQuery,
  useAdminHomeShowcaseSave,
  useAdminHomeShowcaseUploadImage,
} from "../../hooks/admin-home-showcase";
import { useAdminProductList } from "../../hooks/admin-products";
import { adminInputClass } from "../../lib/formFieldStyles";

type SlotRow = HomeShowcaseSlotConfig;

function emptySlot(): SlotRow {
  return { productId: "", customImage: null };
}

/** Product picks only (order + empties). Used to tell if the table matches the last saved server list. */
function slotProductSignature(slots: { productId: string }[]): string {
  return slots.map((s) => (s.productId ?? "").trim()).join("|");
}

function ShowcaseSectionEditor({
  title,
  hint,
  section,
  slots,
  onChange,
  uploadError,
  onClearUploadError,
  onUploadError,
  productOptions,
  uploadBlocked,
}: {
  title: string;
  hint: string;
  section: HomeShowcaseSection;
  slots: SlotRow[];
  onChange: (next: SlotRow[]) => void;
  uploadError: string;
  onClearUploadError: () => void;
  onUploadError: (message: string) => void;
  productOptions: { id: string; label: string }[];
  /** When true, image upload is disabled until the product list is saved (matches server). */
  uploadBlocked: boolean;
}) {
  const t = useT();
  const upload = useAdminHomeShowcaseUploadImage();

  const addRow = () => {
    if (slots.length >= 8) return;
    onChange([...slots, emptySlot()]);
  };

  const removeRow = (i: number) => {
    onChange(slots.filter((_, j) => j !== i));
  };

  const setProductId = (i: number, v: string) => {
    const next = slots.map((s, j) =>
      j === i ? { ...s, productId: v } : s,
    );
    onChange(next);
  };

  return (
    <Card title={title}>
      <p className="mb-4 text-sm text-slate-600">{hint}</p>
      {uploadBlocked ?
        <p
          className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950"
          role="status"
        >
          {t("common.adminHomeShowcaseUploadBlocked")}
        </p>
      : null}
      {uploadError ? (
        <p className="mb-3 text-sm text-red-600" role="alert">
          {uploadError}
        </p>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600">
              <th className="py-2 pr-4 font-medium">#</th>
              <th className="py-2 pr-4 font-medium">
                {t("common.adminHomeShowcaseColProduct")}
              </th>
              <th className="py-2 pr-4 font-medium">
                {t("common.adminHomeShowcaseColImage")}
              </th>
              <th className="py-2 pr-4 font-medium">
                {t("common.adminHomeShowcaseColUpload")}
              </th>
              <th className="py-2 font-medium">
                {t("common.adminHomeShowcaseColRemove")}
              </th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, i) => (
              <tr key={`${section}-${i}`} className="border-t border-slate-100">
                <td className="py-3 pr-4 text-slate-500">{i + 1}</td>
                <td className="py-3 pr-4">
                  <select
                    value={slot.productId}
                    onChange={(e) => setProductId(i, e.target.value)}
                    className={adminInputClass}
                  >
                    <option value="">{t("common.adminHomeShowcasePickProduct")}</option>
                    {productOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 pr-4">
                  {slot.customImage ?
                    <img
                      src={resolveUploadUrl(slot.customImage)}
                      alt=""
                      className="h-16 w-16 rounded-md border border-slate-200 object-cover"
                    />
                  : <span className="text-slate-400">—</span>}
                </td>
                <td className="py-3 pr-4">
                  <label
                    className={`inline-flex text-sm font-medium ${
                      uploadBlocked ?
                        "cursor-not-allowed text-slate-400"
                      : "cursor-pointer text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={upload.isPending || uploadBlocked}
                      onChange={(e) => {
                        onClearUploadError();
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        if (!f) return;
                        upload.mutate(
                          { section, index: i, file: f },
                          {
                            onSuccess: (res) => {
                              const next = slots.map((s, j) =>
                                j === i ?
                                  { ...s, customImage: res.path }
                                : s,
                              );
                              onChange(next);
                            },
                            onError: (err) => {
                              onUploadError(formatRequestFailureMessage(err));
                            },
                          },
                        );
                      }}
                    />
                    {upload.isPending ?
                      t("common.adminHomeShowcaseUploading")
                    : uploadBlocked ?
                      t("common.adminHomeShowcaseUploadLocked")
                    : t("common.adminHomeShowcaseUpload")}
                  </label>
                </td>
                <td className="py-3">
                  <button
                    type="button"
                    className="text-sm font-medium text-red-600 hover:text-red-800"
                    onClick={() => removeRow(i)}
                  >
                    {t("common.adminRemove")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addRow}
          disabled={slots.length >= 8}
        >
          {t("common.adminHomeShowcaseAddSlot")}
        </Button>
      </div>
    </Card>
  );
}

export function HomeShowcasePage() {
  const t = useT();
  const { data: catalog } = useAdminProductList({ page: 1, limit: 300 });
  const productOptions = useMemo(
    () =>
      (catalog?.list ?? []).map((p) => ({
        id: p._id,
        label: `${p.title} — ${p.modelNumber}`,
      })),
    [catalog],
  );

  const { data, isPending, isError, error } = useAdminHomeShowcaseQuery();
  const save = useAdminHomeShowcaseSave();
  const [newArrivals, setNewArrivals] = useState<SlotRow[]>([]);
  const [mostPurchased, setMostPurchased] = useState<SlotRow[]>([]);
  const [saveError, setSaveError] = useState("");
  const [uploadErrNew, setUploadErrNew] = useState("");
  const [uploadErrMost, setUploadErrMost] = useState("");

  useEffect(() => {
    if (!data) return;
    const map = (slots: HomeShowcaseSlotConfig[]) =>
      slots.map((s) => ({
        productId: s.productId,
        customImage: s.customImage,
      }));
    setNewArrivals(
      data.newArrivals.length ? map(data.newArrivals) : [],
    );
    setMostPurchased(
      data.mostPurchased.length ? map(data.mostPurchased) : [],
    );
  }, [data]);

  const handleSave = () => {
    setSaveError("");
    const body = {
      newArrivals: newArrivals
        .filter((s) => s.productId.trim())
        .map((s) => ({
          productId: s.productId.trim(),
          customImage: s.customImage,
        })),
      mostPurchased: mostPurchased
        .filter((s) => s.productId.trim())
        .map((s) => ({
          productId: s.productId.trim(),
          customImage: s.customImage,
        })),
    };
    save.mutate(body, {
      onSuccess: (res) => {
        setNewArrivals(
          res.newArrivals.length ?
            res.newArrivals.map((s) => ({ ...s }))
          : [],
        );
        setMostPurchased(
          res.mostPurchased.length ?
            res.mostPurchased.map((s) => ({ ...s }))
          : [],
        );
      },
      onError: (err) => setSaveError(formatRequestFailureMessage(err)),
    });
  };

  const listError =
    isError && error ? formatRequestFailureMessage(error) : "";

  const serverNewSig = data ?
    slotProductSignature(data.newArrivals ?? [])
  : "";
  const serverMostSig = data ?
    slotProductSignature(data.mostPurchased ?? [])
  : "";
  const newArrivalsUploadBlocked =
    !data || slotProductSignature(newArrivals) !== serverNewSig;
  const mostPurchasedUploadBlocked =
    !data || slotProductSignature(mostPurchased) !== serverMostSig;

  return (
    <AdminPageFrame
      title={t("common.adminPageHomeShowcase")}
      addon={
        <p className="text-sm text-slate-500">
          {t("common.adminHomeShowcaseAddon")}
        </p>
      }
    >
      {isPending && !data ?
        <p className="text-sm text-slate-600">{t("common.adminLoading")}</p>
      : null}
      {listError ?
        <p className="mb-4 text-sm text-red-600" role="alert">
          {listError}
        </p>
      : null}
      {saveError ?
        <p className="mb-4 text-sm text-red-600" role="alert">
          {saveError}
        </p>
      : null}

      <div className="space-y-8">
        <ShowcaseSectionEditor
          title={t("common.adminHomeShowcaseNewArrivals")}
          hint={t("common.adminHomeShowcaseHintNew")}
          section="newArrivals"
          slots={newArrivals}
          onChange={setNewArrivals}
          uploadError={uploadErrNew}
          onClearUploadError={() => setUploadErrNew("")}
          onUploadError={setUploadErrNew}
          productOptions={productOptions}
          uploadBlocked={newArrivalsUploadBlocked}
        />
        <ShowcaseSectionEditor
          title={t("common.adminHomeShowcaseMostPurchased")}
          hint={t("common.adminHomeShowcaseHintMost")}
          section="mostPurchased"
          slots={mostPurchased}
          onChange={setMostPurchased}
          uploadError={uploadErrMost}
          onClearUploadError={() => setUploadErrMost("")}
          onUploadError={setUploadErrMost}
          productOptions={productOptions}
          uploadBlocked={mostPurchasedUploadBlocked}
        />
      </div>

      <p className="mt-8 text-sm text-slate-600">
        {t("common.adminHomeShowcaseFooterSteps")}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="accent"
          size="md"
          disabled={save.isPending}
          onClick={handleSave}
        >
          {save.isPending ?
            t("common.adminHomeShowcaseSaving")
          : t("common.adminHomeShowcaseSave")}
        </Button>
      </div>
    </AdminPageFrame>
  );
}
