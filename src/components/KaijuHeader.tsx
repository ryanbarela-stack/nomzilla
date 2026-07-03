import { useState } from "react";
import { KaijuCanvas } from "./KaijuCanvas";
import { GROWTH_STAGES, getNextStage, type GrowthStage } from "../lib/streak";

interface Props {
  streak: number;
  stage: GrowthStage;
  target: number;
  onChangeTarget: (value: number) => void;
}

export function KaijuHeader({ streak, stage, target, onChangeTarget }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(target));
  const next = getNextStage(stage);
  const daysToNext = next ? Math.max(0, next.minStreak - streak) : null;

  function commitTarget() {
    const val = Number(draft);
    if (val > 0) onChangeTarget(Math.round(val));
    else setDraft(String(target));
    setEditing(false);
  }

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4">
      <KaijuCanvas stage={stage.index} size={128} />

      <div className="flex-1 w-full flex flex-col gap-2 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <h1 className="text-xl font-bold text-[#e6edf3] font-pixel">{stage.name}</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-700">
            Stage {stage.index + 1}/{GROWTH_STAGES.length}
          </span>
        </div>

        <div className="text-sm text-gray-400">
          🔥 <span className="text-orange-400 font-semibold">{streak}</span> day logging streak
          {next && (
            <span> — log {daysToNext} more day{daysToNext === 1 ? "" : "s"} to reach <span className="text-gray-300">{next.name}</span></span>
          )}
          {!next && <span className="text-emerald-400"> — max evolution reached!</span>}
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
          <span className="text-gray-400">Daily target:</span>
          {editing ? (
            <input
              autoFocus
              type="number"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitTarget}
              onKeyDown={(e) => e.key === "Enter" && commitTarget()}
              className="w-24 bg-[#0d1117] border border-emerald-600 rounded px-2 py-1 text-[#e6edf3] focus:outline-none"
            />
          ) : (
            <button
              onClick={() => {
                setDraft(String(target));
                setEditing(true);
              }}
              className="text-emerald-400 font-semibold underline decoration-dotted"
            >
              {target} kcal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
