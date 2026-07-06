import { useState } from "react";
import { ChampionCanvas } from "./ChampionCanvas";
import { ClassPicker } from "./ClassPicker";
import { TitlePicker } from "./TitlePicker";
import { getNextChampionStage, type ChampionStage } from "../lib/championStages";
import { getDisplayTitle } from "../lib/attributes";
import { CLASSES, getClass } from "../lib/classes";
import type { AttributeId, LogsByDate } from "../lib/types";

interface Props {
  streak: number;
  stage: ChampionStage;
  logs: LogsByDate;
  titleAttributeId: AttributeId | null;
  seenStageIndex: number;
  classId: string | null;
  onChangeTitle: (id: AttributeId | null) => void;
  onAcknowledgeStageUp: () => void;
  onChangeClass: (id: string) => void;
}

export function ChampionHeader({
  streak,
  stage,
  logs,
  titleAttributeId,
  seenStageIndex,
  classId,
  onChangeTitle,
  onAcknowledgeStageUp,
  onChangeClass,
}: Props) {
  const [titlePickerOpen, setTitlePickerOpen] = useState(false);
  const [classPickerOpen, setClassPickerOpen] = useState(false);
  const next = getNextChampionStage(stage);
  const daysToNext = next ? Math.max(0, next.minStreak - streak) : null;
  const displayTitle = getDisplayTitle(logs, titleAttributeId);
  const hasAnyTitle = getDisplayTitle(logs, null) !== null;
  const stageProgressPct = next
    ? Math.min(100, Math.max(0, ((streak - stage.minStreak) / (next.minStreak - stage.minStreak)) * 100))
    : 100;
  const stagedUp = stage.index > seenStageIndex;
  const currentClass = getClass(classId);

  return (
    <div className="flex flex-col gap-3">
      {stagedUp && (
        <div className="bg-indigo-950 border border-indigo-700 rounded-md px-3 py-2 text-sm text-indigo-200 flex items-center justify-between gap-2">
          <span>
            🏅 Your champion advanced to <strong>{stage.name}</strong>!
          </span>
          <button onClick={onAcknowledgeStageUp} className="text-indigo-300 hover:text-white text-xs underline shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {!currentClass && (
        <div className="bg-emerald-950 border border-emerald-700 rounded-md px-3 py-2 text-sm text-emerald-200 flex items-center justify-between gap-2 flex-wrap">
          <span>⚔️ Choose your champion's class:</span>
          <div className="flex gap-2 flex-wrap">
            {CLASSES.map((champClass) => (
              <button
                key={champClass.id}
                onClick={() => onChangeClass(champClass.id)}
                className="text-xs px-2 py-1 rounded-md bg-emerald-900 border border-emerald-700 hover:bg-emerald-800 text-emerald-100"
              >
                {champClass.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="bg-[#0d1117] rounded-lg p-2 border-2 border-[#30363d] inline-flex items-end justify-center">
            <ChampionCanvas classId={currentClass?.id ?? null} size={128} />
          </div>
          <button
            onClick={() => setClassPickerOpen(true)}
            className="text-xs text-gray-400 hover:text-emerald-400 underline decoration-dotted"
          >
            Class: {currentClass ? currentClass.name : "Choose"}
          </button>
        </div>

        {classPickerOpen && (
          <ClassPicker selectedId={classId} onSelect={onChangeClass} onClose={() => setClassPickerOpen(false)} />
        )}

        {titlePickerOpen && (
          <TitlePicker
            selectedId={titleAttributeId}
            logs={logs}
            onSelect={onChangeTitle}
            onClose={() => setTitlePickerOpen(false)}
          />
        )}

        <div className="flex-1 w-full flex flex-col gap-2 text-center sm:text-left">
          <h1 className="text-xl font-bold text-[#e6edf3] font-pixel">{stage.name}</h1>
          {displayTitle && <p className="text-xs text-indigo-300 italic -mt-1">{displayTitle}</p>}
          {hasAnyTitle && (
            <button
              onClick={() => setTitlePickerOpen(true)}
              className="text-xs text-gray-400 hover:text-yellow-400 underline decoration-dotted self-center sm:self-start -mt-1"
            >
              Title: {displayTitle ?? "Auto"}
            </button>
          )}

          <div className="flex flex-col gap-0.5 w-full max-w-xs mx-auto sm:mx-0">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>💪 <span className="text-orange-400 font-semibold">{streak}</span>-day training streak</span>
              <span>{next ? `${daysToNext}d to ${next.name}` : "Max stage"}</span>
            </div>
            <div className="h-2 w-full bg-[#0d1117] border border-[#30363d] rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-[width]"
                style={{ width: `${stageProgressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
