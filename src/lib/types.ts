export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
}

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
  entries: FoodEntry[];
  /** Optional — absent on days with no habits logged yet. */
  habitEntries?: HabitEntry[];
}

export interface Settings {
  targetCalories: number;
  /** Chosen evolution path ("titan" | "emperor" | "quetzacoatl" | "mothman"), or null before stage 1 (Baby) is reached. */
  pathId: string | null;
  borderId: string;
  /** Highest level the player has already been shown a level-up banner for. */
  seenLevelIndex: number;
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
}

export type LogsByDate = Record<string, DayLog>;
