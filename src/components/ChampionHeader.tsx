import { useState } from "react";
import { TitlePicker } from "./TitlePicker";
import { getNextChampionStage, type ChampionStage } from "../lib/championStages";
import { getDisplayTitle } from "../lib/attributes";
import type { AttributeId, LogsByDate } from "../lib/types";

interface Props {
  streak: number;
  stage: ChampionStage;
  logs: LogsByDate;
  titleAttributeId: AttributeId | null;
  seenStageIndex: number;
  onChangeTitle: (id: AttributeId | null) => void;
  onAcknowledgeStageUp: () => void;
}

export function ChampionHeader({
  streak,
  stage,
  logs,
  titleAttributeId,
  seenStageIndex,
  onChangeTitle,
  onAcknowledgeStageUp,
}: Props) {
  const [titlePickerOpen, setTitlePickerOpen] = useState(false);
  const next = getNextChampionStage(stage);
  const daysToNext = next ? Math.max(0, next.minStreak - streak) : null;
  const displayTitle = getDisplayTitle(logs, titleAttributeId);
  const hasAnyTitle = getDisplayTitle(logs, null) !== null;
  const stageProgressPct = next
    ? Math.min(100, Math.max(0, ((streak - stage.minStreak) / (next.minStreak - stage.minStreak)) * 100))
    : 100;
  const stagedUp = stage.index > seenStageIndex;

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

      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-32 h-32 rounded-lg border-2 border-dashed border-[#30363d] bg-[#0d1117] flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#4b5563" strokeWidth="1.5">
              <circle cx="12" cy="6" r="3.25" />
              <path d="M4.5 20.5c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[10px] text-gray-500 italic">Art coming soon</span>
        </div>

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
