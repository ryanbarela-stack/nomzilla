import { PATHS } from "../lib/paths";

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function PathPicker({ selectedId, onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 max-w-md w-full flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-pixel font-bold text-[#e6edf3]">Choose your path</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 px-2 text-lg leading-none">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {PATHS.map((path) => (
            <button
              key={path.id}
              onClick={() => {
                onSelect(path.id);
                onClose();
              }}
              className={`flex flex-col items-center gap-1 p-3 rounded-md bg-[#0d1117] transition-colors cursor-pointer hover:bg-[#1c2129] ${
                path.id === selectedId ? "ring-2 ring-emerald-500" : ""
              }`}
            >
              <span className="text-sm font-semibold text-gray-200">{path.name}</span>
              <span className="text-[10px] text-gray-500 text-center">{path.tagline}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
