import type { ProvideEditorComponent } from "@glideapps/glide-data-grid";
import type { DropdownCell } from "./types";
import { DROPDOWN_PRESETS } from "./constants";

const presetButtonStyle = {
  padding: "6px 12px",
  textAlign: "left" as const,
  fontSize: 13,
  border: "none",
  cursor: "pointer",
};

const customInputStyle = {
  width: "100%",
  fontSize: 13,
  padding: "4px",
  border: "1px solid #d1d5db",
  borderRadius: 4,
  outline: "none",
};

export const DropdownEditor: ProvideEditorComponent<DropdownCell> = ({ value: cell, onChange, onFinishedEditing }) => {
  const currentValue = cell.data.value;

  const handleSelect = (val: string) => {
    const next: DropdownCell = { ...cell, data: { ...cell.data, value: val } };
    onChange(next);
    onFinishedEditing(next);
  };

  const isSelected = (preset: string) => preset === currentValue;

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "white", minWidth: 100 }}>
      {cell.data.presets.map((preset) => (
        <button
          key={preset}
          onClick={() => handleSelect(preset)}
          style={{
            ...presetButtonStyle,
            background: isSelected(preset) ? "#fefce8" : "white",
            fontWeight: isSelected(preset) ? 600 : 400,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = isSelected(preset) ? "#fefce8" : "white"; }}
        >
          {preset}
        </button>
      ))}
      <div style={{ borderTop: "1px solid #e5e7eb", padding: "4px 8px" }}>
        <input
          autoFocus
          type="text"
          placeholder="Custom %"
          defaultValue={DROPDOWN_PRESETS.includes(currentValue as typeof DROPDOWN_PRESETS[number]) ? "" : currentValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSelect((e.target as HTMLInputElement).value);
            if (e.key === "Escape") onFinishedEditing();
          }}
          style={customInputStyle}
        />
      </div>
    </div>
  );
};
