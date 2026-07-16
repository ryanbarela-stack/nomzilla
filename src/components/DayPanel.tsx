import { Fragment, useMemo, useState } from "react";
import { ATTRIBUTES } from "../lib/attributes";
import type { AttributeId, DayLog, FoodEntry, HabitEntry, LogsByDate } from "../lib/types";
import { formatFriendly, formatShort, todayISO } from "../lib/date";
import { formatHabitDetails } from "../lib/habitFormat";
import { formatProtein } from "../lib/foodFormat";
import { findLastExerciseEntry, getOverloadSuggestion } from "../lib/progressiveOverload";

type NewHabitEntry = Omit<HabitEntry, "id">;

const SET_ROW_COUNT = 3;

interface SetRow {
  reps: string;
  weight: string;
}

function emptySetRows(): SetRow[] {
  return Array.from({ length: SET_ROW_COUNT }, () => ({ reps: "", weight: "" }));
}

interface Props {
  log: DayLog;
  logs: LogsByDate;
  target: number;
  proteinTarget: number;
  onAddEntry: (name: string, calories: number, protein?: number) => void;
  onRemoveEntry: (id: string) => void;
  onAddHabitEntry: (entry: NewHabitEntry) => void;
  onRemoveHabitEntry: (id: string) => void;
  onJumpToday: () => void;
  onChangeTarget: (value: number) => void;
  onChangeProteinTarget: (value: number) => void;
}

export function DayPanel({
  log,
  logs,
  target,
  proteinTarget,
  onAddEntry,
  onRemoveEntry,
  onAddHabitEntry,
  onRemoveHabitEntry,
  onJumpToday,
  onChangeTarget,
  onChangeProteinTarget,
}: Props) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetDraft, setTargetDraft] = useState(String(target));
  const [editingProteinTarget, setEditingProteinTarget] = useState(false);
  const [proteinTargetDraft, setProteinTargetDraft] = useState(String(proteinTarget));
  const [habitDescription, setHabitDescription] = useState("");
  const [habitAttributeId, setHabitAttributeId] = useState<AttributeId | null>(null);
  const [setRows, setSetRows] = useState<SetRow[]>(emptySetRows);
  const [isTimed, setIsTimed] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState("");

  function updateSetRow(index: number, field: "reps" | "weight", value: string) {
    setSetRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  const total = log.entries.reduce((sum, e) => sum + e.calories, 0);
  const remaining = target - total;
  const isToday = log.date === todayISO();
  const pct = Math.min(100, Math.round((total / Math.max(1, target)) * 100));
  const habitEntries = log.habitEntries ?? [];

  const proteinTotal = log.entries.reduce((sum, e) => sum + (e.protein ?? 0), 0);
  const proteinRemaining = proteinTarget - proteinTotal;
  const proteinPct = Math.min(100, Math.round((proteinTotal / Math.max(1, proteinTarget)) * 100));

  const recentFoods = useMemo(() => {
    const byName = new Map<string, { entry: FoodEntry; date: string }>();
    Object.entries(logs).forEach(([date, dayLog]) => {
      dayLog.entries.forEach((entry) => {
        const key = entry.name.trim().toLowerCase();
        const existing = byName.get(key);
        if (!existing || date > existing.date) byName.set(key, { entry, date });
      });
    });
    return Array.from(byName.values())
      .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1))
      .slice(0, 8)
      .map((v) => v.entry);
  }, [logs]);

  const lastEntry = useMemo(() => findLastExerciseEntry(logs, habitDescription), [logs, habitDescription]);
  const suggestion = useMemo(() => (lastEntry ? getOverloadSuggestion(lastEntry) : null), [lastEntry]);

  function applySuggestion() {
    if (!lastEntry || !suggestion) return;
    if (!habitAttributeId) setHabitAttributeId(lastEntry.attributeId);

    const rows = emptySetRows();
    suggestion.setDetails?.forEach((set, i) => {
      if (i >= SET_ROW_COUNT) return;
      rows[i] = {
        reps: set.reps !== undefined ? String(set.reps) : "",
        weight: set.weight !== undefined ? String(set.weight) : "",
      };
    });
    setSetRows(rows);

    if (suggestion.durationMinutes !== undefined) {
      setIsTimed(true);
      setDurationMinutes(String(suggestion.durationMinutes));
    }
  }

  function commitTarget() {
    const val = Number(targetDraft);
    if (val > 0) onChangeTarget(Math.round(val));
    else setTargetDraft(String(target));
    setEditingTarget(false);
  }

  function commitProteinTarget() {
    const val = Number(proteinTargetDraft);
    if (val > 0) onChangeProteinTarget(Math.round(val));
    else setProteinTargetDraft(String(proteinTarget));
    setEditingProteinTarget(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cal = Number(calories);
    if (!name.trim() || !cal || cal <= 0) return;

    onAddEntry(name.trim(), Math.round(cal), protein ? Number(protein) : undefined);
    setName("");
    setCalories("");
    setProtein("");
  }

  function applyRecentFood(entry: FoodEntry) {
    setName(entry.name);
    setCalories(String(entry.calories));
    setProtein(entry.protein !== undefined ? String(entry.protein) : "");
  }

  function handleHabitSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!habitDescription.trim() || !habitAttributeId) return;

    const setDetails = setRows
      .map((row) => ({
        reps: row.reps ? Number(row.reps) : undefined,
        weight: row.weight ? Number(row.weight) : undefined,
      }))
      .filter((row) => row.reps !== undefined || row.weight !== undefined);

    onAddHabitEntry({
      description: habitDescription.trim(),
      attributeId: habitAttributeId,
      setDetails: setDetails.length > 0 ? setDetails : undefined,
      durationMinutes: isTimed && durationMinutes ? Number(durationMinutes) : undefined,
    });
    setHabitDescription("");
    setHabitAttributeId(null);
    setSetRows(emptySetRows());
    setIsTimed(false);
    setDurationMinutes("");
  }

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-semibold text-[#e6edf3]">{formatFriendly(log.date)}</h2>
          {!isToday && (
            <button
              onClick={onJumpToday}
              className="text-xs text-emerald-400 hover:text-emerald-300 underline"
            >
              jump to today
            </button>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#e6edf3]">
            {total}{" "}
            <span className="text-sm font-normal text-gray-400">
              /{" "}
              {editingTarget ? (
                <input
                  autoFocus
                  type="number"
                  value={targetDraft}
                  onChange={(e) => setTargetDraft(e.target.value)}
                  onBlur={commitTarget}
                  onKeyDown={(e) => e.key === "Enter" && commitTarget()}
                  className="w-20 bg-[#0d1117] border border-emerald-600 rounded px-1 py-0.5 text-[#e6edf3] text-sm focus:outline-none"
                />
              ) : (
                <button
                  onClick={() => {
                    setTargetDraft(String(target));
                    setEditingTarget(true);
                  }}
                  className="underline decoration-dotted hover:text-emerald-400"
                >
                  {target}
                </button>
              )}{" "}
              kcal
            </span>
          </div>
          <div className={`text-sm ${remaining >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {remaining >= 0 ? `${remaining} remaining` : `${Math.abs(remaining)} over`}
          </div>
        </div>
      </div>

      <div className="w-full h-2 bg-[#0d1117] rounded overflow-hidden border border-[#30363d]">
        <div
          className={`h-full ${total > target ? "bg-red-500" : "bg-emerald-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="pl-3 border-l-2 border-[#30363d] flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-gray-400">Protein</span>
          <span className="text-xs text-gray-400">
            {proteinTotal}g /{" "}
            {editingProteinTarget ? (
              <input
                autoFocus
                type="number"
                value={proteinTargetDraft}
                onChange={(e) => setProteinTargetDraft(e.target.value)}
                onBlur={commitProteinTarget}
                onKeyDown={(e) => e.key === "Enter" && commitProteinTarget()}
                className="w-14 bg-[#0d1117] border border-sky-600 rounded px-1 py-0.5 text-[#e6edf3] text-xs focus:outline-none"
              />
            ) : (
              <button
                onClick={() => {
                  setProteinTargetDraft(String(proteinTarget));
                  setEditingProteinTarget(true);
                }}
                className="underline decoration-dotted hover:text-sky-400"
              >
                {proteinTarget}
              </button>
            )}
            g
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#0d1117] rounded overflow-hidden border border-[#30363d]">
          <div className="h-full bg-sky-500" style={{ width: `${proteinPct}%` }} />
        </div>
        {proteinRemaining >= 0 ? (
          <span className="text-xs text-gray-500">{proteinRemaining}g remaining</span>
        ) : (
          <span className="text-xs text-sky-400">{Math.abs(proteinRemaining)}g over target</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Food name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 min-w-[120px] bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-sm text-[#e6edf3] placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
          />
          <input
            type="number"
            placeholder="kcal"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-24 bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-sm text-[#e6edf3] placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
            min={1}
          />
          <input
            type="number"
            placeholder="Protein (g)"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            min={0}
            className="w-28 bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-sm text-[#e6edf3] placeholder:text-gray-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded px-4 py-2 text-sm font-medium"
          >
            Add
          </button>
        </div>
      </form>

      {recentFoods.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Recent:</span>
          {recentFoods.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => applyRecentFood(entry)}
              className="text-xs px-2 py-1 rounded-full bg-[#0d1117] border border-[#30363d] text-gray-300 hover:border-emerald-500 hover:text-emerald-400"
            >
              {entry.name} · {entry.calories} kcal
            </button>
          ))}
        </div>
      )}

      <ul className="flex flex-col gap-1 max-h-64 overflow-y-auto">
        {log.entries.length === 0 && (
          <li className="text-sm text-gray-500 italic py-2">No food logged yet.</li>
        )}
        {log.entries.map((entry) => {
          const protein = formatProtein(entry);
          return (
            <li
              key={entry.id}
              className="flex items-center justify-between bg-[#0d1117] border border-[#21262d] rounded px-3 py-2"
            >
              <div className="flex flex-col">
                <span className="text-sm text-[#e6edf3]">{entry.name}</span>
                {protein && <span className="text-xs text-gray-500">{protein}</span>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">{entry.calories} kcal</span>
                <button
                  onClick={() => onRemoveEntry(entry.id)}
                  className="text-gray-500 hover:text-red-400 text-sm"
                  aria-label="Remove entry"
                >
                  ✕
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-[#30363d] pt-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[#e6edf3]">Training log</h3>

        <form onSubmit={handleHabitSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="text"
              placeholder="What did you do? (e.g. Bench press)"
              value={habitDescription}
              onChange={(e) => setHabitDescription(e.target.value)}
              className="flex-1 min-w-[160px] bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-sm text-[#e6edf3] placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
            />
            <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer whitespace-nowrap shrink-0">
              <input
                type="checkbox"
                checked={isTimed}
                onChange={(e) => setIsTimed(e.target.checked)}
                className="accent-emerald-500"
              />
              Timed exercise
            </label>
            <button
              type="submit"
              disabled={!habitDescription.trim() || !habitAttributeId}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded px-4 py-2 text-sm font-medium"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {ATTRIBUTES.map((attr) => {
              const selected = habitAttributeId === attr.id;
              return (
                <button
                  key={attr.id}
                  type="button"
                  title={attr.habitLabel}
                  onClick={() => setHabitAttributeId(attr.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    selected
                      ? attr.activeButtonClassName
                      : "bg-[#0d1117] border-[#30363d] text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {attr.name}
                </button>
              );
            })}
          </div>

          {lastEntry && suggestion && (
            <div className="bg-indigo-950 border border-indigo-800 rounded-md px-3 py-2 text-xs text-indigo-200 flex items-center justify-between gap-2 flex-wrap">
              <span>
                Last time ({formatShort(lastEntry.date)}): {formatHabitDetails(lastEntry) || "logged, no details"}
              </span>
              {formatHabitDetails(suggestion) && (
                <button
                  type="button"
                  onClick={applySuggestion}
                  className="text-indigo-300 hover:text-white underline shrink-0"
                >
                  Try {formatHabitDetails(suggestion)}
                </button>
              )}
            </div>
          )}

          {isTimed ? (
            <div className="bg-[#0d1117] border border-[#21262d] rounded-md p-3 flex flex-col gap-2">
              <div className="text-xs font-medium text-gray-400">Duration</div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  min={0}
                  className="w-full bg-[#161b22] border border-[#30363d] rounded px-2 py-1.5 pr-10 text-sm text-[#e6edf3] placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                  min
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-[#0d1117] border border-[#21262d] rounded-md p-3 flex flex-col gap-3">
              <div className="text-xs font-medium text-gray-400">Sets (optional)</div>

              <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 items-center">
                <div className="text-xs text-gray-500 font-medium">Set</div>
                <div className="text-xs text-gray-500 font-medium">Reps</div>
                <div className="text-xs text-gray-500 font-medium">Weight (lbs)</div>
                {setRows.map((row, i) => (
                  <Fragment key={i}>
                    <div className="text-xs text-gray-400">Set {i + 1}</div>
                    <input
                      type="number"
                      placeholder="0"
                      value={row.reps}
                      onChange={(e) => updateSetRow(i, "reps", e.target.value)}
                      min={0}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded px-2 py-1.5 text-sm text-[#e6edf3] placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="number"
                      placeholder="0"
                      value={row.weight}
                      onChange={(e) => updateSetRow(i, "weight", e.target.value)}
                      min={0}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded px-2 py-1.5 text-sm text-[#e6edf3] placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
                    />
                  </Fragment>
                ))}
              </div>
            </div>
          )}
        </form>

        <ul className="flex flex-col gap-1 max-h-64 overflow-y-auto">
          {habitEntries.length === 0 && (
            <li className="text-sm text-gray-500 italic py-2">No training logged yet.</li>
          )}
          {habitEntries.map((entry) => {
            const attr = ATTRIBUTES.find((a) => a.id === entry.attributeId);
            const details = formatHabitDetails(entry);
            return (
              <li
                key={entry.id}
                className="flex items-center justify-between bg-[#0d1117] border border-[#21262d] rounded px-3 py-2"
              >
                <div className="flex flex-col">
                  <span className="text-sm text-[#e6edf3]">{entry.description}</span>
                  {details && <span className="text-xs text-gray-500">{details}</span>}
                </div>
                <div className="flex items-center gap-3">
                  {attr && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${attr.activeButtonClassName}`}>
                      {attr.name}
                    </span>
                  )}
                  <button
                    onClick={() => onRemoveHabitEntry(entry.id)}
                    className="text-gray-500 hover:text-red-400 text-sm"
                    aria-label="Remove training entry"
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
