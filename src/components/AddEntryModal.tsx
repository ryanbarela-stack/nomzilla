import { useState } from "react";
import Modal from "./Modal";
import type { FoodEntry } from "../types";

interface AddEntryModalProps {
  onClose: () => void;
  onAdd: (entry: Omit<FoodEntry, "id" | "loggedAt">) => void;
}

export default function AddEntryModal({ onClose, onAdd }: AddEntryModalProps) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cal = Number(calories);
    if (!name.trim()) {
      setError("Give this food a name.");
      return;
    }
    if (!calories || Number.isNaN(cal) || cal < 0) {
      setError("Enter a valid calorie amount.");
      return;
    }
    onAdd({
      name: name.trim(),
      calories: cal,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    });
    onClose();
  }

  return (
    <Modal title="Log food" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Food name</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Grilled chicken bowl"
            className="w-full rounded-lg border border-kaiju-border bg-kaiju-panel2 px-3 py-2 text-white placeholder:text-white/30 focus:border-kaiju-green focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Calories</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="450"
            className="w-full rounded-lg border border-kaiju-border bg-kaiju-panel2 px-3 py-2 text-white placeholder:text-white/30 focus:border-kaiju-green focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Protein (g)</label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="35"
              className="w-full rounded-lg border border-kaiju-border bg-kaiju-panel2 px-3 py-2 text-white placeholder:text-white/30 focus:border-kaiju-green focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Carbs (g)</label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="40"
              className="w-full rounded-lg border border-kaiju-border bg-kaiju-panel2 px-3 py-2 text-white placeholder:text-white/30 focus:border-kaiju-green focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Fat (g)</label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              placeholder="15"
              className="w-full rounded-lg border border-kaiju-border bg-kaiju-panel2 px-3 py-2 text-white placeholder:text-white/30 focus:border-kaiju-green focus:outline-none"
            />
          </div>
        </div>
        {error && <p className="text-sm text-kaiju-red">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-kaiju-green py-2.5 font-semibold text-kaiju-bg transition hover:brightness-110"
        >
          Add to today
        </button>
      </form>
    </Modal>
  );
}
