import { addDaysISO } from "./date";
import type { LogsByDate } from "./types";

function hasLog(logs: LogsByDate, date: string): boolean {
  const log = logs[date];
  return !!log && log.entries.length > 0;
}

/**
 * Consecutive logged days leading up to today. Today doesn't need to be
 * logged yet to keep the streak alive (the day isn't over), but any other
 * gap breaks it.
 */
export function computeStreak(logs: LogsByDate, todayIso: string): number {
  let streak = 0;
  let cursor = todayIso;
  if (!hasLog(logs, cursor)) {
    cursor = addDaysISO(cursor, -1);
  }
  while (hasLog(logs, cursor)) {
    streak++;
    cursor = addDaysISO(cursor, -1);
  }
  return streak;
}

export function computeTotalDaysLogged(logs: LogsByDate): number {
  return Object.values(logs).filter((log) => log.entries.length > 0).length;
}

export interface GrowthStage {
  index: number;
  name: string;
  minStreak: number;
}

// Names for stage 2+ are placeholders — the displayed name once a path is chosen
// comes from lib/paths.ts (getStageDisplayName / getStagePreviewName).
export const GROWTH_STAGES: GrowthStage[] = [
  { index: 0, name: "Egg", minStreak: 0 },
  { index: 1, name: "Cracking Egg", minStreak: 3 },
  { index: 2, name: "Evolving", minStreak: 14 },
  { index: 3, name: "Ascending", minStreak: 30 },
  { index: 4, name: "Apex Form", minStreak: 60 },
];

export function getStageForStreak(streak: number): GrowthStage {
  let current = GROWTH_STAGES[0];
  for (const stage of GROWTH_STAGES) {
    if (streak >= stage.minStreak) current = stage;
  }
  return current;
}

export function getNextStage(stage: GrowthStage): GrowthStage | null {
  return GROWTH_STAGES[stage.index + 1] ?? null;
}
