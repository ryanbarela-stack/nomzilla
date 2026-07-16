import type { FoodEntry } from "./types";

/** Compact string like "P 32g" for an entry's logged protein, or null if none. */
export function formatProtein(entry: Pick<FoodEntry, "protein">): string | null {
  return entry.protein !== undefined ? `P ${entry.protein}g` : null;
}
