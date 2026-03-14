export interface InputCategoryNode {
  id: number;
  name: string;
}

export interface FlatCategory {
  id: number;
  name: string;
  path: string;   // e.g. "Jackets & Coats > Rain Jackets"
  level: number;  // depth from pivot (1 = direct child, 2 = grandchild)
  productCount: number;
}
