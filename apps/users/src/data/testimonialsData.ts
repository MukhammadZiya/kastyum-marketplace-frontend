import { primaryImageForGroup } from "./lightWebpImages";

export type Testimonial = {
  id: number;
  name: string;
  designation: string;
  content: string;
  img: string;
};

export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Esther Howard",
    designation: "Customer",
    content:
      "The suit arrived beautifully pressed and true to size. The fabric feels substantial—better in person than on screen.",
    img: primaryImageForGroup(5),
  },
  {
    id: 2,
    name: "Jacob Jones",
    designation: "Customer",
    content:
      "Smooth checkout and fast shipping. Customer care helped me swap sizes without any fuss.",
    img: primaryImageForGroup(6),
  },
  {
    id: 3,
    name: "Courtney Henry",
    designation: "Customer",
    content:
      "Finally a store where the photos match the product. The cut is modern and the tailoring notes on the site were spot on.",
    img: primaryImageForGroup(7),
  },
  {
    id: 4,
    name: "Kristin Watson",
    designation: "Customer",
    content:
      "Clean site, easy to browse fits, and the return window gave me confidence to try a bolder color.",
    img: primaryImageForGroup(1),
  },
];
