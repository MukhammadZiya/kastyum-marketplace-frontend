import type { ProductImages } from "../types/product";

/**
 * Product photos live in `public/images/images`.
 *
 * Naming (case-insensitive `IMG` or `img`, separator `_` or `-` before group):
 *   `IMG_<group>-<variant>.JPG.webp`  — gallery image for product group
 *   `IMG_<group>-<variant>-main.JPG.webp` — same group; `-main` is the hero (shown first)
 *
 * Files are never mixed across groups: product group `3` only uses `IMG_3-*` / `img_3-*`.
 */
const LIGHT_WEBP_BASE = "/images/images";

/** Filenames actually in `public/images/images` (add new rows when you upload). */
const LIGHT_WEBP_FILES = [
  "IMG_1-1.JPG.webp",
  "IMG_1-2.JPG.webp",
  "IMG_1-3-main.JPG.webp",
  "IMG_1-4.JPG.webp",
  "IMG_2-1.JPG.webp",
  "IMG_2-2.JPG.webp",
  "IMG_2-3-main.JPG.webp",
  "IMG_2-4.JPG.webp",
  "IMG_3-1.JPG.webp",
  "IMG_3-2.JPG.webp",
  "IMG_3-3.JPG.webp",
  "IMG_3-4.JPG.webp",
  "IMG_4-1.JPG.webp",
  "IMG_4-2.JPG.webp",
  "IMG_4-3-main.JPG.webp",
  "IMG_4-4.JPG.webp",
  "IMG_5-1.JPG.webp",
  "IMG_5-2.JPG.webp",
  "IMG_5-3-main.JPG.webp",
  "IMG_5-4.JPG.webp",
  "IMG_6-1.JPG.webp",
  "IMG_6-2-main.JPG.webp",
  "IMG_6-3.JPG.webp",
  "IMG_6-4.JPG.webp",
  "IMG_7-1.JPG.webp",
  "IMG_7-2.JPG.webp",
  "IMG_7-4-main.JPG.webp",
  "IMG_7-4.JPG.webp",
] as const;

type Parsed = {
  group: number;
  variant: number;
  isMain: boolean;
  filename: string;
};

const PARSE =
  /^(IMG|img)[_-](\d+)-(\d+)(-main)?\.JPG\.webp$/i;

function parseFilename(filename: string): Parsed | null {
  const m = filename.match(PARSE);
  if (!m) return null;
  return {
    group: Number(m[2]),
    variant: Number(m[3]),
    isMain: m[4] === "-main",
    filename,
  };
}

const PARSED_FILES: Parsed[] = LIGHT_WEBP_FILES.map((f) => parseFilename(f)).filter(
  (p): p is Parsed => p !== null,
);

const MAX_GROUP =
  PARSED_FILES.length === 0 ? 0 : Math.max(...PARSED_FILES.map((p) => p.group));

/** Every image URL for a product group, in display order: all `-main` shots first (by variant), then the rest (by variant). Duplicates the same variant without `-main` are dropped when a `-main` exists. */
export function urlsForProductGroup(groupId: number): string[] {
  const inGroup = PARSED_FILES.filter((p) => p.group === groupId);
  const mains = inGroup.filter((p) => p.isMain).sort((a, b) => a.variant - b.variant);
  const others = inGroup.filter((p) => !p.isMain).sort((a, b) => a.variant - b.variant);
  const mainVariants = new Set(mains.map((p) => p.variant));
  const othersDeduped = others.filter((o) => !mainVariants.has(o.variant));
  return [...mains, ...othersDeduped].map(
    (p) => `${LIGHT_WEBP_BASE}/${p.filename}`,
  );
}

/** First URL for a group = main hero when `-main` exists, otherwise lowest variant. */
export function primaryImageForGroup(groupId: number): string {
  const urls = urlsForProductGroup(groupId);
  return urls[0] ?? "";
}

/** Shown when a product group has no files yet (never uses another group’s photos). */
const MISSING_GROUP_PLACEHOLDER = "/images/logo/logo.svg";

/**
 * Thumbnails + previews for one shop product. `productGroupId` must match the first
 * number in filenames (`IMG_<productGroupId>-…`). No images from other groups.
 */
export function productLightWebImgs(productGroupId: number): ProductImages {
  const urls = urlsForProductGroup(productGroupId);
  if (urls.length === 0) {
    return {
      thumbnails: [MISSING_GROUP_PLACEHOLDER],
      previews: [MISSING_GROUP_PLACEHOLDER],
    };
  }
  return { thumbnails: [...urls], previews: [...urls] };
}

/**
 * Legacy helper: `lightWebpUrl(i)` → primary image for group `(i % maxGroup) + 1`.
 * Prefer `primaryImageForGroup(n)` where possible.
 */
export function lightWebpUrl(index: number): string {
  if (MAX_GROUP < 1) return "";
  const g = (index % MAX_GROUP) + 1;
  return primaryImageForGroup(g);
}
