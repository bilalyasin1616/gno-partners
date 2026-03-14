import { useState } from "react";
import { TagsInput } from "react-tag-input-component";
import { MARKETPLACES, type MarketplaceCode } from "../types";

interface Props {
  onSubmit: (asin: string, marketplace: MarketplaceCode, searchTerms?: string[]) => void;
  isLoading: boolean;
}

const MAX_KEYWORDS = 2;

export function AsinInput({ onSubmit, isLoading }: Props) {
  const [asin, setAsin] = useState("");
  const [marketplace, setMarketplace] = useState<MarketplaceCode>("US");
  const [searchTerms, setSearchTerms] = useState<string[]>([]);

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();
    const trimmed = asin.trim().toUpperCase();
    if (!trimmed) return;

    onSubmit(trimmed, marketplace, searchTerms.length > 0 ? searchTerms : undefined);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-500">
        Analyze Product
      </h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            ASIN
          </label>
          <input
            type="text"
            value={asin}
            onChange={(e) => setAsin(e.target.value)}
            placeholder="e.g. B08YRDNXJK"
            maxLength={10}
            required
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 font-mono text-sm text-gray-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-300/40"
          />
        </div>

        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Keywords <span className="text-gray-400">(optional, max {MAX_KEYWORDS})</span>
          </label>
          <TagsInput
            value={searchTerms}
            onChange={setSearchTerms}
            beforeAddValidate={(tag) =>
              searchTerms.length < MAX_KEYWORDS && tag.trim().length > 0
            }
            separators={["Enter", ","]}
            placeHolder={searchTerms.length >= MAX_KEYWORDS ? "" : "Add keyword\u2026"}
          />
        </div>

        <div className="w-full sm:w-48">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Marketplace
          </label>
          <select
            value={marketplace}
            onChange={(e) => setMarketplace(e.target.value as MarketplaceCode)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-300/40"
          >
            {MARKETPLACES.map((m) => (
              <option key={m.code} value={m.code}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !asin.trim()}
          className="flex items-center gap-2 rounded-lg bg-orange px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Looking up…
            </>
          ) : (
            "Hunt Badges"
          )}
        </button>
      </div>
    </form>
  );
}
