export interface ChildProduct {
  asin: string;
  title: string;
  imageUrl: string | null;
  currentBsr: number | null;
  attributes: { dimension: string; value: string }[];
}

export interface ProductInfo {
  asin: string;
  title: string;
  description: string;
  bulletPoints: string[];
  imageUrl: string | null;
  currentBsr: number | null;
  rootCategoryId: number | null;
  categoryTree: { id: number; name: string }[];
  isParent: boolean;
  parentAsin: string | null;
  children: ChildProduct[];
}
