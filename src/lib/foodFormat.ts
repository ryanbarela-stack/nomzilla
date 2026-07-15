import type { FoodMacros } from "./types";

/** Compact string like "P 32g · C 48g · F 12g" from whichever macros are present, or null if none. */
export function formatMacros(entry: FoodMacros): string | null {
  const parts: string[] = [];
  if (entry.protein !== undefined) parts.push(`P ${entry.protein}g`);
  if (entry.carbs !== undefined) parts.push(`C ${entry.carbs}g`);
  if (entry.fat !== undefined) parts.push(`F ${entry.fat}g`);
  return parts.length > 0 ? parts.join(" · ") : null;
}
