export const MAX_HEALTH = 100;
export const DECAY_PER_HOUR = 1;
export const EXERCISE_BOOST = 33;

function clamp(value: number): number {
  return Math.max(0, Math.min(MAX_HEALTH, value));
}

/** Current health after decaying 1%/hour from the last update, given the current time. */
export function getCurrentHealth(health: number, updatedAt: string | null, now: number): number {
  if (updatedAt === null) return MAX_HEALTH;
  const hoursSince = (now - new Date(updatedAt).getTime()) / (1000 * 60 * 60);
  return clamp(health - hoursSince * DECAY_PER_HOUR);
}

/** Health after applying the decay up to now, then adding an exercise boost. */
export function applyExerciseBoost(health: number, updatedAt: string | null, now: number): number {
  return clamp(getCurrentHealth(health, updatedAt, now) + EXERCISE_BOOST);
}
