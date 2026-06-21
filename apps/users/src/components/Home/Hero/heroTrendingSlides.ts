import { shopData } from "../../../data/shopData";
import type { TranslateFn } from "../../../i18n/types";

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

const EYEBROW_KEYS = [
  "homeHeroEyebrowTrending",
  "homeHeroEyebrowJustDropped",
  "homeHeroEyebrowNewIn",
  "homeHeroEyebrowStaffPick",
  "homeHeroEyebrowHotWeek",
] as const;

const HERO_IMAGE_OVERRIDES: Record<number, string> = {
  3: "/images/images/IMG_4-3-main.JPG.webp",
};

/** Pick products for the home hero; labels alternate between trending / new. */
export function getHeroTrendingSlides(t: TranslateFn): HeroTrendingSlide[] {
  return shopData.slice(0, 5).map((p, i) => {
    const words = p.title.split(/\s+/);
    const headline =
      words.length <= 3 ? p.title : `${words.slice(0, 2).join(" ")}`;

    return {
      id: p.id,
      eyebrow: t(EYEBROW_KEYS[i % EYEBROW_KEYS.length]!),
      headline,
      subline: p.title,
      priceLabel: t("homeHeroPriceFormatted").replace(
        "{amount}",
        `$${p.discountedPrice.toFixed(0)}`,
      ),
      image: HERO_IMAGE_OVERRIDES[p.id] ?? p.imgs.previews[0] ?? "",
      imageAlt: p.title,
    };
  });
}
