import { useState } from "react";
import type { RuleConfig } from "../../types";

interface Props {
  config: RuleConfig;
  onSave: (config: RuleConfig) => void;
  onClose: () => void;
}

interface FieldProps {
  label: string;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
}

function ConfigField({ label, value, suffix = "", onChange }: FieldProps) {
  return (
    <div className="grid grid-cols-[1fr_5rem_3rem] items-center gap-2 py-2">
      <label className="text-sm text-gray-700">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded border border-gray-300 px-2 py-1 text-right text-sm"
      />
      <span className="text-sm text-gray-500">{suffix}</span>
    </div>
  );
}

export function RuleConfigModal({ config, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<RuleConfig>({ ...config });

  const update = (field: keyof RuleConfig, value: number) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Rules Configuration</h2>

        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium text-gray-900">Lower Bleeders (no sales)</h3>
          <div className="rounded-md border border-gray-200 px-4">
            <ConfigField label="Low click threshold" value={draft.bleederLowClicks} suffix="clicks" onChange={(v) => update("bleederLowClicks", v)} />
            <ConfigField label="Low range bid reduction" value={draft.bleederLowReduction} suffix="%" onChange={(v) => update("bleederLowReduction", v)} />
            <ConfigField label="Mid click threshold" value={draft.bleederMidClicks} suffix="clicks" onChange={(v) => update("bleederMidClicks", v)} />
            <ConfigField label="Mid range bid reduction" value={draft.bleederMidReduction} suffix="%" onChange={(v) => update("bleederMidReduction", v)} />
            <ConfigField label="Pause click threshold" value={draft.bleederPauseClicks} suffix="clicks" onChange={(v) => update("bleederPauseClicks", v)} />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-gray-900">Increase Bids for Low Clicks</h3>
          <div className="rounded-md border border-gray-200 px-4">
            <ConfigField label="Max clicks threshold" value={draft.lowClicksThreshold} suffix="clicks" onChange={(v) => update("lowClicksThreshold", v)} />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-md px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
            Cancel
          </button>
          <button
            onClick={() => { onSave(draft); onClose(); }}
            className="rounded-md bg-gold-500 px-4 py-2 text-sm font-medium text-white hover:bg-gold-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
