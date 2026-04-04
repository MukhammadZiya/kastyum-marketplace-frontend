import { primaryImageForGroup } from "./lightWebpImages";

export type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
};

export const blogData: BlogPost[] = [
  {
    id: 1,
    title: "How to Build a Capsule Wardrobe for Work in 2026",
    excerpt:
      "Fewer pieces, more outfits: the suits, shirts, and shoes worth investing in for a polished office rotation.",
    image: primaryImageForGroup(1),
    date: "March 12, 2026",
    author: "Editorial",
    category: "Style guide",
  },
  {
    id: 2,
    title: "Suit Fit 101: Shoulders, Break, and When to Tailor",
    excerpt:
      "A practical guide to reading jacket drape, trouser length, and alterations that are worth the cost.",
    image: primaryImageForGroup(2),
    date: "March 15, 2026",
    author: "Editorial",
    category: "Tailoring",
  },
  {
    id: 3,
    title: "What Shoppers Expect from Online Fashion Retail Today",
    excerpt:
      "From accurate size charts to easy returns, these habits help clothing stores earn trust and repeat orders.",
    image: primaryImageForGroup(3),
    date: "March 18, 2026",
    author: "Editorial",
    category: "Retail",
  },
  {
    id: 4,
    title: "Accessorizing Formal Looks: Ties, Pocket Squares & Shoes",
    excerpt:
      "Small details that elevate a suit—without overpowering it—for weddings, galas, and client dinners.",
    image: primaryImageForGroup(4),
    date: "March 21, 2026",
    author: "Editorial",
    category: "Accessories",
  },
];
