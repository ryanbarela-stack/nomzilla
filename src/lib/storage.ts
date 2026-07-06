import { MANA_CHARGE_COUNT } from "./championHealth";
import type { LogsByDate, Settings } from "./types";

const LOGS_KEY = "nomzilla:logs";
const SETTINGS_KEY = "nomzilla:settings";

export const DEFAULT_SETTINGS: Settings = {
  targetCalories: 2000,
  pathId: null,
  borderId: "default",
  seenLevelIndex: 0,
  seenAttributeTiers: {},
  titleAttributeId: null,
  classId: null,
  championHealth: 100,
  championHealthUpdatedAt: null,
  manaCharges: Array<string | null>(MANA_CHARGE_COUNT).fill(null),
};

export function loadLogs(): LogsByDate {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? (JSON.parse(raw) as LogsByDate) : {};
  } catch {
    return {};
  }
}

export function saveLogs(logs: LogsByDate): void {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
