import { BORDERS, isBorderUnlocked } from "../lib/borders";

interface Props {
  selectedId: string;
  totalDaysLogged: number;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function BorderPicker({ selectedId, totalDaysLogged, onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 max-w-md w-full max-h-[80vh] flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-pixel font-bold text-[#e6edf3]">Frame borders</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 px-2 text-lg leading-none">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 overflow-y-auto pr-1">
          {BORDERS.map((border) => {
            const unlocked = isBorderUnlocked(border, totalDaysLogged);
            return (
              <button
                key={border.id}
                disabled={!unlocked}
                onClick={() => {
                  onSelect(border.id);
                  onClose();
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-md bg-[#0d1117] transition-colors ${
                  border.id === selectedId ? "ring-2 ring-emerald-500" : ""
                } ${unlocked ? "cursor-pointer hover:bg-[#1c2129]" : "opacity-40 cursor-not-allowed"}`}
              >
                <div className={`w-12 h-12 rounded-md bg-[#161b22] ${border.className}`} />
                <span className="text-xs text-gray-300">{border.name}</span>
                {!unlocked && <span className="text-[10px] text-gray-500">{border.minDays}d logged</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
