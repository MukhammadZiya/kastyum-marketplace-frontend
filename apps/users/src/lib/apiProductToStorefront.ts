import { apiClient } from "@repo/api";
import type { ProductWithRelations } from "@repo/types";
import type { Product } from "../types/product";

function mediaUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = (apiClient.defaults.baseURL ?? "").replace(/\/$/, "");
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

function numericIdFromMongoId(mongoId: string): number {
  let n = 0;
  for (let i = 0; i < mongoId.length; i++) {
    n = (Math.imul(31, n) + mongoId.charCodeAt(i)) | 0;
  }
  const x = n >>> 0;
  return x === 0 ? 1 : x;
}

export function apiProductToStorefront(
  p: ProductWithRelations,
  opts?: { customPreviewPath?: string | null },
): Product {
  const raw = p.images?.length ? p.images : [""];
  const previews = raw.map((path) => mediaUrl(path));
  const thumbnails = previews.length ? previews : [mediaUrl("")];
  const salePrice = p.price;
  const listPrice =
    p.listPrice != null && p.listPrice > salePrice ? p.listPrice : salePrice;
  const custom =
    opts?.customPreviewPath ?
      mediaUrl(opts.customPreviewPath)
    : null;
  const imgs =
    custom ?
      { thumbnails: [custom, ...thumbnails], previews: [custom, ...previews] }
    : { thumbnails, previews };
  return {
    id: numericIdFromMongoId(p._id),
    mongoId: p._id,
    title: p.title,
    reviews: 0,
    price: listPrice,
    discountedPrice: salePrice,
    imgs,
  };
}
