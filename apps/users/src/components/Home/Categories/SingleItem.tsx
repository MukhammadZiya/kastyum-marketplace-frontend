import type { CategoryItem } from "../../../data/categoryData";

export default function CategoryCard({ item }: { item: CategoryItem }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-6 text-center hover:shadow-sm transition-shadow">
      <img src={item.img} alt={item.title} width={80} height={80} />
      <h3 className="mt-4 font-medium text-neutral-900">{item.title}</h3>
    </div>
  );
}

