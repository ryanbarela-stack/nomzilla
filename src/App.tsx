import { useEffect, useMemo, useState } from "react";
import { KaijuHeader } from "./components/KaijuHeader";
import { DayPanel } from "./components/DayPanel";
import { Calendar } from "./components/Calendar";
import { loadLogs, saveLogs, loadSettings, saveSettings } from "./lib/storage";
import { todayISO, fromISODate } from "./lib/date";
import { computeStreak, computeTotalDaysLogged, getStageForStreak } from "./lib/streak";
import { getCurrentLevelIndex } from "./lib/borders";
import type { LogsByDate, Settings } from "./lib/types";

function App() {
  const [logs, setLogs] = useState<LogsByDate>(() => loadLogs());
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [selectedDate, setSelectedDate] = useState<string>(() => todayISO());
  const [viewDate, setViewDate] = useState<Date>(() => fromISODate(todayISO()));

  useEffect(() => saveLogs(logs), [logs]);
  useEffect(() => saveSettings(settings), [settings]);

  const streak = useMemo(() => computeStreak(logs, todayISO()), [logs]);
  const stage = useMemo(() => getStageForStreak(streak), [streak]);
  const totalDaysLogged = useMemo(() => computeTotalDaysLogged(logs), [logs]);
  const levelIndex = useMemo(() => getCurrentLevelIndex(totalDaysLogged), [totalDaysLogged]);
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

  function changeTarget(value: number) {
    setSettings((prev) => ({ ...prev, targetCalories: value }));
  }

  function changeCharacter(id: string) {
    setSettings((prev) => ({ ...prev, characterId: id }));
  }

  function changeBorder(id: string) {
    setSettings((prev) => ({ ...prev, borderId: id }));
  }

  function acknowledgeLevelUp() {
    setSettings((prev) => ({ ...prev, seenLevelIndex: levelIndex }));
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
      <div className="text-center">
        <h1 className="text-2xl font-pixel font-bold tracking-wide text-emerald-400">Nomzilla</h1>
        <p className="text-sm text-gray-500">Log your calories. Grow your kaiju.</p>
      </div>

      <KaijuHeader
        streak={streak}
        stage={stage}
        target={settings.targetCalories}
        characterId={settings.characterId}
        borderId={settings.borderId}
        totalDaysLogged={totalDaysLogged}
        levelIndex={levelIndex}
        seenLevelIndex={settings.seenLevelIndex}
        onChangeTarget={changeTarget}
        onChangeCharacter={changeCharacter}
        onChangeBorder={changeBorder}
        onAcknowledgeLevelUp={acknowledgeLevelUp}
      />

      <DayPanel
        log={selectedLog}
        target={settings.targetCalories}
        onAddEntry={addEntry}
        onRemoveEntry={removeEntry}
        onJumpToday={jumpToday}
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
