export type ProductImages = {
  thumbnails: string[];
  previews: string[];
};

export type Product = {
  id: number;
  title: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  imgs: ProductImages;
};

