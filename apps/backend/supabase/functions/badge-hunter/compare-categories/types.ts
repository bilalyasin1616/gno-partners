export interface CategoryInput {
  id: number;
  name: string;
}

export interface CategoryResult {
  categoryId: number;
  categoryName: string;
  categoryPath: string;            // full path from best seller's category tree: "Sports > Accessories > Water Sports"
  categoryRootId: number | null;   // root category of this best seller (for sameRoot comparison)
  categoryRootName: string | null;
  bestSellerAsin: string | null;
  bestSellerTitle: string | null;
  bestSellerRootCategoryId: number | null;
  bestSellerRootBsr: number | null;
}
