import KaijuSvg from "./KaijuSvg";
import { moodFromScore } from "./moodTypes";
import { progressToNextStage } from "../lib/kaijuGrowth";

interface KaijuDisplayProps {
  name: string;
  totalXp: number;
  streak: number;
  bestStreak: number;
  todayScore: number | null;
}

export default function KaijuDisplay({ name, totalXp, streak, bestStreak, todayScore }: KaijuDisplayProps) {
  const { current, next, pct } = progressToNextStage(totalXp);
  const mood = moodFromScore(todayScore);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-kaiju-border bg-kaiju-panel p-5 shadow-glow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">{name}</h2>
          <p className="text-sm text-kaiju-green">{current.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-white/50">Streak</p>
          <p className="font-display text-xl font-bold text-kaiju-gold">
            {streak}
            <span className="ml-1 text-sm text-white/40">/ best {bestStreak}</span>
          </p>
        </div>
      </div>

      <div className="mx-auto my-2 flex h-48 items-end justify-center">
        <KaijuSvg stageId={current.id} mood={mood} className="h-full w-auto drop-shadow-[0_0_20px_rgba(93,242,122,0.25)]" />
      </div>

      <p className="text-center text-sm text-white/60">{current.blurb}</p>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-white/50">
          <span>{Math.round(totalXp)} XP</span>
          <span>{next ? `${next.name} at ${next.minXp} XP` : "Max stage reached"}</span>
        </div>
        <div className="progress-track h-2.5 w-full overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-gradient-to-r from-kaiju-teal to-kaiju-green transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
