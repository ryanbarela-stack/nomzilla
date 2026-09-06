export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodEntry extends Macros {
  id: string;
  name: string;
  /** ms timestamp when logged */
  loggedAt: number;
}

export interface Goals extends Macros {}

export const DEFAULT_GOALS: Goals = {
  calories: 2200,
  protein: 150,
  carbs: 220,
  fat: 70,
};

/** date key format: YYYY-MM-DD (local) */
export type DateKey = string;

export interface DayRecord {
  date: DateKey;
  entries: FoodEntry[];
}

export interface KaijuState {
  totalXp: number;
  streak: number;
  bestStreak: number;
  lastScoredDate: DateKey | null;
}

export interface AppData {
  goals: Goals;
  days: Record<DateKey, DayRecord>;
  kaiju: KaijuState;
  kaijuName: string;
}

export const DEFAULT_APP_DATA: AppData = {
  goals: DEFAULT_GOALS,
  days: {},
  kaiju: {
    totalXp: 0,
    streak: 0,
    bestStreak: 0,
    lastScoredDate: null,
  },
  kaijuName: "Chomp",
};
