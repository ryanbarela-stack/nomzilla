import { useMemo } from "react";
import type { AppData } from "../types";
import { addDays, formatDisplay, todayKey } from "../lib/date";
import { scoreDay, sumMacros } from "../lib/nutrition";

interface HistoryViewProps {
  data: AppData;
}

const DAYS_TO_SHOW = 28;

function scoreColor(score: number | null): string {
  if (score === null) return "bg-white/5";
  if (score >= 85) return "bg-kaiju-green";
  if (score >= 70) return "bg-kaiju-teal";
  if (score >= 50) return "bg-kaiju-gold";
  return "bg-kaiju-red";
}

export default function HistoryView({ data }: HistoryViewProps) {
  const days = useMemo(() => {
    const today = todayKey();
    const list: { date: string; score: number | null; calories: number; hasEntries: boolean }[] = [];
    for (let i = 0; i < DAYS_TO_SHOW; i++) {
      const key = addDays(today, -i);
      const record = data.days[key];
      if (record && record.entries.length > 0) {
        const macros = sumMacros(record.entries);
        list.push({ date: key, score: scoreDay(macros, data.goals).overall, calories: macros.calories, hasEntries: true });
      } else {
        list.push({ date: key, score: null, calories: 0, hasEntries: false });
      }
    }
    return list;
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-kaiju-border bg-kaiju-panel p-5">
        <h3 className="mb-3 font-display text-base font-semibold text-white">Last {DAYS_TO_SHOW} days</h3>
        <div className="grid grid-cols-7 gap-1.5">
          {days
            .slice()
            .reverse()
            .map((d) => (
              <div
                key={d.date}
                title={`${d.date}: ${d.score !== null ? Math.round(d.score) : "no log"}`}
                className={`aspect-square rounded-md ${scoreColor(d.score)} opacity-90`}
              />
            ))}
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-white/50">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-kaiju-green" /> Great
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-kaiju-teal" /> Good
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-kaiju-gold" /> Rough
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-kaiju-red" /> Off track
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-white/5" /> No log
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {days.map((d) => (
          <div
            key={d.date}
            className="flex items-center justify-between rounded-xl border border-kaiju-border bg-kaiju-panel2 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-white">{formatDisplay(d.date)}</p>
              <p className="text-xs text-white/50">{d.hasEntries ? `${Math.round(d.calories)} kcal logged` : "No entries"}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${scoreColor(d.score)}`} />
              <span className="text-sm font-semibold text-white/80">{d.score !== null ? Math.round(d.score) : "—"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
