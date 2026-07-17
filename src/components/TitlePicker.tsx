import { ATTRIBUTES, getAttributeProgress, getAttributeTitle } from "../lib/attributes";
import type { AttributeId, LogsByDate } from "../lib/types";

interface Props {
  selectedId: AttributeId | null;
  logs: LogsByDate;
  onSelect: (id: AttributeId | null) => void;
  onClose: () => void;
}

export function TitlePicker({ selectedId, logs, onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 max-w-md w-full flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-pixel font-bold text-[#e6edf3]">Choose your title</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 px-2 text-lg leading-none">
            ✕
          </button>
        </div>

        <button
          onClick={() => {
            onSelect(null);
            onClose();
          }}
          className={`text-left px-3 py-2 rounded-md bg-[#0d1117] hover:bg-[#1c2129] text-sm text-gray-300 transition-colors ${
            selectedId === null ? "ring-2 ring-emerald-500" : ""
          }`}
        >
          Auto — highest attribute
        </button>

        <div className="grid grid-cols-2 gap-3">
          {ATTRIBUTES.map((attr) => {
            const { level } = getAttributeProgress(logs, attr.id);
            const unlocked = level > 0;
            return (
              <button
                key={attr.id}
                disabled={!unlocked}
                onClick={() => {
                  onSelect(attr.id);
                  onClose();
                }}
                className={`flex flex-col items-center gap-1 p-3 rounded-md bg-[#0d1117] transition-colors ${
                  selectedId === attr.id ? "ring-2 ring-emerald-500" : ""
                } ${unlocked ? "cursor-pointer hover:bg-[#1c2129]" : "opacity-40 cursor-not-allowed"}`}
              >
                <span className="text-sm font-semibold text-gray-200">
                  {unlocked ? getAttributeTitle(logs, attr.id) : attr.name}
                </span>
                {!unlocked && <span className="text-[10px] text-gray-500">Reach Level 1 to unlock</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
