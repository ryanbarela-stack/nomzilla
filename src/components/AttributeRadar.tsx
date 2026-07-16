import { ATTRIBUTES, getAttributeProgress } from "../lib/attributes";
import type { LogsByDate } from "../lib/types";

interface Props {
  logs: LogsByDate;
  /** Rendered width/height of the chart, in px. Everything else scales off this. */
  size?: number;
}

const BASE_SIZE = 220;
const RING_FRACTIONS = [0.25, 0.5, 0.75, 1];
const AXIS_COUNT = ATTRIBUTES.length;

interface LabelLayout {
  dotX: number;
  dotY: number;
  textX: number;
  textY: number;
  anchor: "middle" | "start" | "end";
}

export function AttributeRadar({ logs, size = BASE_SIZE }: Props) {
  const scale = size / BASE_SIZE;
  const center = size / 2;
  const radius = 62 * scale;
  const fontSize = Math.max(8, 10 * scale);
  const dotRadius = Math.max(2, 3 * scale);
  const markerRadius = Math.max(3, 4 * scale);

  function axisPoint(index: number, fraction: number): [number, number] {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / AXIS_COUNT;
    return [center + radius * fraction * Math.cos(angle), center + radius * fraction * Math.sin(angle)];
  }

  function ringPoints(fraction: number): string {
    return Array.from({ length: AXIS_COUNT }, (_, i) => axisPoint(i, fraction).join(",")).join(" ");
  }

  /**
   * Dot + label position for each of the 4 fixed axis slots (top/right/bottom/left),
   * ordered outward from the vertex as vertex -> dot -> label on every side.
   */
  function labelLayout(index: number): LabelLayout {
    const [x, y] = axisPoint(index, 1);
    const near = 9 * scale;
    const far = 16 * scale;
    switch (index) {
      case 0:
        return { dotX: x, dotY: y - near - 5 * scale, textX: x, textY: y - far - 9 * scale, anchor: "middle" };
      case 1:
        return { dotX: x + near, dotY: y - 3 * scale, textX: x + far, textY: y, anchor: "start" };
      case 2:
        return { dotX: x, dotY: y + near + 6 * scale, textX: x, textY: y + far + 13 * scale, anchor: "middle" };
      default:
        return { dotX: x - near, dotY: y - 3 * scale, textX: x - far, textY: y, anchor: "end" };
    }
  }

  const levels = ATTRIBUTES.map((attr) => getAttributeProgress(logs, attr.id).level);
  const axisMax = Math.max(4, Math.max(...levels) + 2);

  const dataPoints = levels.map((level, i) => axisPoint(i, level / axisMax));
  const dataPolygon = dataPoints.map((p) => p.join(",")).join(" ");

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="bg-[#0d1117] rounded-lg p-2 border-2 border-[#30363d] inline-flex items-center justify-center">
        <svg width={size} height={size} className="overflow-visible">
          {RING_FRACTIONS.map((fraction) => (
            <polygon key={fraction} points={ringPoints(fraction)} fill="none" stroke="#30363d" strokeWidth={1} />
          ))}

          {ATTRIBUTES.map((attr, i) => {
            const [x, y] = axisPoint(i, 1);
            return <line key={attr.id} x1={center} y1={center} x2={x} y2={y} stroke="#30363d" strokeWidth={1} />;
          })}

          <polygon
            points={dataPolygon}
            fill="#818cf8"
            fillOpacity={0.18}
            stroke="#818cf8"
            strokeWidth={Math.max(1.5, 2 * scale)}
            strokeLinejoin="round"
          />

          {dataPoints.map(([x, y], i) => (
            <circle
              key={ATTRIBUTES[i].id}
              cx={x}
              cy={y}
              r={markerRadius}
              fill="#818cf8"
              stroke="#0d1117"
              strokeWidth={Math.max(1.5, 2 * scale)}
            >
              <title>{`${ATTRIBUTES[i].name} — Level ${levels[i]}`}</title>
            </circle>
          ))}

          {ATTRIBUTES.map((attr, i) => {
            const { dotX, dotY, textX, textY, anchor } = labelLayout(i);
            return (
              <g key={attr.id}>
                <circle cx={dotX} cy={dotY} r={dotRadius} fill={attr.hex} />
                <text x={textX} y={textY} fontSize={fontSize} textAnchor={anchor} fill="#8b949e">
                  {attr.name.slice(0, 3).toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <span className="text-xs text-gray-400">Attribute Balance</span>
    </div>
  );
}
