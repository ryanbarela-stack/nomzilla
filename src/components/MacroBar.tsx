interface MacroBarProps {
  label: string;
  actual: number;
  goal: number;
  unit?: string;
  color: string;
}

export default function MacroBar({ label, actual, goal, unit = "g", color }: MacroBarProps) {
  const ratio = goal > 0 ? actual / goal : 0;
  const pct = Math.max(0, Math.min(100, ratio * 100));
  const over = ratio > 1.1;

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-medium text-white/80">{label}</span>
        <span className="text-white/50">
          <span className={over ? "text-kaiju-red" : "text-white/80"}>{Math.round(actual)}</span>
          {" / "}
          {Math.round(goal)}
          {unit}
        </span>
      </div>
      <div className="progress-track h-2 w-full overflow-hidden rounded-full">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: over ? "#ff5c6c" : color }}
        />
      </div>
    </div>
  );
}
