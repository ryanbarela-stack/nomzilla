export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
}

export interface DayLog {
  date: string; // ISO yyyy-mm-dd
  entries: FoodEntry[];
}

export interface Settings {
  targetCalories: number;
  /** Chosen evolution path ("titan" | "emperor" | "quetzacoatl" | "mothman"), or null before stage 1 (Baby) is reached. */
  pathId: string | null;
  borderId: string;
  /** Highest level the player has already been shown a level-up banner for. */
  seenLevelIndex: number;
}

export type LogsByDate = Record<string, DayLog>;
