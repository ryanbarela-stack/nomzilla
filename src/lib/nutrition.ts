import type { FoodEntry, Goals, Macros } from "../types";

export function sumMacros(entries: FoodEntry[]): Macros {
  return entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

/** Score a "band" metric (want to land near the goal, over or under both hurt). */
function bandScore(actual: number, goal: number, tolerance = 0.1): number {
  if (goal <= 0) return 100;
  const ratio = actual / goal;
  const lower = 1 - tolerance;
  const upper = 1 + tolerance;
  if (ratio >= lower && ratio <= upper) return 100;
  const dist = ratio < lower ? lower - ratio : ratio - upper;
  // fully misses at 60% away from the tolerated band
  const score = 100 * (1 - dist / 0.6);
  return Math.max(0, Math.min(100, score));
}

/** Score a "floor" metric (goal is a minimum target, more is fine up to a point). */
function floorScore(actual: number, goal: number): number {
  if (goal <= 0) return 100;
  const ratio = actual / goal;
  if (ratio >= 1) {
    // small penalty for going way overboard (>170%)
    if (ratio <= 1.7) return 100;
    const over = ratio - 1.7;
    return Math.max(60, 100 - over * 80);
  }
  return Math.max(0, ratio * 100);
}

export interface DayScoreBreakdown {
  overall: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function scoreDay(actual: Macros, goals: Goals): DayScoreBreakdown {
  const calories = bandScore(actual.calories, goals.calories, 0.1);
  const protein = floorScore(actual.protein, goals.protein);
  const carbs = bandScore(actual.carbs, goals.carbs, 0.2);
  const fat = bandScore(actual.fat, goals.fat, 0.2);
  const overall = calories * 0.4 + protein * 0.3 + carbs * 0.15 + fat * 0.15;
  return { overall, calories, protein, carbs, fat };
}

export function pct(actual: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.round((actual / goal) * 100);
}
