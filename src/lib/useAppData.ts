import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppData, FoodEntry, Goals } from "../types";
import { loadAppData, saveAppData } from "./storage";
import { addDays, todayKey } from "./date";
import { scoreDay, sumMacros } from "./nutrition";
import { computeDayOutcome, MISSED_DAY_OUTCOME } from "./kaijuGrowth";

const MAX_BACKFILL_DAYS = 90;

/** Score and apply XP/streak for any past days that haven't been finalized yet. */
function reconcile(data: AppData): AppData {
  const today = todayKey();
  const next: AppData = structuredClone(data);

  if (!next.kaiju.lastScoredDate) {
    next.kaiju.lastScoredDate = addDays(today, -1);
    return next;
  }

  let cursor = addDays(next.kaiju.lastScoredDate, 1);
  let guard = 0;
  while (cursor < today && guard < MAX_BACKFILL_DAYS) {
    const record = next.days[cursor];
    const outcome =
      record && record.entries.length > 0
        ? computeDayOutcome(scoreDay(sumMacros(record.entries), next.goals).overall, next.kaiju.streak)
        : MISSED_DAY_OUTCOME;

    next.kaiju.totalXp = Math.max(0, next.kaiju.totalXp + outcome.xpDelta);
    next.kaiju.streak = outcome.streakContinues ? next.kaiju.streak + 1 : 0;
    next.kaiju.bestStreak = Math.max(next.kaiju.bestStreak, next.kaiju.streak);
    next.kaiju.lastScoredDate = cursor;

    cursor = addDays(cursor, 1);
    guard += 1;
  }

  if (guard >= MAX_BACKFILL_DAYS) {
    next.kaiju.streak = 0;
    next.kaiju.lastScoredDate = addDays(today, -1);
  }

  return next;
}

export function useAppData() {
  const [data, setData] = useState<AppData>(() => reconcile(loadAppData()));

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const today = todayKey();
  const todayRecord = data.days[today];
  const todayEntries = useMemo(() => todayRecord?.entries ?? [], [todayRecord]);

  const addEntry = useCallback((entry: Omit<FoodEntry, "id" | "loggedAt">) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const key = todayKey();
      const record = next.days[key] ?? { date: key, entries: [] };
      record.entries.push({
        ...entry,
        id: crypto.randomUUID(),
        loggedAt: Date.now(),
      });
      next.days[key] = record;
      return next;
    });
  }, []);

  const removeEntry = useCallback((id: string) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const key = todayKey();
      const record = next.days[key];
      if (!record) return prev;
      record.entries = record.entries.filter((e) => e.id !== id);
      return next;
    });
  }, []);

  const updateGoals = useCallback((goals: Goals) => {
    setData((prev) => ({ ...prev, goals }));
  }, []);

  const renameKaiju = useCallback((name: string) => {
    setData((prev) => ({ ...prev, kaijuName: name }));
  }, []);

  const resetAll = useCallback(() => {
    setData((prev) => ({
      goals: prev.goals,
      days: {},
      kaiju: { totalXp: 0, streak: 0, bestStreak: 0, lastScoredDate: addDays(todayKey(), -1) },
      kaijuName: prev.kaijuName,
    }));
  }, []);

  return {
    data,
    today,
    todayEntries,
    addEntry,
    removeEntry,
    updateGoals,
    renameKaiju,
    resetAll,
  };
}
