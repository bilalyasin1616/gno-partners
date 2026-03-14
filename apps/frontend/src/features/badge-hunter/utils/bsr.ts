import type { ProductInfo } from "../types";

export function getEffectiveBsr(product: ProductInfo): number | null {
  if (product.currentBsr !== null) return product.currentBsr;
  const childBsrs = product.children
    .map((c) => c.currentBsr)
    .filter((b): b is number => b !== null);
  return childBsrs.length > 0 ? Math.min(...childBsrs) : null;
}
