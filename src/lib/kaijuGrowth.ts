export interface KaijuStage {
  id: number;
  name: string;
  minXp: number;
  blurb: string;
}

export const STAGES: KaijuStage[] = [
  { id: 0, name: "Egg", minXp: 0, blurb: "Something is stirring inside..." },
  { id: 1, name: "Hatchling", minXp: 100, blurb: "It has hatched! Tiny, but hungry." },
  { id: 2, name: "Juvenile", minXp: 350, blurb: "Spikes are coming in. It's getting stronger." },
  { id: 3, name: "Adult", minXp: 800, blurb: "A full-grown kaiju, tough and towering." },
  { id: 4, name: "Titan", minXp: 1600, blurb: "Colossal. The ground shakes when it moves." },
  { id: 5, name: "Kaiju God", minXp: 3000, blurb: "Legendary. Radiating pure power." },
];

export function stageForXp(xp: number): KaijuStage {
  let current = STAGES[0];
  for (const s of STAGES) {
    if (xp >= s.minXp) current = s;
  }
  return current;
}

export function nextStage(stage: KaijuStage): KaijuStage | null {
  return STAGES[stage.id + 1] ?? null;
}

export function progressToNextStage(xp: number): { current: KaijuStage; next: KaijuStage | null; pct: number } {
  const current = stageForXp(xp);
  const next = nextStage(current);
  if (!next) return { current, next: null, pct: 100 };
  const span = next.minXp - current.minXp;
  const into = xp - current.minXp;
  return { current, next, pct: Math.max(0, Math.min(100, (into / span) * 100)) };
}

/** ON_GOAL threshold: a day scoring at/above this counts toward the streak. */
export const ON_GOAL_THRESHOLD = 70;
/** Below this, the kaiju loses a little ground instead of gaining. */
export const REGRESSION_THRESHOLD = 50;

export interface DayOutcome {
  score: number;
  xpDelta: number;
  streakContinues: boolean;
}

export function computeDayOutcome(score: number, currentStreak: number): DayOutcome {
  if (score >= ON_GOAL_THRESHOLD) {
    const streakBonus = Math.min(currentStreak + 1, 14) * 2;
    return { score, xpDelta: Math.round(score + streakBonus), streakContinues: true };
  }
  if (score >= REGRESSION_THRESHOLD) {
    return { score, xpDelta: Math.round(score * 0.4), streakContinues: false };
  }
  return { score, xpDelta: -Math.round((REGRESSION_THRESHOLD - score) * 0.6), streakContinues: false };
}

/** A missed day (no food logged at all) — streak breaks, no xp change. */
export const MISSED_DAY_OUTCOME: DayOutcome = { score: 0, xpDelta: 0, streakContinues: false };
