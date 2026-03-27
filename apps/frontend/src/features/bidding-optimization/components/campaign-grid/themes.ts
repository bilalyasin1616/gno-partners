import type { Theme } from "@glideapps/glide-data-grid";
import type { Period } from "./columns";

const THEME_30D: Partial<Theme> = { bgCell: "#eff6ff" };
const THEME_7D: Partial<Theme> = { bgCell: "#f0fdf4" };
const THEME_DELTA_POSITIVE: Partial<Theme> = { textDark: "#16a34a" };
const THEME_DELTA_NEGATIVE: Partial<Theme> = { textDark: "#dc2626" };
export const THEME_RULE: Partial<Theme> = { bgCell: "#fefce8" };

export function getCellTheme(period: Period): Partial<Theme> | undefined {
  if (period === "30d") return THEME_30D;
  if (period === "7d") return THEME_7D;
  return undefined;
}

export function getDeltaTheme(value: number): Partial<Theme> | undefined {
  if (value < 0) return THEME_DELTA_POSITIVE;
  if (value > 0) return THEME_DELTA_NEGATIVE;
  return undefined;
}
