import { ATTRIBUTES, computeAttributeCount, getAttributeLevel } from "../lib/attributes";
import type { LogsByDate } from "../lib/types";

interface Props {
  logs: LogsByDate;
}

const SIZE = 220;
const CENTER = SIZE / 2;
const RADIUS = 62;
const RING_FRACTIONS = [0.25, 0.5, 0.75, 1];
const AXIS_COUNT = ATTRIBUTES.length;

function axisPoint(index: number, fraction: number): [number, number] {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / AXIS_COUNT;
  return [CENTER + RADIUS * fraction * Math.cos(angle), CENTER + RADIUS * fraction * Math.sin(angle)];
}

function ringPoints(fraction: number): string {
  return Array.from({ length: AXIS_COUNT }, (_, i) => axisPoint(i, fraction).join(",")).join(" ");
}

interface LabelLayout {
  dotX: number;
  dotY: number;
  textX: number;
  textY: number;
  anchor: "middle" | "start" | "end";
}

/**
 * Dot + text position for each of the 4 fixed axis slots (top/right/bottom/left),
 * ordered outward from the vertex as vertex -> dot -> label on every side.
 */
function labelLayout(index: number): LabelLayout {
  const [x, y] = axisPoint(index, 1);
  switch (index) {
    case 0:
      return { dotX: x, dotY: y - 14, textX: x, textY: y - 25, anchor: "middle" };
    case 1:
      return { dotX: x + 9, dotY: y - 3, textX: x + 16, textY: y, anchor: "start" };
    case 2:
      return { dotX: x, dotY: y + 15, textX: x, textY: y + 29, anchor: "middle" };
    default:
      return { dotX: x - 9, dotY: y - 3, textX: x - 16, textY: y, anchor: "end" };
  }
}

export function AttributeRadar({ logs }: Props) {
  const levels = ATTRIBUTES.map((attr) => getAttributeLevel(computeAttributeCount(logs, attr.id)));
  const axisMax = Math.max(4, Math.max(...levels) + 2);

  const dataPoints = levels.map((level, i) => axisPoint(i, level / axisMax));
  const dataPolygon = dataPoints.map((p) => p.join(",")).join(" ");

  return (
    <div className="flex flex-col items-center gap-1">
      <h3 className="text-xs font-semibold text-gray-400 self-start">Attribute Balance</h3>
      <svg width={SIZE} height={SIZE} className="overflow-visible">
        {RING_FRACTIONS.map((fraction) => (
          <polygon key={fraction} points={ringPoints(fraction)} fill="none" stroke="#30363d" strokeWidth={1} />
        ))}

        {ATTRIBUTES.map((attr, i) => {
          const [x, y] = axisPoint(i, 1);
          return <line key={attr.id} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="#30363d" strokeWidth={1} />;
        })}

        <polygon
          points={dataPolygon}
          fill="#818cf8"
          fillOpacity={0.18}
          stroke="#818cf8"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {dataPoints.map(([x, y], i) => (
          <circle key={ATTRIBUTES[i].id} cx={x} cy={y} r={4} fill="#818cf8" stroke="#0d1117" strokeWidth={2}>
            <title>{`${ATTRIBUTES[i].name} — Level ${levels[i]}`}</title>
          </circle>
        ))}

        {ATTRIBUTES.map((attr, i) => {
          const { dotX, dotY, textX, textY, anchor } = labelLayout(i);
          return (
            <g key={attr.id}>
              <circle cx={dotX} cy={dotY} r={3} fill={attr.hex} />
              <text x={textX} y={textY} fontSize={10} textAnchor={anchor} fill="#8b949e">
                {attr.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
