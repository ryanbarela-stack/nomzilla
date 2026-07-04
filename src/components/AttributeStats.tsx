import { ATTRIBUTES, computeAttributeCount, getAttributeTier, getNextAttributeTier, type AttributeId } from "../lib/attributes";
import type { LogsByDate } from "../lib/types";

interface Props {
  logs: LogsByDate;
  seenAttributeTiers: Record<string, number>;
  onAcknowledgeTier: (id: AttributeId) => void;
}

export function AttributeStats({ logs, seenAttributeTiers, onAcknowledgeTier }: Props) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-[#e6edf3] font-pixel">Attributes</h2>

      {ATTRIBUTES.map((attr) => {
        const count = computeAttributeCount(logs, attr.id);
        const tier = getAttributeTier(count);
        const next = getNextAttributeTier(tier);
        const pct = next
          ? Math.min(100, Math.max(0, ((count - tier.minCount) / (next.minCount - tier.minCount)) * 100))
          : 100;
        const tieredUp = tier.index > (seenAttributeTiers[attr.id] ?? 0);

        return (
          <div key={attr.id} className="flex flex-col gap-1">
            {tieredUp && (
              <div className="bg-indigo-950 border border-indigo-700 rounded-md px-3 py-1.5 text-xs text-indigo-200 flex items-center justify-between gap-2">
                <span>
                  {attr.name} tier up — <strong>{tier.name}</strong>!
                </span>
                <button
                  onClick={() => onAcknowledgeTier(attr.id)}
                  className="text-indigo-300 hover:text-white underline shrink-0"
                >
                  Dismiss
                </button>
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                {attr.name} — <span className="text-gray-300">{tier.name}</span>
              </span>
              <span>{next ? `${next.minCount - count} more` : "Max"}</span>
            </div>
            <div className="h-2 w-full bg-[#0d1117] border border-[#30363d] rounded-full overflow-hidden">
              <div className={`h-full ${tier.barClassName} rounded-full transition-[width]`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
