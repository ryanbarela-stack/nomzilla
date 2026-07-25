import { getRandomMonster } from "./monsters";
import type { MonsterState } from "./types";

export const MAX_ACTION_POINTS = 5;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * A fresh player's first monster spawns immediately (offset 0 into a cycle that starts now),
 * giving an instant hook. Every cycle after that spawns at a random point in its week.
 */
export function createInitialMonsterState(now: number = Date.now()): MonsterState {
  return {
    weekAnchor: new Date(now).toISOString(),
    spawnOffsetMs: 0,
    encounter: null,
    spawnedThisCycle: false,
    monstersSlain: 0,
  };
}

/**
 * Advances the weekly spawn cycle to `now`: rolls over any fully-elapsed weeks (rerolling next
 * week's random spawn moment and clearing any undefeated monster), then spawns this week's
 * monster once its spawn moment has passed — but only once per cycle, so defeating it early
 * doesn't trigger an immediate respawn. Returns the same object if nothing changed.
 */
export function advanceMonsterState(state: MonsterState, now: number): MonsterState {
  let anchorMs = new Date(state.weekAnchor).getTime();
  let spawnOffsetMs = state.spawnOffsetMs;
  let encounter = state.encounter;
  let spawnedThisCycle = state.spawnedThisCycle;
  let changed = false;

  while (now >= anchorMs + WEEK_MS) {
    anchorMs += WEEK_MS;
    spawnOffsetMs = Math.floor(Math.random() * WEEK_MS);
    encounter = null;
    spawnedThisCycle = false;
    changed = true;
  }

  if (!spawnedThisCycle && now >= anchorMs + spawnOffsetMs) {
    const monster = getRandomMonster();
    encounter = { monsterId: monster.id, currentHealth: monster.maxHealth, spawnedAt: new Date(anchorMs + spawnOffsetMs).toISOString() };
    spawnedThisCycle = true;
    changed = true;
  }

  if (!changed) return state;
  return { ...state, weekAnchor: new Date(anchorMs).toISOString(), spawnOffsetMs, encounter, spawnedThisCycle };
}

/** Applies damage to the active monster, clearing the encounter and crediting a kill if it drops to 0. */
export function applyDamage(state: MonsterState, damage: number): MonsterState {
  if (!state.encounter) return state;
  const currentHealth = Math.max(0, state.encounter.currentHealth - damage);
  if (currentHealth <= 0) {
    return { ...state, encounter: null, monstersSlain: state.monstersSlain + 1 };
  }
  return { ...state, encounter: { ...state.encounter, currentHealth } };
}
