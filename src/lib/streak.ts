import { addDaysISO, todayISO } from "./date";
import type { LogsByDate } from "./types";

function hasFoodLog(logs: LogsByDate, iso: string): boolean {
  return (logs[iso]?.entries.length ?? 0) > 0;
}

/**
 * ISO dates making up the current active streak, newest first. Today doesn't need to be logged yet
 * to keep the streak alive — it's simply excluded until logged — but any other missed day breaks the
 * chain, so the walk stops there.
 */
export function getStreakDates(logs: LogsByDate, today: string = todayISO()): string[] {
  const dates: string[] = [];
  let cursor = hasFoodLog(logs, today) ? today : addDaysISO(today, -1);
  while (hasFoodLog(logs, cursor)) {
    dates.push(cursor);
    cursor = addDaysISO(cursor, -1);
  }
  return dates;
}

/** Length of the current active streak — see getStreakDates. */
export function computeCurrentStreak(logs: LogsByDate, today: string = todayISO()): number {
  return getStreakDates(logs, today).length;
}
