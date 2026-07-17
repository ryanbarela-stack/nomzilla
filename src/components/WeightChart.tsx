import type { WeightPoint } from "../lib/weight";
import { formatShort } from "../lib/date";

interface Props {
  history: WeightPoint[];
  width?: number;
  height?: number;
}

const PADDING = { top: 16, right: 16, bottom: 24, left: 40 };

export function WeightChart({ history, width = 600, height = 220 }: Props) {
  if (history.length < 2) {
    return (
      <div
        className="flex items-center justify-center text-sm text-gray-500 bg-[#0d1117] border border-[#30363d] rounded-lg"
        style={{ width: "100%", height }}
      >
        Log at least 2 days to see a trend.
      </div>
    );
  }

  const innerWidth = width - PADDING.left - PADDING.right;
  const innerHeight = height - PADDING.top - PADDING.bottom;

  const allValues = history.flatMap((p) => [p.weightLbs, p.trendLbs]);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const pad = Math.max(1, (rawMax - rawMin) * 0.15);
  const min = rawMin - pad;
  const max = rawMax + pad;

  function x(i: number): number {
    return PADDING.left + (i / (history.length - 1)) * innerWidth;
  }
  function y(value: number): number {
    return PADDING.top + innerHeight - ((value - min) / (max - min)) * innerHeight;
  }

  const trendPath = history.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.trendLbs)}`).join(" ");
  const yTicks = [min, (min + max) / 2, max];

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {yTicks.map((tick) => (
        <g key={tick}>
          <line x1={PADDING.left} y1={y(tick)} x2={width - PADDING.right} y2={y(tick)} stroke="#21262d" strokeWidth={1} />
          <text x={PADDING.left - 6} y={y(tick)} fontSize={10} fill="#8b949e" textAnchor="end" dominantBaseline="middle">
            {tick.toFixed(0)}
          </text>
        </g>
      ))}

      <text x={x(0)} y={height - 6} fontSize={10} fill="#8b949e" textAnchor="start">
        {formatShort(history[0].date)}
      </text>
      <text x={x(history.length - 1)} y={height - 6} fontSize={10} fill="#8b949e" textAnchor="end">
        {formatShort(history[history.length - 1].date)}
      </text>

      {history.map((p, i) => (
        <circle key={p.date} cx={x(i)} cy={y(p.weightLbs)} r={2.5} fill="#4b5563">
          <title>{`${formatShort(p.date)}: ${p.weightLbs} lb`}</title>
        </circle>
      ))}

      <path d={trendPath} fill="none" stroke="#a78bfa" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
