import { CHARACTERS } from "../lib/characters";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function CharacterPicker({ selectedId, onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 max-w-lg w-full max-h-[80vh] flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-pixel font-bold text-[#e6edf3]">Choose your kaiju</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 px-2 text-lg leading-none">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 overflow-y-auto pr-1">
          {CHARACTERS.map((c) => (
            <button
              key={c.id}
              title={c.name}
              onClick={() => {
                onSelect(c.id);
                onClose();
              }}
              className={`aspect-square rounded-md border-2 flex items-center justify-center bg-[#0d1117] transition-colors ${
                c.id === selectedId ? "border-emerald-500" : "border-[#30363d] hover:border-gray-500"
              }`}
            >
              {c.kind === "sprite" ? (
                <img src={c.src} alt={c.name} className="pixelated w-3/4 h-3/4 object-contain" />
              ) : (
                <span className="text-xl">🦖</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
