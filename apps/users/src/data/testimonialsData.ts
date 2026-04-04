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
      "Great quality and fast delivery. The product looked even better in person than online.",
    img: primaryImageForGroup(5),
  },
  {
    id: 2,
    name: "Jacob Jones",
    designation: "Customer",
    content:
      "Smooth checkout, nice packaging, and excellent support. Definitely shopping again.",
    img: primaryImageForGroup(6),
  },
  {
    id: 3,
    name: "Courtney Henry",
    designation: "Customer",
    content:
      "Really impressed with the design and comfort. The deals are genuinely worth it.",
    img: primaryImageForGroup(7),
  },
  {
    id: 4,
    name: "Kristin Watson",
    designation: "Customer",
    content:
      "The site is clean and easy to use. Shipping was quick and the product is top-notch.",
    img: primaryImageForGroup(1),
  },
];

