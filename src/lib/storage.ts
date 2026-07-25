import { MANA_CHARGE_COUNT } from "./championHealth";
import { createInitialMonsterState } from "./monsterEncounter";
import type { LogsByDate, MonsterState, Settings } from "./types";

const LOGS_KEY = "nomzilla:logs";
const SETTINGS_KEY = "nomzilla:settings";
const MONSTER_KEY = "nomzilla:monster";

export const DEFAULT_SETTINGS: Settings = {
  seenAttributeLevels: {},
  titleAttributeId: null,
  classId: null,
  championHealth: 100,
  championHealthUpdatedAt: null,
  manaCharges: Array<string | null>(MANA_CHARGE_COUNT).fill(null),
  actionPoints: 0,
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

export function loadMonsterState(): MonsterState {
  try {
    const raw = localStorage.getItem(MONSTER_KEY);
    return raw ? (JSON.parse(raw) as MonsterState) : createInitialMonsterState();
  } catch {
    return createInitialMonsterState();
  }
}

export function saveMonsterState(state: MonsterState): void {
  localStorage.setItem(MONSTER_KEY, JSON.stringify(state));
}
