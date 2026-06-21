import type { FormEvent } from "react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type {
  AttributeKind,
  CreateAttributeBody,
  ProductVariantStockLine,
  TargetAudience,
} from "@repo/types";
import { formatRequestFailureMessage, getAllAttributes, getAuthToken } from "@repo/api";
import { Button, Card } from "@repo/ui";
import { AdminPageFrame } from "../../components/AdminPageFrame";
import { ADMIN_PAGE_TITLE_KEYS } from "../../constants/adminNavigation";
import { useAdminMemberList } from "../../hooks/admin-members";
import {
  adminAttributesBundleQueryKey,
  useAdminAttributeCreate,
} from "../../hooks/admin-attributes";
import { useAdminProductCreate } from "../../hooks/admin-products";
import { adminInputClass } from "../../lib/formFieldStyles";
import { useT } from "../../i18n";

const audiences: TargetAudience[] = ["MEN", "WOMEN", "KIDS"];


function toggleInList(list: string[], id: string): string[] {
  if (list.includes(id)) return list.filter((x) => x !== id);
  return [...list, id];
}

export function ProductCreatePage() {
  const t = useT();
  const navigate = useNavigate();
  const hasToken = !!getAuthToken();
  const createProduct = useAdminProductCreate();

  const { data: sellersPage } = useAdminMemberList({
    page: 1,
    limit: 200,
    type: "SELLER",
  });

  const { data: attrBundle } = useQuery({
    queryKey: adminAttributesBundleQueryKey,
    queryFn: () => getAllAttributes(),
  });

  const addAttribute = useAdminAttributeCreate();

  const [sellerId, setSellerId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [stockCount, setStockCount] = useState("1");
  const [audience, setAudience] = useState<TargetAudience>("MEN");
  const [colorIds, setColorIds] = useState<string[]>([]);
  const [sizeIds, setSizeIds] = useState<string[]>([]);
  const [brandId, setBrandId] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [styleId, setStyleId] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [homeShowcaseNewArrivals, setHomeShowcaseNewArrivals] = useState(false);
  const [homeShowcaseMostPurchased, setHomeShowcaseMostPurchased] =
    useState(false);
  /** Per variant row key (`size:color` / `size:` / `:color`) → quantity string */
  const [variantQty, setVariantQty] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [attrQuickError, setAttrQuickError] = useState("");
  const [newSizeName, setNewSizeName] = useState("");
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newStyleName, setNewStyleName] = useState("");

  const sellers = sellersPage?.list ?? [];

  useEffect(() => {
    if (sellers.length === 1 && !sellerId) {
      setSellerId(sellers[0]._id);
    }
  }, [sellers, sellerId]);

  const selectClass = `${adminInputClass} max-w-full`;

  const brandOptions = attrBundle?.brand ?? [];
  const materialOptions = attrBundle?.material ?? [];
  const styleOptions = attrBundle?.style ?? [];
  const colorOptions = attrBundle?.color ?? [];
  const sizeOptions = attrBundle?.size ?? [];

  function runQuickAttributeCreate(
    kind: AttributeKind,
    rawName: string,
    bodyExtra: Partial<CreateAttributeBody> = {},
    onCreated: (id: string) => void,
    clearInputs: () => void,
  ) {
    const name = rawName.trim();
    if (!name) {
      setAttrQuickError(t("common.adminProductQuickAddEmpty"));
      return;
    }
    setAttrQuickError("");
    addAttribute.mutate(
      { kind, body: { name, ...bodyExtra } },
      {
        onSuccess: (entity) => {
          clearInputs();
          onCreated(entity._id);
        },
        onError: (err) => setAttrQuickError(formatRequestFailureMessage(err)),
      },
    );
  }

  const variantRows = useMemo((): Array<{
    key: string;
    sizeId?: string;
    colorId?: string;
  }> => {
    if (sizeIds.length === 0 && colorIds.length === 0) return [];
    if (sizeIds.length > 0 && colorIds.length > 0) {
      return sizeIds.flatMap((sid) =>
        colorIds.map((cid) => ({
          key: `${sid}:${cid}`,
          sizeId: sid,
          colorId: cid,
        })),
      );
    }
    if (sizeIds.length > 0) {
      return sizeIds.map((sid) => ({ key: `${sid}:`, sizeId: sid }));
    }
    return colorIds.map((cid) => ({ key: `:${cid}`, colorId: cid }));
  }, [sizeIds, colorIds]);

  useEffect(() => {
    setVariantQty((prev) => {
      const next: Record<string, string> = {};
      for (const row of variantRows) {
        next[row.key] = prev[row.key] ?? "0";
      }
      return next;
    });
  }, [variantRows]);

  const variantRowLabel = useCallback(
    (row: { sizeId?: string; colorId?: string }) => {
      const sn = row.sizeId ?
        sizeOptions.find((s) => s._id === row.sizeId)?.name
      : undefined;
      const cn = row.colorId ?
        colorOptions.find((c) => c._id === row.colorId)?.name
      : undefined;
      if (sn && cn) return `${sn} · ${cn}`;
      if (sn) return sn;
      if (cn) return cn;
      return row.sizeId ?? row.colorId ?? "";
    },
    [sizeOptions, colorOptions],
  );

  const audienceLabel = useMemo(() => {
    const map: Record<TargetAudience, string> = {
      MEN: t("common.adminProductAudienceMen"),
      WOMEN: t("common.adminProductAudienceWomen"),
      KIDS: t("common.adminProductAudienceKids"),
    };
    return (a: TargetAudience) => map[a];
  }, [t]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!sellerId) {
      setFormError(t("common.adminProductErrorSeller"));
      return;
    }
    if (!title.trim() || !description.trim()) {
      setFormError(t("common.adminProductErrorBasics"));
      return;
    }
    const priceNum = Number(price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      setFormError(t("common.adminProductErrorPrice"));
      return;
    }
    let listNum: number | undefined;
    if (listPrice.trim()) {
      listNum = Number(listPrice);
      if (Number.isNaN(listNum) || listNum < 0) {
        setFormError(t("common.adminProductErrorListPrice"));
        return;
      }
    }
    const stockNum = Number.parseInt(stockCount, 10);
    const usesVariantStock = variantRows.length > 0;
    if (!usesVariantStock && (Number.isNaN(stockNum) || stockNum < 0)) {
      setFormError(t("common.adminProductErrorStock"));
      return;
    }
    let variantStockPayload: ProductVariantStockLine[] | undefined;
    if (usesVariantStock) {
      variantStockPayload = variantRows.map((row) => {
        const q = Number.parseInt(variantQty[row.key] ?? "0", 10);
        return {
          ...(row.sizeId ? { sizeId: row.sizeId } : {}),
          ...(row.colorId ? { colorId: row.colorId } : {}),
          quantity: Number.isNaN(q) || q < 0 ? 0 : q,
        };
      });
    }
    if (imageFiles.length === 0) {
      setFormError(t("common.adminProductErrorImages"));
      return;
    }
    if (imageFiles.length > 5) {
      setFormError(t("common.adminProductErrorImagesMax"));
      return;
    }

    const payload = {
      sellerId,
      title: title.trim(),
      description: description.trim(),
      audience,
      price: priceNum,
      listPrice:
        listNum !== undefined && !Number.isNaN(listNum) && listNum > 0 ?
          listNum
        : undefined,
      stockCount: usesVariantStock ? 0 : stockNum,
      colorIds: colorIds.length ? colorIds : undefined,
      sizeIds: sizeIds.length ? sizeIds : undefined,
      variantStock: variantStockPayload,
      brand: brandId || undefined,
      material: materialId || undefined,
      style: styleId || undefined,
      homeShowcaseNewArrivals: homeShowcaseNewArrivals || undefined,
      homeShowcaseMostPurchased: homeShowcaseMostPurchased || undefined,
    };

    createProduct.mutate(
      { payload, images: imageFiles },
      {
        onSuccess: () => navigate("/products/list"),
        onError: (err) => setFormError(formatRequestFailureMessage(err)),
      },
    );
  }

  return (
    <AdminPageFrame
      title={t(ADMIN_PAGE_TITLE_KEYS.products)}
      addon={
        <p className="text-sm text-slate-500">
          {t("common.adminProductCreateAddon")}
        </p>
      }
    >
      <Card
        title={t("common.adminProductCreateCardTitle")}
        description={t("common.adminProductCreateCardDesc")}
        className="rounded-3xl border-neutral-200 shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
      >
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          {formError ?
            <p className="text-sm text-red-600" role="alert">
              {formError}
            </p>
          : null}

          <div>
            <label
              htmlFor="admin-product-seller"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              {t("common.adminProductFieldSeller")}
            </label>
            <select
              id="admin-product-seller"
              required
              value={sellerId}
              onChange={(ev) => setSellerId(ev.target.value)}
              className={selectClass}
              disabled={!hasToken}
            >
              <option value="">{t("common.adminProductPhSeller")}</option>
              {sellers.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.nick} ({m.email})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">{t("common.adminProductHintSeller")}</p>
          </div>

          <div>
            <label htmlFor="admin-product-title" className="mb-1 block text-sm font-medium text-slate-700">
              {t("common.adminProductFieldName")}
            </label>
            <input
              id="admin-product-title"
              type="text"
              required
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              className={adminInputClass}
              placeholder={t("common.adminPhProductTitle")}
            />
          </div>

          <div>
            <label htmlFor="admin-product-desc" className="mb-1 block text-sm font-medium text-slate-700">
              {t("common.adminProductFieldDescription")}
            </label>
            <textarea
              id="admin-product-desc"
              rows={4}
              required
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              className={adminInputClass}
              placeholder={t("common.adminProductPhDescription")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="admin-product-price" className="mb-1 block text-sm font-medium text-slate-700">
                {t("common.adminProductFieldPrice")}
              </label>
              <input
                id="admin-product-price"
                type="number"
                min={0}
                step="0.01"
                required
                value={price}
                onChange={(ev) => setPrice(ev.target.value)}
                className={adminInputClass}
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="admin-product-list" className="mb-1 block text-sm font-medium text-slate-700">
                {t("common.adminProductFieldListPrice")}
              </label>
              <input
                id="admin-product-list"
                type="number"
                min={0}
                step="0.01"
                value={listPrice}
                onChange={(ev) => setListPrice(ev.target.value)}
                className={adminInputClass}
                placeholder={t("common.adminProductPhListPrice")}
              />
              <p className="mt-1 text-xs text-slate-500">{t("common.adminProductHintListPrice")}</p>
            </div>
          </div>

          <div>
            <label htmlFor="admin-product-audience" className="mb-1 block text-sm font-medium text-slate-700">
              {t("common.adminProductFieldAudience")}
            </label>
            <select
              id="admin-product-audience"
              value={audience}
              onChange={(ev) => setAudience(ev.target.value as TargetAudience)}
              className={`${selectClass} max-w-md`}
            >
              {audiences.map((a) => (
                <option key={a} value={a}>
                  {audienceLabel(a)}
                </option>
              ))}
            </select>
          </div>


          <div className="border-t border-neutral-100 pt-4">
            <h3 className="mb-2 text-sm font-semibold text-slate-900">
              {t("common.adminProductSectionAttributes")}
            </h3>
            <p className="mb-4 text-xs text-slate-500">{t("common.adminProductHintAttributes")}</p>

            {attrQuickError ?
              <p className="mb-3 text-sm text-red-600" role="alert">
                {attrQuickError}
              </p>
            : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  {t("common.adminProductFieldSizes")}
                </span>
                <div className="max-h-36 space-y-2 overflow-y-auto rounded-2xl border border-neutral-200 bg-[#FAFAFB] p-3">
                  {sizeOptions.length === 0 ?
                    <span className="text-xs text-slate-500">{t("common.adminProductNoSizes")}</span>
                  : sizeOptions.map((s) => (
                      <label key={s._id} className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={sizeIds.includes(s._id)}
                          onChange={() => setSizeIds((prev) => toggleInList(prev, s._id))}
                        />
                        {s.name}
                      </label>
                    ))
                  }
                </div>
                <p className="mt-2 text-xs font-medium text-slate-600">
                  {t("common.adminProductQuickAddSizeLabel")}
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={newSizeName}
                    onChange={(ev) => setNewSizeName(ev.target.value)}
                    className={`${adminInputClass} min-w-[140px] flex-1`}
                    placeholder={t("common.adminProductQuickAddSizePh")}
                    disabled={addAttribute.isPending}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={addAttribute.isPending}
                    onClick={() =>
                      runQuickAttributeCreate(
                        "size",
                        newSizeName,
                        {},
                        (id) => setSizeIds((prev) => toggleInList(prev, id)),
                        () => setNewSizeName(""),
                      )
                    }
                  >
                    {t("common.adminProductQuickAddButton")}
                  </Button>
                </div>
              </div>
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  {t("common.adminProductFieldColors")}
                </span>
                <div className="max-h-36 space-y-2 overflow-y-auto rounded-2xl border border-neutral-200 bg-[#FAFAFB] p-3">
                  {colorOptions.length === 0 ?
                    <span className="text-xs text-slate-500">{t("common.adminProductNoColors")}</span>
                  : colorOptions.map((c) => (
                      <label key={c._id} className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={colorIds.includes(c._id)}
                          onChange={() => setColorIds((prev) => toggleInList(prev, c._id))}
                        />
                        {c.name}
                      </label>
                    ))
                  }
                </div>
                <p className="mt-2 text-xs font-medium text-slate-600">
                  {t("common.adminProductQuickAddColorLabel")}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(ev) => setNewColorName(ev.target.value)}
                    className={`${adminInputClass} min-w-[100px] flex-1`}
                    placeholder={t("common.adminProductQuickAddColorPh")}
                    disabled={addAttribute.isPending}
                  />
                  <input
                    type="text"
                    value={newColorHex}
                    onChange={(ev) => setNewColorHex(ev.target.value)}
                    className={`${adminInputClass} w-24`}
                    placeholder={t("common.adminProductQuickAddColorHexPh")}
                    disabled={addAttribute.isPending}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={addAttribute.isPending}
                    onClick={() =>
                      runQuickAttributeCreate(
                        "color",
                        newColorName,
                        newColorHex.trim() ? { hexCode: newColorHex.trim() } : {},
                        (id) => setColorIds((prev) => toggleInList(prev, id)),
                        () => {
                          setNewColorName("");
                          setNewColorHex("");
                        },
                      )
                    }
                  >
                    {t("common.adminProductQuickAddButton")}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-neutral-200 bg-[#FAFAFB] p-4">
              {variantRows.length === 0 ?
                <div>
                  <label htmlFor="admin-product-stock" className="mb-1 block text-sm font-medium text-slate-700">
                    {t("common.adminProductFieldStock")}
                  </label>
                  <input
                    id="admin-product-stock"
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={stockCount}
                    onChange={(ev) => setStockCount(ev.target.value)}
                    className={`${adminInputClass} max-w-xs`}
                  />
                  <p className="mt-1 text-xs text-slate-500">{t("common.adminProductHintStockSimple")}</p>
                </div>
              : <div>
                  <h3 className="mb-1 text-sm font-semibold text-slate-900">
                    {t("common.adminProductSectionVariantStock")}
                  </h3>
                  <p className="mb-3 text-xs text-slate-600">
                    {t("common.adminProductHintVariantStock")}
                  </p>
                  <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="w-full min-w-[320px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-[#FAFAFB] text-slate-600">
                          <th className="px-3 py-2 font-black">
                            {t("common.adminProductVariantColCombo")}
                          </th>
                          <th className="px-3 py-2 font-black">
                            {t("common.adminProductVariantColQty")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {variantRows.map((row) => (
                          <tr key={row.key} className="border-t border-neutral-100 transition hover:bg-[#FAFAFB]">
                            <td className="px-3 py-2 font-medium text-slate-800">
                              {variantRowLabel(row)}
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                min={0}
                                step={1}
                                value={variantQty[row.key] ?? "0"}
                                onChange={(ev) =>
                                  setVariantQty((prev) => ({
                                    ...prev,
                                    [row.key]: ev.target.value,
                                  }))
                                }
                                className={`${adminInputClass} w-28`}
                                aria-label={variantRowLabel(row)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              }
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="admin-product-brand" className="mb-1 block text-sm font-medium text-slate-700">
                  {t("common.adminProductFieldBrand")}
                </label>
                <select
                  id="admin-product-brand"
                  value={brandId}
                  onChange={(ev) => setBrandId(ev.target.value)}
                  className={selectClass}
                >
                  <option value="">{t("common.adminProductPhOptional")}</option>
                  {brandOptions.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs font-medium text-slate-600">
                  {t("common.adminProductQuickAddBrandLabel")}
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={newBrandName}
                    onChange={(ev) => setNewBrandName(ev.target.value)}
                    className={`${adminInputClass} min-w-[140px] flex-1`}
                    placeholder={t("common.adminProductQuickAddBrandPh")}
                    disabled={addAttribute.isPending}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={addAttribute.isPending}
                    onClick={() =>
                      runQuickAttributeCreate(
                        "brand",
                        newBrandName,
                        {},
                        (id) => setBrandId(id),
                        () => setNewBrandName(""),
                      )
                    }
                  >
                    {t("common.adminProductQuickAddButton")}
                  </Button>
                </div>
              </div>
              <div>
                <label htmlFor="admin-product-material" className="mb-1 block text-sm font-medium text-slate-700">
                  {t("common.adminProductFieldMaterial")}
                </label>
                <select
                  id="admin-product-material"
                  value={materialId}
                  onChange={(ev) => setMaterialId(ev.target.value)}
                  className={selectClass}
                >
                  <option value="">{t("common.adminProductPhOptional")}</option>
                  {materialOptions.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs font-medium text-slate-600">
                  {t("common.adminProductQuickAddMaterialLabel")}
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={newMaterialName}
                    onChange={(ev) => setNewMaterialName(ev.target.value)}
                    className={`${adminInputClass} min-w-[140px] flex-1`}
                    placeholder={t("common.adminProductQuickAddMaterialPh")}
                    disabled={addAttribute.isPending}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={addAttribute.isPending}
                    onClick={() =>
                      runQuickAttributeCreate(
                        "material",
                        newMaterialName,
                        {},
                        (id) => setMaterialId(id),
                        () => setNewMaterialName(""),
                      )
                    }
                  >
                    {t("common.adminProductQuickAddButton")}
                  </Button>
                </div>
              </div>
              <div>
                <label htmlFor="admin-product-style" className="mb-1 block text-sm font-medium text-slate-700">
                  {t("common.adminProductFieldStyle")}
                </label>
                <select
                  id="admin-product-style"
                  value={styleId}
                  onChange={(ev) => setStyleId(ev.target.value)}
                  className={selectClass}
                >
                  <option value="">{t("common.adminProductPhOptional")}</option>
                  {styleOptions.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs font-medium text-slate-600">
                  {t("common.adminProductQuickAddStyleLabel")}
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={newStyleName}
                    onChange={(ev) => setNewStyleName(ev.target.value)}
                    className={`${adminInputClass} min-w-[140px] flex-1`}
                    placeholder={t("common.adminProductQuickAddStylePh")}
                    disabled={addAttribute.isPending}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={addAttribute.isPending}
                    onClick={() =>
                      runQuickAttributeCreate(
                        "style",
                        newStyleName,
                        {},
                        (id) => setStyleId(id),
                        () => setNewStyleName(""),
                      )
                    }
                  >
                    {t("common.adminProductQuickAddButton")}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="mb-2 text-sm font-semibold text-slate-900">
              {t("common.adminProductSectionHomeShowcase")}
            </h3>
            <p className="mb-3 text-xs text-slate-500">
              {t("common.adminProductHintHomeShowcase")}
            </p>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={homeShowcaseNewArrivals}
                  onChange={(ev) => setHomeShowcaseNewArrivals(ev.target.checked)}
                />
                {t("common.adminProductHomeShowcaseNewArrivals")}
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={homeShowcaseMostPurchased}
                  onChange={(ev) =>
                    setHomeShowcaseMostPurchased(ev.target.checked)
                  }
                />
                {t("common.adminProductHomeShowcaseMostPurchased")}
              </label>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              {t("common.adminProductFieldImages")}
            </span>
            <p className="mb-3 text-xs text-slate-500">{t("common.adminProductHintImages")}</p>
            <div className="rounded-2xl border border-neutral-200 bg-[#FAFAFB] p-4">
              <input
                id="admin-product-photos-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="sr-only"
                onChange={(ev) => {
                  const list = ev.target.files ? Array.from(ev.target.files) : [];
                  setImageFiles(list.slice(0, 5));
                  ev.target.value = "";
                }}
              />
              <div className="flex flex-wrap items-center gap-3">
                <label
                  htmlFor="admin-product-photos-input"
                  className="inline-flex cursor-pointer select-none rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-black text-slate-900 shadow-sm transition hover:border-[#FDA4AF] hover:bg-[#FFF1F2] hover:text-[#BE123C] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#E11D48]"
                >
                  {t("common.adminProductPhotosPickButton")}
                </label>
                <span className="text-sm text-slate-600">
                  {imageFiles.length === 0 ?
                    t("common.adminProductPhotosNoneSelected")
                  : t("common.adminProductPhotosSelectedCount").replace(
                      "{n}",
                      String(imageFiles.length),
                    )}
                </span>
              </div>
              {imageFiles.length > 0 ?
                <ul className="mt-3 list-inside list-disc space-y-1 border-t border-slate-200/80 pt-3 text-sm text-slate-700">
                  {imageFiles.map((f, i) => (
                    <li key={`${f.name}-${i}-${f.size}`}>{f.name}</li>
                  ))}
                </ul>
              : null}
            </div>
          </div>

          <Button
            type="submit"
            variant="accent"
            size="md"
            className="!border-[#E11D48] !bg-[#E11D48] hover:!bg-[#BE123C]"
            disabled={createProduct.isPending}
          >
            {createProduct.isPending
              ? t("common.adminProductSubmitting")
              : t("common.adminSaveProduct")}
          </Button>
        </form>
      </Card>
    </AdminPageFrame>
  );
}
