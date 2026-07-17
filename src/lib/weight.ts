import type { LogsByDate } from "./types";

export interface WeightPoint {
  date: string;
  weightLbs: number;
  /** Trailing average over this point and up to the previous ROLLING_WINDOW-1 logged points — smooths day-to-day noise (water, sodium, etc). */
  trendLbs: number;
}

const ROLLING_WINDOW = 7;

/** All logged weight entries, oldest first, each with a trailing rolling-average trend value. */
export function getWeightHistory(logs: LogsByDate): WeightPoint[] {
  const entries = Object.values(logs)
    .filter((log): log is typeof log & { weightLbs: number } => log.weightLbs !== undefined)
    .map((log) => ({ date: log.date, weightLbs: log.weightLbs }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return entries.map((entry, i) => {
    const window = entries.slice(Math.max(0, i - ROLLING_WINDOW + 1), i + 1);
    const trendLbs = window.reduce((sum, e) => sum + e.weightLbs, 0) / window.length;
    return { ...entry, trendLbs };
  });
}

/** Net change (lbs) between the oldest and newest trend value — negative means the trend is down. */
export function getTrendChangeLbs(history: WeightPoint[]): number | null {
  if (history.length < 2) return null;
  return history[history.length - 1].trendLbs - history[0].trendLbs;
}
