export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
}

export interface HabitFlags {
  strength: boolean;
  endurance: boolean;
  intelligence: boolean;
  wisdom: boolean;
}

export interface DayLog {
  date: string; // ISO yyyy-mm-dd
  entries: FoodEntry[];
  /** Optional — absent on logs saved before habit tracking existed. */
  habits?: HabitFlags;
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
}

export type LogsByDate = Record<string, DayLog>;
