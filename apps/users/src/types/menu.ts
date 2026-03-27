export type MenuItem = {
  id: number;
  title: string;
  newTab: boolean;
  path: string;
  submenu?: MenuItem[];
};

