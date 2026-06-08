import { Link } from "react-router-dom";
import type { CategoryItem } from "../../../data/categoryData";
import { useT } from "../../../i18n";

export default function CategoryCard({ item }: { item: CategoryItem }) {
  const t = useT();
  const to = `/shop-with-sidebar?q=${encodeURIComponent(item.shopSearchQuery)}`;

  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-6 text-center transition-shadow hover:border-[#FFE4EA] hover:shadow-sm"
    >
      <img src={item.img} alt="" width={80} height={80} />
      <h3 className="mt-4 font-medium text-neutral-900">{t(item.titleKey)}</h3>
    </Link>
  );
}
