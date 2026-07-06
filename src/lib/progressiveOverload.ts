import type { HabitEntry, LogsByDate } from "./types";

export const WEIGHT_INCREMENT = 5;
export const DURATION_INCREMENT = 5;

export interface ExerciseHistoryEntry extends HabitEntry {
  date: string;
}

function normalize(description: string): string {
  return description.trim().toLowerCase();
}

/** The most recent logged entry (any day) whose description matches, or null if none. */
export function findLastExerciseEntry(logs: LogsByDate, description: string): ExerciseHistoryEntry | null {
  const target = normalize(description);
  if (!target) return null;

  let best: ExerciseHistoryEntry | null = null;
  for (const [date, log] of Object.entries(logs)) {
    for (const entry of log.habitEntries ?? []) {
      if (normalize(entry.description) !== target) continue;
      if (!best || date > best.date) best = { ...entry, date };
    }
  }
  return best;
}

export interface OverloadSuggestion {
  sets?: number;
  reps?: number;
  weight?: number;
  durationMinutes?: number;
}

/** A small nudge up from the last logged entry — same sets/reps, a bit more weight or time. */
export function getOverloadSuggestion(last: HabitEntry): OverloadSuggestion {
  return {
    sets: last.sets,
    reps: last.reps,
    weight: last.weight !== undefined ? last.weight + WEIGHT_INCREMENT : undefined,
    durationMinutes: last.durationMinutes !== undefined ? last.durationMinutes + DURATION_INCREMENT : undefined,
  };
}
