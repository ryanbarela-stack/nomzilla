import {
  ATTRIBUTES,
  computeAttributeCount,
  getAttributeLevel,
  getDaysToNextLevel,
  getLevelProgressPct,
  type AttributeId,
} from "../lib/attributes";
import type { LogsByDate } from "../lib/types";

interface Props {
  logs: LogsByDate;
  seenAttributeLevels: Record<string, number>;
  onAcknowledgeLevel: (id: AttributeId) => void;
}

export function AttributeStats({ logs, seenAttributeLevels, onAcknowledgeLevel }: Props) {
  return (
    <div className="border-t border-[#30363d] pt-4 flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-[#e6edf3] font-pixel">Champion Attributes</h2>

      {ATTRIBUTES.map((attr) => {
        const count = computeAttributeCount(logs, attr.id);
        const level = getAttributeLevel(count);
        const daysToNext = getDaysToNextLevel(count);
        const pct = getLevelProgressPct(count);
        const leveledUp = level > (seenAttributeLevels[attr.id] ?? 0);

        return (
          <div key={attr.id} className="flex flex-col gap-1">
            {leveledUp && (
              <div className="bg-indigo-950 border border-indigo-700 rounded-md px-3 py-1.5 text-xs text-indigo-200 flex items-center justify-between gap-2">
                <span>
                  {attr.name} leveled up — <strong>Level {level}</strong>!
                </span>
                <button
                  onClick={() => onAcknowledgeLevel(attr.id)}
                  className="text-indigo-300 hover:text-white underline shrink-0"
                >
                  Dismiss
                </button>
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                {attr.name} — <span className="text-gray-300">Level {level}</span>
              </span>
              <span>{daysToNext} more</span>
            </div>
            <div className="h-2 w-full bg-[#0d1117] border border-[#30363d] rounded-full overflow-hidden">
              <div className={`h-full ${attr.barClassName} rounded-full transition-[width]`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
