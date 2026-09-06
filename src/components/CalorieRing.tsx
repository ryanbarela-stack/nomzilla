interface CalorieRingProps {
  actual: number;
  goal: number;
}

export default function CalorieRing({ actual, goal }: CalorieRingProps) {
  const ratio = goal > 0 ? actual / goal : 0;
  const pct = Math.max(0, Math.min(1, ratio));
  const over = ratio > 1.1;
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  const remaining = Math.max(0, Math.round(goal - actual));

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx={60} cy={60} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
        <circle
          cx={60}
          cy={60}
          r={r}
          fill="none"
          stroke={over ? "#ff5c6c" : "#5df27a"}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-2xl font-bold text-white">{Math.round(actual)}</span>
        <span className="text-xs text-white/50">{over ? "over goal" : `${remaining} left`}</span>
      </div>
    </div>
  );
}
