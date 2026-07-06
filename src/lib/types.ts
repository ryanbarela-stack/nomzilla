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
}

export type LogsByDate = Record<string, DayLog>;
