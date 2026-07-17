import { computeCurrentStreak } from "../lib/streak";
import type { LogsByDate } from "../lib/types";

const MILESTONE_DAYS = 7;

interface Props {
  logs: LogsByDate;
}

export function StreakBar({ logs }: Props) {
  const streak = computeCurrentStreak(logs);
  const intoMilestone = streak % MILESTONE_DAYS;
  const pct = (intoMilestone / MILESTONE_DAYS) * 100;
  const daysToMilestone = MILESTONE_DAYS - intoMilestone;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Streak</span>
        <span className="text-orange-400 font-semibold">
          🔥 {streak} {streak === 1 ? "day" : "days"}
        </span>
      </div>
      <div className="h-2 w-full bg-[#0d1117] border border-[#30363d] rounded-full overflow-hidden">
        <div className="h-full bg-orange-500 rounded-full transition-[width]" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500">
        {streak === 0 ? "Log food today to start a streak" : `${daysToMilestone} more to next milestone`}
      </span>
    </div>
  );
}
