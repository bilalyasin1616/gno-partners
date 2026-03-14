import type { ChildProduct, ProductInfo } from "./types.ts";
import type { KeepaProduct } from "../_shared/keepa/keepa.type.ts";
import { extractBsr, extractImageUrl } from "../_shared/keepa/keepa.util.ts";
import { fetchKeepaProducts } from "../_shared/keepa/keepa.api.ts";

function mapProduct(product: KeepaProduct): Omit<ProductInfo, "children"> {
  return {
    asin: product.asin,
    title: product.title ?? "",
    description: product.description ?? "",
    bulletPoints: product.bulletPoints ?? [],
    imageUrl: extractImageUrl(product.imagesCSV),
    currentBsr: extractBsr(product.salesRanks, product.rootCategory),
    rootCategoryId: product.rootCategory ?? null,
    categoryTree: (product.categoryTree ?? []).map((c) => ({
      id: c.catId,
      name: c.name,
    })),
    isParent: (product.variations?.length ?? 0) > 0,
    parentAsin: product.parentAsin ?? null,
  };
}

export async function fetchProduct(
  asin: string,
  domainId: number
): Promise<ProductInfo> {
  const products = await fetchKeepaProducts([asin], domainId);
  if (products.length === 0) throw new Error("Product not found");

  const mainProduct = products[0];
  const productInfo = mapProduct(mainProduct);

  let children: ChildProduct[] = [];
  if (mainProduct.variations && mainProduct.variations.length > 0) {
    const childAsins = mainProduct.variations.map((v) => v.asin);
    const childProducts = await fetchKeepaProducts(
      childAsins.slice(0, 100),
      domainId
    );

    children = childProducts.map((child) => {
      const variation = mainProduct.variations?.find(
        (v) => v.asin === child.asin
      );
      return {
        asin: child.asin,
        title: child.title ?? "",
        imageUrl: extractImageUrl(child.imagesCSV),
        currentBsr: extractBsr(child.salesRanks, child.rootCategory),
        attributes: variation?.attributes ?? [],
      };
    });
  }

  return { ...productInfo, children };
}
