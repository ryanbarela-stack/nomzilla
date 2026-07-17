import { getMonthGrid, MONTH_NAMES, WEEKDAY_LABELS, todayISO } from "../lib/date";
import { getStreakDates } from "../lib/streak";
import type { LogsByDate } from "../lib/types";

interface Props {
  year: number;
  month: number; // 0-11
  logs: LogsByDate;
  target: number;
  selectedDate: string;
  onSelectDate: (iso: string) => void;
  onChangeMonth: (delta: number) => void;
}

export function Calendar({ year, month, logs, target, selectedDate, onSelectDate, onChangeMonth }: Props) {
  const grid = getMonthGrid(year, month);
  const today = todayISO();
  const streakDates = new Set(getStreakDates(logs, today));

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => onChangeMonth(-1)}
          className="text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-[#21262d]"
          aria-label="Previous month"
        >
          ←
        </button>
        <h3 className="text-sm font-semibold text-[#e6edf3]">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          onClick={() => onChangeMonth(1)}
          className="text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-[#21262d]"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={i} className="text-center text-[10px] text-gray-500 font-medium">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.flat().map((iso, i) => {
          if (!iso) return <div key={i} />;
          const log = logs[iso];
          const total = log?.entries.reduce((s, e) => s + e.calories, 0) ?? 0;
          const hasLog = !!log && log.entries.length > 0;
          const hasExerciseLog = !!log && (log.habitEntries ?? []).length > 0;
          const isOver = hasLog && total > target;
          const isToday = iso === today;
          const isSelected = iso === selectedDate;
          const isStreakDay = streakDates.has(iso);
          const day = Number(iso.slice(-2));

          let colorClasses = "bg-[#0d1117] text-gray-500 border-[#21262d]";
          if (hasLog) {
            colorClasses = isOver
              ? "bg-red-950 text-red-300 border-red-800"
              : "bg-emerald-950 text-emerald-300 border-emerald-800";
          }

          return (
            <button
              key={iso}
              onClick={() => onSelectDate(iso)}
              className={`aspect-square rounded text-xs border flex items-center justify-center relative transition-colors
                ${colorClasses}
                ${isSelected ? "ring-2 ring-emerald-400" : ""}
                ${isToday && !isSelected ? "ring-1 ring-gray-400" : ""}
                hover:brightness-125`}
              title={hasLog ? `${total} kcal${hasExerciseLog ? " · training logged" : ""}${isStreakDay ? " · streak" : ""}` : "No log"}
            >
              {day}
              {isStreakDay && (
                <span className="absolute top-0.5 left-0.5 text-[8px] leading-none">🔥</span>
              )}
              {hasExerciseLog && (
                <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-950 border border-emerald-800 inline-block" /> under target</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-950 border border-red-800 inline-block" /> over target</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#0d1117] border border-[#21262d] inline-block" /> no log</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" /> training logged</span>
        <span className="flex items-center gap-1">🔥 streak</span>
      </div>
    </div>
  );
}
