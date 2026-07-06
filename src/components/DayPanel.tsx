import { useState } from "react";
import { ATTRIBUTES } from "../lib/attributes";
import type { AttributeId, DayLog } from "../lib/types";
import { formatFriendly, todayISO } from "../lib/date";

interface Props {
  log: DayLog;
  target: number;
  onAddEntry: (name: string, calories: number) => void;
  onRemoveEntry: (id: string) => void;
  onAddHabitEntry: (description: string, attributeId: AttributeId) => void;
  onRemoveHabitEntry: (id: string) => void;
  onJumpToday: () => void;
}

export function DayPanel({
  log,
  target,
  onAddEntry,
  onRemoveEntry,
  onAddHabitEntry,
  onRemoveHabitEntry,
  onJumpToday,
}: Props) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [habitAttributeId, setHabitAttributeId] = useState<AttributeId | null>(null);

  const total = log.entries.reduce((sum, e) => sum + e.calories, 0);
  const remaining = target - total;
  const isToday = log.date === todayISO();
  const pct = Math.min(100, Math.round((total / Math.max(1, target)) * 100));
  const habitEntries = log.habitEntries ?? [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cal = Number(calories);
    if (!name.trim() || !cal || cal <= 0) return;
    onAddEntry(name.trim(), Math.round(cal));
    setName("");
    setCalories("");
  }

  function handleHabitSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!habitDescription.trim() || !habitAttributeId) return;
    onAddHabitEntry(habitDescription.trim(), habitAttributeId);
    setHabitDescription("");
    setHabitAttributeId(null);
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
          <div className="text-2xl font-bold text-[#e6edf3]">{total} <span className="text-sm font-normal text-gray-400">/ {target} kcal</span></div>
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

      <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
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
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded px-4 py-2 text-sm font-medium"
        >
          Add
        </button>
      </form>

      <ul className="flex flex-col gap-1 max-h-64 overflow-y-auto">
        {log.entries.length === 0 && (
          <li className="text-sm text-gray-500 italic py-2">No food logged yet.</li>
        )}
        {log.entries.map((entry) => (
          <li
            key={entry.id}
            className="flex items-center justify-between bg-[#0d1117] border border-[#21262d] rounded px-3 py-2"
          >
            <span className="text-sm text-[#e6edf3]">{entry.name}</span>
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
        ))}
      </ul>

      <div className="border-t border-[#30363d] pt-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[#e6edf3]">Habits</h3>

        <form onSubmit={handleHabitSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="What did you do? (e.g. Bench press 3x10)"
              value={habitDescription}
              onChange={(e) => setHabitDescription(e.target.value)}
              className="flex-1 min-w-[160px] bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-sm text-[#e6edf3] placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
            />
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
        </form>

        <ul className="flex flex-col gap-1 max-h-64 overflow-y-auto">
          {habitEntries.length === 0 && (
            <li className="text-sm text-gray-500 italic py-2">No habits logged yet.</li>
          )}
          {habitEntries.map((entry) => {
            const attr = ATTRIBUTES.find((a) => a.id === entry.attributeId);
            return (
              <li
                key={entry.id}
                className="flex items-center justify-between bg-[#0d1117] border border-[#21262d] rounded px-3 py-2"
              >
                <span className="text-sm text-[#e6edf3]">{entry.description}</span>
                <div className="flex items-center gap-3">
                  {attr && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${attr.activeButtonClassName}`}>
                      {attr.name}
                    </span>
                  )}
                  <button
                    onClick={() => onRemoveHabitEntry(entry.id)}
                    className="text-gray-500 hover:text-red-400 text-sm"
                    aria-label="Remove habit entry"
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
