import ProductItem from "../Home/NewArrivals/ProductItem";
import type { Product } from "../../types/product";

export default function SingleGridItem({ item }: { item: Product }) {
  return <ProductItem item={item} />;
}

