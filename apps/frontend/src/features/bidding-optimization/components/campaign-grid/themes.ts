import type { Theme } from "@glideapps/glide-data-grid";
import type { Period } from "./columns";

const THEME_30D: Partial<Theme> = { bgCell: "#eff6ff" };
const THEME_7D: Partial<Theme> = { bgCell: "#f0fdf4" };
const THEME_PAUSED: Partial<Theme> = { bgCell: "#f9fafb", textDark: "#9ca3af" };
const THEME_PAUSED_30D: Partial<Theme> = { bgCell: "#e8eff7", textDark: "#9ca3af" };
const THEME_PAUSED_7D: Partial<Theme> = { bgCell: "#e6f5ec", textDark: "#9ca3af" };
const THEME_DELTA_POSITIVE: Partial<Theme> = { textDark: "#16a34a" };
const THEME_DELTA_NEGATIVE: Partial<Theme> = { textDark: "#dc2626" };
const THEME_DELTA_POSITIVE_PAUSED: Partial<Theme> = { textDark: "#86efac", bgCell: "#f9fafb" };
const THEME_DELTA_NEGATIVE_PAUSED: Partial<Theme> = { textDark: "#fca5a5", bgCell: "#f9fafb" };
export const THEME_RULE: Partial<Theme> = { bgCell: "#fefce8" };

export function getCellTheme(period: Period, isPaused: boolean): Partial<Theme> | undefined {
  if (period === "30d") return isPaused ? THEME_PAUSED_30D : THEME_30D;
  if (period === "7d") return isPaused ? THEME_PAUSED_7D : THEME_7D;
  if (isPaused) return THEME_PAUSED;
  return undefined;
}

export function getDeltaTheme(value: number, isPaused: boolean): Partial<Theme> | undefined {
  if (value < 0) return isPaused ? THEME_DELTA_POSITIVE_PAUSED : THEME_DELTA_POSITIVE;
  if (value > 0) return isPaused ? THEME_DELTA_NEGATIVE_PAUSED : THEME_DELTA_NEGATIVE;
  return isPaused ? THEME_PAUSED : undefined;
}
