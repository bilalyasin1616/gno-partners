import { useState } from "react";
import type { ChildProduct } from "../types";
import { BsrBadge } from "./BsrBadge";

const INITIAL_ROWS = 8;

interface Props {
  children: ChildProduct[];
}

function attributeLabel(child: ChildProduct): string {
  if (child.attributes.length > 0) {
    return child.attributes.map((a) => `${a.dimension}: ${a.value}`).join(", ");
  }
  return child.title || "—";
}

export function VariationsTable({ children }: Props) {
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filtered = filter.trim()
    ? children.filter(
        (c) =>
          c.asin.toLowerCase().includes(filter.toLowerCase()) ||
          attributeLabel(c).toLowerCase().includes(filter.toLowerCase())
      )
    : children;

  const visible = expanded ? filtered : filtered.slice(0, INITIAL_ROWS);
  const hiddenCount = filtered.length - INITIAL_ROWS;

  return (
    <div className="border-t border-gray-100">
      <div className="flex items-center justify-between px-6 pt-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Variations · {children.length}
        </p>
        <input
          type="text"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setExpanded(false);
          }}
          placeholder="Filter by ASIN or attribute…"
          className="w-56 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-300/40"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
              <th className="px-6 py-2 font-medium">ASIN</th>
              <th className="px-4 py-2 font-medium">Attributes</th>
              <th className="px-4 py-2 font-medium">BSR</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((child) => (
              <tr
                key={child.asin}
                className="border-b border-gray-50 transition hover:bg-cream/60"
              >
                <td className="px-6 py-3 font-mono text-xs text-gray-600">
                  {child.asin}
                </td>
                <td className="px-4 py-3 text-xs text-gray-700">
                  {attributeLabel(child)}
                </td>
                <td className="px-4 py-3">
                  <BsrBadge bsr={child.currentBsr} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-6 text-center text-xs text-gray-400">
                  No variations match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!expanded && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full border-t border-gray-100 py-3 text-xs font-medium text-gold-600 transition hover:bg-cream/60"
        >
          Show {hiddenCount} more variations
        </button>
      )}
      {expanded && filtered.length > INITIAL_ROWS && (
        <button
          onClick={() => setExpanded(false)}
          className="w-full border-t border-gray-100 py-3 text-xs font-medium text-gray-400 transition hover:bg-cream/60"
        >
          Show less
        </button>
      )}
    </div>
  );
}
