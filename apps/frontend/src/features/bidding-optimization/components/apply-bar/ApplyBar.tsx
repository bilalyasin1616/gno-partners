interface Props {
  hasRules: boolean;
  onApplyClick: () => void;
  onReload: () => void;
}

export function ApplyBar({ hasRules, onApplyClick, onReload }: Props) {
  return (
    <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={onReload}
          title="Upload a new campaign report"
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          ↻ New Report
        </button>
        <button
          onClick={onApplyClick}
          disabled={!hasRules}
          className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${
            hasRules
              ? "bg-gold-500 text-white hover:bg-gold-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Apply Rules
        </button>
      </div>
    </div>
  );
}
