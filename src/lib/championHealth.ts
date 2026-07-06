export const MAX_HEALTH = 100;
export const DECAY_PER_HOUR = 1;
export const EXERCISE_BOOST = 33;
export const MANA_CHARGE_COUNT = 3;
export const PAUSE_HOURS = 24;

const PAUSE_MS = PAUSE_HOURS * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

export type ManaCharges = (string | null)[];

function clamp(value: number): number {
  return Math.max(0, Math.min(MAX_HEALTH, value));
}

/** Hours between fromMs and toMs that are NOT covered by an active mana pause window. */
function unpausedHoursBetween(fromMs: number, toMs: number, manaCharges: ManaCharges): number {
  if (toMs <= fromMs) return 0;

  const clipped = manaCharges
    .filter((ts): ts is string => ts !== null)
    .map((ts) => new Date(ts).getTime())
    .map((start): [number, number] => [Math.max(start, fromMs), Math.min(start + PAUSE_MS, toMs)])
    .filter(([s, e]) => e > s)
    .sort((a, b) => a[0] - b[0]);

  const merged: [number, number][] = [];
  for (const [s, e] of clipped) {
    const last = merged[merged.length - 1];
    if (last && s <= last[1]) last[1] = Math.max(last[1], e);
    else merged.push([s, e]);
  }
  const pausedMs = merged.reduce((sum, [s, e]) => sum + (e - s), 0);
  return (toMs - fromMs - pausedMs) / HOUR_MS;
}

/** Current health after decaying 1%/hour since the last update, skipping any mana-paused hours. */
export function getCurrentHealth(
  health: number,
  updatedAt: string | null,
  manaCharges: ManaCharges,
  now: number,
): number {
  if (updatedAt === null) return MAX_HEALTH;
  const hours = unpausedHoursBetween(new Date(updatedAt).getTime(), now, manaCharges);
  return clamp(health - hours * DECAY_PER_HOUR);
}

/** Health after applying decay up to now, then adding an exercise boost. */
export function applyExerciseBoost(
  health: number,
  updatedAt: string | null,
  manaCharges: ManaCharges,
  now: number,
): number {
  return clamp(getCurrentHealth(health, updatedAt, manaCharges, now) + EXERCISE_BOOST);
}

/** A mana charge is ready to use once 24 hours have passed since it was last activated. */
export function isManaChargeReady(activatedAt: string | null, now: number): boolean {
  return activatedAt === null || now - new Date(activatedAt).getTime() >= PAUSE_MS;
}

/** Whether health decay is currently paused by any active mana charge. */
export function isHealthPaused(manaCharges: ManaCharges, now: number): boolean {
  return manaCharges.some((ts) => ts !== null && now - new Date(ts).getTime() < PAUSE_MS);
}
