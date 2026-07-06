import type { HabitEntry } from "./types";

type EntryDetails = Pick<HabitEntry, "sets" | "reps" | "weight" | "durationMinutes">;

/** Compact string like "3×8 · 135 lb" from whichever fields are present. */
export function formatHabitDetails(entry: EntryDetails): string {
  const parts: string[] = [];
  if (entry.sets || entry.reps) parts.push(`${entry.sets ?? "?"}×${entry.reps ?? "?"}`);
  if (entry.weight) parts.push(`${entry.weight} lb`);
  if (entry.durationMinutes) parts.push(`${entry.durationMinutes} min`);
  return parts.join(" · ");
}
