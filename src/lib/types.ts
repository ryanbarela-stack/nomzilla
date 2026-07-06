export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
}

export type AttributeId = "strength" | "endurance" | "intelligence" | "wisdom";

export interface HabitEntry {
  id: string;
  description: string;
  attributeId: AttributeId;
  /** Optional structured details for exercise activities — all supplement the free-text description. */
  sets?: number;
  reps?: number;
  /** Weight lifted, in lbs. Mutually exclusive with durationMinutes in the UI, but both are just optional data. */
  weight?: number;
  /** Duration of a timed activity, in minutes. */
  durationMinutes?: number;
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
  /** Highest attribute tier index already shown a tier-up banner for, per attribute. */
  seenAttributeTiers: Record<string, number>;
  /** Manually chosen attribute whose title to display, or null to auto-pick the highest-tier one. */
  titleAttributeId: AttributeId | null;
  /** Highest champion stage index already shown a stage-up banner for. */
  seenChampionStageIndex: number;
}

export type LogsByDate = Record<string, DayLog>;
