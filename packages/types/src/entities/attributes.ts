export type Color = {
  _id: string;
  name: string;
  hexCode?: string;
  code?: string;
};

export type Size = {
  _id: string;
  name: string;
};

export type Brand = {
  _id: string;
  name: string;
  logoUrl?: string;
};

export type Material = {
  _id: string;
  name: string;
};

export type Fit = {
  _id: string;
  name: string;
};

export type Style = {
  _id: string;
  name: string;
};

export type AttributeKind =
  | "color"
  | "size"
  | "brand"
  | "material"
  | "fit"
  | "style";

export type AttributeEntity =
  | Color
  | Size
  | Brand
  | Material
  | Fit
  | Style;

export type AllAttributesBundle = {
  color: Color[];
  size: Size[];
  brand: Brand[];
  material: Material[];
  fit: Fit[];
  style: Style[];
};
