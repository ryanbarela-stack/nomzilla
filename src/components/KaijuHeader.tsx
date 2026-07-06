import { useState } from "react";
import { KaijuCanvas } from "./KaijuCanvas";
import { BorderPicker } from "./BorderPicker";
import { PathPicker } from "./PathPicker";
import { getNextStage, type GrowthStage } from "../lib/streak";
import { BORDERS, getBorderById, isBorderUnlocked } from "../lib/borders";
import { PATHS, getPath, getStageDisplayName, getStagePreviewName } from "../lib/paths";

interface Props {
  streak: number;
  stage: GrowthStage;
  target: number;
  pathId: string | null;
  borderId: string;
  totalDaysLogged: number;
  levelIndex: number;
  seenLevelIndex: number;
  onChangeTarget: (value: number) => void;
  onChangePath: (id: string) => void;
  onChangeBorder: (id: string) => void;
  onAcknowledgeLevelUp: () => void;
}

export function KaijuHeader({
  streak,
  stage,
  target,
  pathId,
  borderId,
  totalDaysLogged,
  levelIndex,
  seenLevelIndex,
  onChangeTarget,
  onChangePath,
  onChangeBorder,
  onAcknowledgeLevelUp,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(target));
  const [pathPickerOpen, setPathPickerOpen] = useState(false);
  const [borderPickerOpen, setBorderPickerOpen] = useState(false);
  const next = getNextStage(stage);
  const daysToNext = next ? Math.max(0, next.minStreak - streak) : null;

  const selectedBorder = getBorderById(borderId);
  const frameBorder = isBorderUnlocked(selectedBorder, totalDaysLogged) ? selectedBorder : BORDERS[0];
  const currentLevelBorder = BORDERS[levelIndex];
  const leveledUp = levelIndex > seenLevelIndex;

  const currentPath = getPath(pathId);
  const readyToChoosePath = stage.index >= 1 && !currentPath;
  const canChangePath = stage.index >= 1;

  const stageProgressPct = next
    ? Math.min(100, Math.max(0, ((streak - stage.minStreak) / (next.minStreak - stage.minStreak)) * 100))
    : 100;

  function commitTarget() {
    const val = Number(draft);
    if (val > 0) onChangeTarget(Math.round(val));
    else setDraft(String(target));
    setEditing(false);
  }

  return (
    <div className="flex flex-col gap-3">
      {leveledUp && (
        <div className="bg-indigo-950 border border-indigo-700 rounded-md px-3 py-2 text-sm text-indigo-200 flex items-center justify-between gap-2">
          <span>
            Level {levelIndex + 1} reached — <strong>{currentLevelBorder.name}</strong> border unlocked!
          </span>
          <button onClick={onAcknowledgeLevelUp} className="text-indigo-300 hover:text-white text-xs underline shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {readyToChoosePath && (
        <div className="bg-emerald-950 border border-emerald-700 rounded-md px-3 py-2 text-sm text-emerald-200 flex items-center justify-between gap-2 flex-wrap">
          <span>Your kaiju is ready to evolve! Choose a path:</span>
          <div className="flex gap-2">
            {PATHS.map((path) => (
              <button
                key={path.id}
                onClick={() => onChangePath(path.id)}
                className="text-xs px-2 py-1 rounded-md bg-emerald-900 border border-emerald-700 hover:bg-emerald-800 text-emerald-100"
              >
                {path.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className={`bg-[#0d1117] rounded-lg p-2 inline-flex items-end justify-center ${frameBorder.className}`}>
            <KaijuCanvas stage={stage.index} pathId={currentPath?.id ?? null} size={128} />
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {canChangePath && (
              <>
                <button
                  onClick={() => setPathPickerOpen(true)}
                  className="text-xs text-gray-400 hover:text-emerald-400 underline decoration-dotted"
                >
                  Path: {currentPath ? currentPath.name : "Choose"}
                </button>
                <span className="text-gray-600">·</span>
              </>
            )}
            <button
              onClick={() => setBorderPickerOpen(true)}
              className="text-xs text-gray-400 hover:text-indigo-400 underline decoration-dotted"
            >
              Frame: {selectedBorder.name}
            </button>
          </div>
        </div>

        {pathPickerOpen && (
          <PathPicker selectedId={pathId} onSelect={onChangePath} onClose={() => setPathPickerOpen(false)} />
        )}

        {borderPickerOpen && (
          <BorderPicker
            selectedId={borderId}
            totalDaysLogged={totalDaysLogged}
            onSelect={onChangeBorder}
            onClose={() => setBorderPickerOpen(false)}
          />
        )}

        <div className="flex-1 w-full flex flex-col gap-2 text-center sm:text-left">
          <h1 className="text-xl font-bold text-[#e6edf3] font-pixel">{getStageDisplayName(stage, pathId)}</h1>

          <div className="flex flex-col gap-0.5 w-full max-w-xs mx-auto sm:mx-0">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span><span className="text-orange-400 font-semibold">{streak}</span>-day streak</span>
              <span>{next ? `${daysToNext}d to ${getStagePreviewName(next, pathId)}` : "Max evolution"}</span>
            </div>
            <div className="h-2 w-full bg-[#0d1117] border border-[#30363d] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-[width]"
                style={{ width: `${stageProgressPct}%` }}
              />
            </div>
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
    </div>
  );
}
