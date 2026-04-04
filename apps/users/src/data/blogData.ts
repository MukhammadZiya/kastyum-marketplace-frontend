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
    title: "Top 10 Smart Gadgets You Should Buy in 2026",
    excerpt:
      "Discover the newest gadgets that improve productivity and daily life with smart automation.",
    image: primaryImageForGroup(1),
    date: "March 12, 2026",
    author: "Admin",
    category: "Technology",
  },
  {
    id: 2,
    title: "How to Choose a Perfect Laptop for Development",
    excerpt:
      "A practical checklist for selecting CPU, RAM, battery and display for modern coding workloads.",
    image: primaryImageForGroup(2),
    date: "March 15, 2026",
    author: "Admin",
    category: "Guides",
  },
  {
    id: 3,
    title: "E-commerce Trends That Will Shape Online Stores",
    excerpt:
      "From AI recommendations to fast checkout, these trends can boost conversion and customer trust.",
    image: primaryImageForGroup(3),
    date: "March 18, 2026",
    author: "Admin",
    category: "Business",
  },
  {
    id: 4,
    title: "Best Accessories to Upgrade Your Workspace",
    excerpt:
      "Build a more comfortable and efficient desk setup with these must-have accessories.",
    image: primaryImageForGroup(4),
    date: "March 21, 2026",
    author: "Admin",
    category: "Lifestyle",
  },
];

