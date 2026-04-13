/** Storefront `price` = original (strikethrough), `discountedPrice` = amount customer pays. */
export function showStrikethroughOriginalPrice(item: {
  price: number;
  discountedPrice: number;
}): boolean {
  return item.price > item.discountedPrice + 1e-6;
}
