import type { ProductInfo } from "../types";
import { BsrBadge } from "./BsrBadge";
import { VariationsTable } from "./VariationsTable";
import { getEffectiveBsr } from "../utils/bsr";

interface Props {
  product: ProductInfo;
}

function CategoryPath({ tree }: { tree: { id: number; name: string }[] }) {
  if (tree.length === 0) return null;
  return (
    <p className="mt-1 text-xs text-gray-400">
      {tree.map((c) => c.name).join(" › ")}
    </p>
  );
}

export function ProductCard({ product }: Props) {
  const effectiveBsr = getEffectiveBsr(product);
  const bsrLabel = effectiveBsr !== null && product.currentBsr === null ? "best variation" : undefined;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex gap-4 p-6">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="size-24 flex-shrink-0 rounded-lg border border-gray-100 object-contain"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="mb-1 font-mono text-xs text-gray-400">{product.asin}</p>
          <h3 className="line-clamp-3 font-semibold leading-snug text-gray-900">
            {product.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <BsrBadge bsr={effectiveBsr} label={bsrLabel} />
            {product.isParent && (
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                Parent ASIN · {product.children.length} variations
              </span>
            )}
          </div>
          <CategoryPath tree={product.categoryTree} />
        </div>
      </div>

      {product.children.length > 0 && (
        <VariationsTable children={product.children} />
      )}
    </div>
  );
}
