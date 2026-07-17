import { useState } from "react";
import type { LogsByDate } from "../lib/types";
import { formatFriendly, todayISO } from "../lib/date";
import { getTrendChangeLbs, getWeightHistory } from "../lib/weight";
import { WeightChart } from "./WeightChart";

interface Props {
  logs: LogsByDate;
  onSetWeight: (date: string, weightLbs: number) => void;
  onRemoveWeight: (date: string) => void;
}

export function WeightPage({ logs, onSetWeight, onRemoveWeight }: Props) {
  const today = todayISO();
  const todayWeight = logs[today]?.weightLbs;
  const [draft, setDraft] = useState(todayWeight !== undefined ? String(todayWeight) : "");

  const history = getWeightHistory(logs);
  const trendChange = getTrendChangeLbs(history);
  const reversedHistory = [...history].reverse();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(draft);
    if (!value || value <= 0) return;
    onSetWeight(today, value);
  }

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-[#e6edf3]">Weight</h2>
        {trendChange !== null && (
          <div className={`text-sm ${trendChange <= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {trendChange <= 0 ? "▼" : "▲"} {Math.abs(trendChange).toFixed(1)} lb trend
          </div>
        )}
      </div>

      <WeightChart history={history} />

      <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap items-center">
        <span className="text-sm text-gray-400 whitespace-nowrap">Today's weight</span>
        <input
          type="number"
          placeholder="lbs"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          min={1}
          step={0.1}
          className="w-24 bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-sm text-[#e6edf3] placeholder:text-gray-500 focus:outline-none focus:border-violet-500"
        />
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-500 text-white rounded px-4 py-2 text-sm font-medium"
        >
          {todayWeight !== undefined ? "Update" : "Log"}
        </button>
      </form>

      <ul className="flex flex-col gap-1 max-h-64 overflow-y-auto">
        {reversedHistory.length === 0 && (
          <li className="text-sm text-gray-500 italic py-2">No weight logged yet.</li>
        )}
        {reversedHistory.map((point) => (
          <li
            key={point.date}
            className="flex items-center justify-between bg-[#0d1117] border border-[#21262d] rounded px-3 py-2"
          >
            <span className="text-sm text-[#e6edf3]">{formatFriendly(point.date)}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{point.weightLbs} lb</span>
              <button
                onClick={() => onRemoveWeight(point.date)}
                className="text-gray-500 hover:text-red-400 text-sm"
                aria-label="Remove weight entry"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
