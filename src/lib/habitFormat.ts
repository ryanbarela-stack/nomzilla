import type { HabitEntry, SetDetail } from "./types";

type EntryDetails = Pick<HabitEntry, "setDetails" | "sets" | "reps" | "weight" | "durationMinutes">;

function formatSetDetail(set: SetDetail): string {
  if (set.reps !== undefined && set.weight !== undefined) return `${set.reps}×${set.weight}lb`;
  if (set.reps !== undefined) return `${set.reps} reps`;
  if (set.weight !== undefined) return `${set.weight}lb`;
  return "";
}

/** Compact string like "8×145lb, 6×155lb · 20 min" from whichever fields are present. */
export function formatHabitDetails(entry: EntryDetails): string {
  const parts: string[] = [];
  if (entry.setDetails && entry.setDetails.length > 0) {
    const sets = entry.setDetails.map(formatSetDetail).filter(Boolean).join(", ");
    if (sets) parts.push(sets);
  } else if (entry.sets || entry.reps || entry.weight) {
    if (entry.sets || entry.reps) parts.push(`${entry.sets ?? "?"}×${entry.reps ?? "?"}`);
    if (entry.weight) parts.push(`${entry.weight} lb`);
  }
  if (entry.durationMinutes) parts.push(`${entry.durationMinutes} min`);
  return parts.join(" · ");
}
