interface Props {
  canApply: boolean;
  disabledReason?: string;
  onApplyClick: () => void;
  onConfigClick: () => void;
  onReload: () => void;
}

export function ApplyBar({ canApply, disabledReason, onApplyClick, onConfigClick, onReload }: Props) {
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
        <div className="flex items-center gap-3">
          <button
            onClick={onConfigClick}
            title="Configure rule parameters"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ⚙ Rules Config
          </button>
          <div className="relative group">
            <button
              onClick={onApplyClick}
              disabled={!canApply}
              className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${
                canApply
                  ? "bg-gold-500 text-white hover:bg-gold-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Apply Rules
            </button>
            {!canApply && disabledReason && (
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                <div className="whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
                  {disabledReason}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
