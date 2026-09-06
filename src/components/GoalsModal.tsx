import { useState } from "react";
import Modal from "./Modal";
import type { Goals } from "../types";

interface GoalsModalProps {
  goals: Goals;
  kaijuName: string;
  onClose: () => void;
  onSave: (goals: Goals) => void;
  onRename: (name: string) => void;
}

export default function GoalsModal({ goals, kaijuName, onClose, onSave, onRename }: GoalsModalProps) {
  const [calories, setCalories] = useState(String(goals.calories));
  const [protein, setProtein] = useState(String(goals.protein));
  const [carbs, setCarbs] = useState(String(goals.carbs));
  const [fat, setFat] = useState(String(goals.fat));
  const [name, setName] = useState(kaijuName);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      calories: Math.max(0, Number(calories) || 0),
      protein: Math.max(0, Number(protein) || 0),
      carbs: Math.max(0, Number(carbs) || 0),
      fat: Math.max(0, Number(fat) || 0),
    });
    if (name.trim()) onRename(name.trim());
    onClose();
  }

  return (
    <Modal title="Daily goals" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Kaiju name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-kaiju-border bg-kaiju-panel2 px-3 py-2 text-white focus:border-kaiju-green focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Calorie goal (kcal)</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full rounded-lg border border-kaiju-border bg-kaiju-panel2 px-3 py-2 text-white focus:border-kaiju-green focus:outline-none"
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
              className="w-full rounded-lg border border-kaiju-border bg-kaiju-panel2 px-3 py-2 text-white focus:border-kaiju-green focus:outline-none"
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
              className="w-full rounded-lg border border-kaiju-border bg-kaiju-panel2 px-3 py-2 text-white focus:border-kaiju-green focus:outline-none"
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
              className="w-full rounded-lg border border-kaiju-border bg-kaiju-panel2 px-3 py-2 text-white focus:border-kaiju-green focus:outline-none"
            />
          </div>
        </div>
        <p className="text-xs text-white/40">
          Your kaiju grows fastest when calories land within 10% of goal and protein hits its target. Carbs and fat have a
          wider comfort range.
        </p>
        <button
          type="submit"
          className="w-full rounded-lg bg-kaiju-green py-2.5 font-semibold text-kaiju-bg transition hover:brightness-110"
        >
          Save goals
        </button>
      </form>
    </Modal>
  );
}
