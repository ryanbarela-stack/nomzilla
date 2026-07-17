import { useMemo, useState } from "react";
import type { DayLog, FoodEntry, LogsByDate } from "../lib/types";
import { formatFriendly, todayISO } from "../lib/date";
import { formatProtein } from "../lib/foodFormat";

interface Props {
  log: DayLog;
  logs: LogsByDate;
  target: number;
  proteinTarget: number;
  onAddEntry: (name: string, calories: number, protein?: number) => void;
  onRemoveEntry: (id: string) => void;
  onJumpToday: () => void;
  onChangeTarget: (value: number) => void;
  onChangeProteinTarget: (value: number) => void;
}

export function CaloriePanel({
  log,
  logs,
  target,
  proteinTarget,
  onAddEntry,
  onRemoveEntry,
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

  const total = log.entries.reduce((sum, e) => sum + e.calories, 0);
  const remaining = target - total;
  const isToday = log.date === todayISO();
  const pct = Math.min(100, Math.round((total / Math.max(1, target)) * 100));

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
    </div>
  );
}
