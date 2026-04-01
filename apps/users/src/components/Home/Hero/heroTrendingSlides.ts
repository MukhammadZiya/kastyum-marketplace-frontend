import { shopData } from "../../../data/shopData";

export type HeroTrendingSlide = {
  id: number;
  eyebrow: string;
  /** Short serif-style line (first words of title) */
  headline: string;
  subline: string;
  priceLabel: string;
  image: string;
  imageAlt: string;
};

/** Pick products for the home hero; labels alternate between trending / new. */
export function getHeroTrendingSlides(): HeroTrendingSlide[] {
  const brows = ["Trending now", "Just dropped", "New in", "Staff pick", "Hot this week"] as const;

  return shopData.slice(0, 5).map((p, i) => {
    const words = p.title.split(/\s+/);
    const headline =
      words.length <= 3 ? p.title : `${words.slice(0, 2).join(" ")}`;

    return {
      id: p.id,
      eyebrow: brows[i % brows.length]!,
      headline,
      subline: p.title,
      priceLabel: `From $${p.discountedPrice.toFixed(0)}`,
      image: p.imgs.previews[0] ?? "",
      imageAlt: p.title,
    };
  });
}
