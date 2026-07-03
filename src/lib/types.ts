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
}

export type LogsByDate = Record<string, DayLog>;
