import { addDaysISO } from "./date";
import type { LogsByDate } from "./types";

function hasExerciseLog(logs: LogsByDate, date: string): boolean {
  const log = logs[date];
  return !!log && (log.habitEntries ?? []).length > 0;
}

/**
 * Consecutive logged days leading up to today. Today doesn't need to be
 * logged yet to keep the streak alive (the day isn't over), but any other
 * gap breaks it. Mirrors computeStreak in streak.ts, but for exercise logs.
 */
export function computeExerciseStreak(logs: LogsByDate, todayIso: string): number {
  let streak = 0;
  let cursor = todayIso;
  if (!hasExerciseLog(logs, cursor)) {
    cursor = addDaysISO(cursor, -1);
  }
  while (hasExerciseLog(logs, cursor)) {
    streak++;
    cursor = addDaysISO(cursor, -1);
  }
  return streak;
}

export function computeTotalExerciseDaysLogged(logs: LogsByDate): number {
  return Object.values(logs).filter((log) => (log.habitEntries ?? []).length > 0).length;
}

export interface ChampionStage {
  index: number;
  name: string;
  minStreak: number;
}

// Placeholder stage names/art until champion sprites exist.
export const CHAMPION_STAGES: ChampionStage[] = [
  { index: 0, name: "Recruit", minStreak: 0 },
  { index: 1, name: "Trainee", minStreak: 7 },
  { index: 2, name: "Champion", minStreak: 30 },
];

export function getChampionStageForStreak(streak: number): ChampionStage {
  let current = CHAMPION_STAGES[0];
  for (const stage of CHAMPION_STAGES) {
    if (streak >= stage.minStreak) current = stage;
  }
  return current;
}

export function getNextChampionStage(stage: ChampionStage): ChampionStage | null {
  return CHAMPION_STAGES[stage.index + 1] ?? null;
}
