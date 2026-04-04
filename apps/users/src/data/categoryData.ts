import { primaryImageForGroup } from "./lightWebpImages";

export type CategoryItem = {
  id: number;
  title: string;
  /** i18n key (flat messages) for nav and category cards */
  titleKey: string;
  img: string;
  /** Passed as `?q=` on shop so results match this category (title substring search). */
  shopSearchQuery: string;
};

export const categoryData: CategoryItem[] = [
  {
    title: "Men's suits",
    titleKey: "categoryNavMensSuits",
    id: 1,
    img: primaryImageForGroup(1),
    shopSearchQuery: "Navy",
  },
  {
    title: "Formal & evening",
    titleKey: "categoryNavFormalEvening",
    id: 2,
    img: primaryImageForGroup(2),
    shopSearchQuery: "Tuxedo",
  },
  {
    title: "Business tailoring",
    titleKey: "categoryNavBusinessTailoring",
    id: 3,
    img: primaryImageForGroup(3),
    shopSearchQuery: "Charcoal",
  },
  {
    title: "Smart casual",
    titleKey: "categoryNavSmartCasual",
    id: 4,
    img: primaryImageForGroup(4),
    shopSearchQuery: "Beige",
  },
  {
    title: "Statement suits",
    titleKey: "categoryNavStatementSuits",
    id: 5,
    img: primaryImageForGroup(5),
    shopSearchQuery: "Emerald",
  },
  {
    title: "Seasonal edit",
    titleKey: "categoryNavSeasonalEdit",
    id: 6,
    img: primaryImageForGroup(6),
    shopSearchQuery: "Ivory",
  },
  {
    title: "Classic three-piece",
    titleKey: "categoryNavClassicThreePiece",
    id: 7,
    img: primaryImageForGroup(7),
    shopSearchQuery: "Brown",
  },
  {
    title: "Evening suits",
    titleKey: "categoryNavEveningSuits",
    id: 8,
    img: primaryImageForGroup(8),
    shopSearchQuery: "Midnight",
  },
];

/** Unique titles for nav (carousel may repeat the same category). */
export function categoryDataUniqueForNav(): CategoryItem[] {
  const seen = new Set<string>();
  return categoryData.filter((c) => {
    if (seen.has(c.title)) return false;
    seen.add(c.title);
    return true;
  });
}
