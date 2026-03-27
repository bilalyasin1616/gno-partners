import type { AggregatedCampaign } from "../../types";
import type { SortEntry } from "./types";
import { DATA_COLUMNS } from "./columns";

const ARROW_HALF_HEIGHT = 3;
const ARROW_HALF_WIDTH = 4;
const ARROW_RIGHT_PADDING = 16;

function compareField(a: AggregatedCampaign, b: AggregatedCampaign, field: keyof AggregatedCampaign, direction: "asc" | "desc"): number {
  const valA = a[field];
  const valB = b[field];
  const dir = direction === "asc" ? 1 : -1;
  if (typeof valA === "string" && typeof valB === "string") return valA.localeCompare(valB) * dir;
  if (typeof valA === "number" && typeof valB === "number") return (valA - valB) * dir;
  return 0;
}

export function multiSort(a: AggregatedCampaign, b: AggregatedCampaign, entries: SortEntry[]): number {
  for (const entry of entries) {
    const result = compareField(a, b, DATA_COLUMNS[entry.colIndex].field, entry.direction);
    if (result !== 0) return result;
  }
  return 0;
}

export function drawSortArrow(ctx: CanvasRenderingContext2D, x: number, y: number, direction: "asc" | "desc", color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  if (direction === "asc") {
    ctx.moveTo(x, y + ARROW_HALF_HEIGHT);
    ctx.lineTo(x + ARROW_HALF_WIDTH, y - ARROW_HALF_HEIGHT);
    ctx.lineTo(x + ARROW_HALF_WIDTH * 2, y + ARROW_HALF_HEIGHT);
  } else {
    ctx.moveTo(x, y - ARROW_HALF_HEIGHT);
    ctx.lineTo(x + ARROW_HALF_WIDTH, y + ARROW_HALF_HEIGHT);
    ctx.lineTo(x + ARROW_HALF_WIDTH * 2, y - ARROW_HALF_HEIGHT);
  }
  ctx.closePath();
  ctx.fill();
}

export function getArrowPosition(rect: { x: number; y: number; width: number; height: number }) {
  return {
    x: rect.x + rect.width - ARROW_RIGHT_PADDING,
    y: rect.y + rect.height / 2,
  };
}
