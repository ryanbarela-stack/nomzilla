import { useEffect, useMemo, useState } from "react";
import { ChampionHeader } from "./components/ChampionHeader";
import { DayPanel } from "./components/DayPanel";
import { AboutModal } from "./components/AboutModal";
import { Calendar } from "./components/Calendar";
import { loadLogs, saveLogs, loadSettings, saveSettings } from "./lib/storage";
import { todayISO, fromISODate } from "./lib/date";
import { getCurrentHealth, applyExerciseBoost, isManaChargeReady } from "./lib/championHealth";
import { computeAttributeCount, getAttributeLevel } from "./lib/attributes";
import type { AttributeId, HabitEntry, LogsByDate, Settings } from "./lib/types";

function App() {
  const [logs, setLogs] = useState<LogsByDate>(() => loadLogs());
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [selectedDate, setSelectedDate] = useState<string>(() => todayISO());
  const [viewDate, setViewDate] = useState<Date>(() => fromISODate(todayISO()));
  const [aboutOpen, setAboutOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => saveLogs(logs), [logs]);
  useEffect(() => saveSettings(settings), [settings]);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const championHealth = useMemo(
    () => getCurrentHealth(settings.championHealth, settings.championHealthUpdatedAt, settings.manaCharges, now),
    [settings.championHealth, settings.championHealthUpdatedAt, settings.manaCharges, now],
  );
  const selectedLog = logs[selectedDate] ?? { date: selectedDate, entries: [] };

  function addEntry(name: string, calories: number) {
    setLogs((prev) => {
      const existing = prev[selectedDate] ?? { date: selectedDate, entries: [] };
      return {
        ...prev,
        [selectedDate]: {
          ...existing,
          entries: [...existing.entries, { id: crypto.randomUUID(), name, calories }],
        },
      };
    });
  }

  function removeEntry(id: string) {
    setLogs((prev) => {
      const existing = prev[selectedDate];
      if (!existing) return prev;
      return {
        ...prev,
        [selectedDate]: { ...existing, entries: existing.entries.filter((e) => e.id !== id) },
      };
    });
  }

  function addHabitEntry(entry: Omit<HabitEntry, "id">) {
    setLogs((prev) => {
      const existing = prev[selectedDate] ?? { date: selectedDate, entries: [] };
      return {
        ...prev,
        [selectedDate]: {
          ...existing,
          habitEntries: [...(existing.habitEntries ?? []), { id: crypto.randomUUID(), ...entry }],
        },
      };
    });

    if (entry.attributeId === "strength" || entry.attributeId === "endurance") {
      const boostedAt = Date.now();
      setSettings((prev) => ({
        ...prev,
        championHealth: applyExerciseBoost(prev.championHealth, prev.championHealthUpdatedAt, prev.manaCharges, boostedAt),
        championHealthUpdatedAt: new Date(boostedAt).toISOString(),
      }));
    }
  }

  function removeHabitEntry(id: string) {
    setLogs((prev) => {
      const existing = prev[selectedDate];
      if (!existing) return prev;
      return {
        ...prev,
        [selectedDate]: { ...existing, habitEntries: (existing.habitEntries ?? []).filter((e) => e.id !== id) },
      };
    });
  }

  function changeTarget(value: number) {
    setSettings((prev) => ({ ...prev, targetCalories: value }));
  }

  function changeClass(id: string) {
    setSettings((prev) => ({ ...prev, classId: id }));
  }

  function changeTitle(id: AttributeId | null) {
    setSettings((prev) => ({ ...prev, titleAttributeId: id }));
  }

  function activateMana(index: number) {
    setSettings((prev) => {
      if (!isManaChargeReady(prev.manaCharges[index], Date.now())) return prev;
      const manaCharges = [...prev.manaCharges];
      manaCharges[index] = new Date().toISOString();
      return { ...prev, manaCharges };
    });
  }

  function acknowledgeAttributeLevel(id: AttributeId) {
    const count = computeAttributeCount(logs, id);
    const level = getAttributeLevel(count);
    setSettings((prev) => ({
      ...prev,
      seenAttributeLevels: { ...prev.seenAttributeLevels, [id]: level },
    }));
  }

  function changeMonth(delta: number) {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  function jumpToday() {
    const iso = todayISO();
    setSelectedDate(iso);
    setViewDate(fromISODate(iso));
  }

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col gap-4">
      <div className="relative text-center">
        <h1 className="text-2xl font-pixel font-bold tracking-wide text-emerald-400">Nomzilla</h1>
        <p className="text-sm text-gray-500">Teach your Champion.</p>
        <button
          onClick={() => setAboutOpen(true)}
          aria-label="How Nomzilla works"
          title="How Nomzilla works"
          className="absolute right-0 top-0 text-gray-500 hover:text-emerald-400 p-1"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
          </svg>
        </button>
      </div>

      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}

      <ChampionHeader
        health={championHealth}
        manaCharges={settings.manaCharges}
        now={now}
        logs={logs}
        titleAttributeId={settings.titleAttributeId}
        classId={settings.classId}
        seenAttributeLevels={settings.seenAttributeLevels}
        onChangeTitle={changeTitle}
        onChangeClass={changeClass}
        onAcknowledgeAttributeLevel={acknowledgeAttributeLevel}
        onActivateMana={activateMana}
      />

      <DayPanel
        log={selectedLog}
        logs={logs}
        target={settings.targetCalories}
        onAddEntry={addEntry}
        onRemoveEntry={removeEntry}
        onAddHabitEntry={addHabitEntry}
        onRemoveHabitEntry={removeHabitEntry}
        onJumpToday={jumpToday}
        onChangeTarget={changeTarget}
      />

      <Calendar
        year={viewDate.getFullYear()}
        month={viewDate.getMonth()}
        logs={logs}
        target={settings.targetCalories}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onChangeMonth={changeMonth}
      />
    </div>
  );
}

export default App;
