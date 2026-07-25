export type AttributeId = "strength" | "endurance" | "intelligence" | "wisdom";

export interface SetDetail {
  reps?: number;
  /** Weight lifted for this set, in lbs. */
  weight?: number;
}

export interface HabitEntry {
  id: string;
  description: string;
  attributeId: AttributeId;
  /** Per-set reps/weight, one entry per set actually logged (reps and/or weight can change set to set). */
  setDetails?: SetDetail[];
  /** Duration of a timed activity, in minutes. */
  durationMinutes?: number;
  /**
   * @deprecated Superseded by setDetails/durationMinutes. Kept so entries logged before that change
   * still render — new entries never set these.
   */
  sets?: number;
  /** @deprecated See sets. */
  reps?: number;
  /** @deprecated See sets. */
  weight?: number;
}

export interface DayLog {
  date: string; // ISO yyyy-mm-dd
  /** Optional — absent on days with no habits logged yet. */
  habitEntries?: HabitEntry[];
  /** Body weight logged for this day, in lbs. */
  weightLbs?: number;
}

export interface Settings {
  /** Highest attribute level already shown a level-up banner for, per attribute. */
  seenAttributeLevels: Record<string, number>;
  /** Manually chosen attribute whose title to display, or null to auto-pick the highest-tier one. */
  titleAttributeId: AttributeId | null;
  /** Chosen champion class ("warrior" | "cleric" | "monk" | "wizard" | "barbarian" | "rogue"), or null before one is picked. */
  classId: string | null;
  /** Champion health as of championHealthUpdatedAt, 0-100. Decays 1%/hour from that timestamp. */
  championHealth: number;
  /** ISO timestamp championHealth was last set (by decay-application or a boost), or null if never set. */
  championHealthUpdatedAt: string | null;
  /** ISO timestamp each mana charge was last activated (pausing health decay for 24h from then), or null if unused. */
  manaCharges: (string | null)[];
  /** Current action points, spent to attack the active monster. Capped at MAX_ACTION_POINTS. */
  actionPoints: number;
}

export type LogsByDate = Record<string, DayLog>;

export interface MonsterEncounter {
  monsterId: string;
  currentHealth: number;
  /** ISO timestamp the monster spawned. */
  spawnedAt: string;
}

export interface MonsterState {
  /** ISO timestamp marking the start of the current weekly spawn cycle. */
  weekAnchor: string;
  /** Random offset (ms) into the current cycle when this week's monster spawns. */
  spawnOffsetMs: number;
  /** The currently active monster, or null if none is up right now (not spawned yet, or defeated). */
  encounter: MonsterEncounter | null;
  /** Whether this cycle's monster has already spawned — prevents respawning after a defeat until next week. */
  spawnedThisCycle: boolean;
  /** Lifetime count of monsters defeated. */
  monstersSlain: number;
  /** Levels subtracted from each attribute's effective level, accrued when a monster expires undefeated. */
  attributePenalties: Record<string, number>;
}
