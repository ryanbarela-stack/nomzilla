import type { FoodEntry } from "../types";

interface EntryListProps {
  entries: FoodEntry[];
  onRemove: (id: string) => void;
}

export default function EntryList({ entries, onRemove }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-kaiju-border py-6 text-center text-sm text-white/40">
        Nothing logged yet today. Feed your kaiju!
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {entries
        .slice()
        .sort((a, b) => b.loggedAt - a.loggedAt)
        .map((entry) => (
          <li
            key={entry.id}
            className="flex items-center justify-between rounded-xl border border-kaiju-border bg-kaiju-panel2 px-3 py-2.5"
          >
            <div>
              <p className="text-sm font-medium text-white">{entry.name}</p>
              <p className="text-xs text-white/50">
                {entry.calories} kcal · P{entry.protein}g · C{entry.carbs}g · F{entry.fat}g
              </p>
            </div>
            <button
              onClick={() => onRemove(entry.id)}
              className="rounded-full px-2 py-1 text-white/40 transition hover:bg-white/10 hover:text-kaiju-red"
              aria-label={`Remove ${entry.name}`}
            >
              ✕
            </button>
          </li>
        ))}
    </ul>
  );
}
