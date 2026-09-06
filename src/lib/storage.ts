import { DEFAULT_APP_DATA, type AppData } from "../types";

const STORAGE_KEY = "nomzilla:data:v1";

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_APP_DATA);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_APP_DATA),
      ...parsed,
      goals: { ...DEFAULT_APP_DATA.goals, ...parsed.goals },
      kaiju: { ...DEFAULT_APP_DATA.kaiju, ...parsed.kaiju },
    };
  } catch {
    return structuredClone(DEFAULT_APP_DATA);
  }
}

export function saveAppData(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable/full - ignore, in-memory state still works for the session
  }
}
