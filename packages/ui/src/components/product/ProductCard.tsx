import { Button } from "../Button";

export interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  oldPrice?: string;
  image?: string;
}

export function ProductCard({ id, name, price, oldPrice, image }: ProductCardProps) {
  return (
    <article
      data-product-id={id}
      className="group relative rounded-2xl bg-white p-5 ring-1 ring-neutral-200/70 transition-all duration-200 hover:-translate-y-1 hover:shadow-sm hover:ring-neutral-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="h-full w-full bg-neutral-100" />
        )}
      </div>

      <h2 className="mt-5 text-base font-semibold tracking-tight text-neutral-900 sm:text-lg">
        {name}
      </h2>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          {oldPrice ? (
            <div className="text-sm text-neutral-400 line-through">{oldPrice}</div>
          ) : null}
          <div className="text-base font-semibold tracking-tight text-black sm:text-lg">
            {price}
          </div>
        </div>

        <Button variant="primary" size="sm">
          Add to cart
        </Button>
      </div>
    </article>
  );
}