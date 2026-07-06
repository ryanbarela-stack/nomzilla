import { useState } from "react";
import { ChampionCanvas } from "./ChampionCanvas";
import { ClassPicker } from "./ClassPicker";
import { TitlePicker } from "./TitlePicker";
import { AttributeStats } from "./AttributeStats";
import { getDisplayTitle } from "../lib/attributes";
import { CLASSES, getClass } from "../lib/classes";
import type { AttributeId, LogsByDate } from "../lib/types";

interface Props {
  health: number;
  logs: LogsByDate;
  titleAttributeId: AttributeId | null;
  classId: string | null;
  seenAttributeTiers: Record<string, number>;
  onChangeTitle: (id: AttributeId | null) => void;
  onChangeClass: (id: string) => void;
  onAcknowledgeAttributeTier: (id: AttributeId) => void;
}

export function ChampionHeader({
  health,
  logs,
  titleAttributeId,
  classId,
  seenAttributeTiers,
  onChangeTitle,
  onChangeClass,
  onAcknowledgeAttributeTier,
}: Props) {
  const [titlePickerOpen, setTitlePickerOpen] = useState(false);
  const [classPickerOpen, setClassPickerOpen] = useState(false);
  const displayTitle = getDisplayTitle(logs, titleAttributeId);
  const hasAnyTitle = getDisplayTitle(logs, null) !== null;
  const currentClass = getClass(classId);
  const healthPct = Math.round(health);

  return (
    <div className="flex flex-col gap-3">
      {!currentClass && (
        <div className="bg-emerald-950 border border-emerald-700 rounded-md px-3 py-2 text-sm text-emerald-200 flex items-center justify-between gap-2 flex-wrap">
          <span>Choose your champion's class:</span>
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

      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
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
            <h1 className="text-xl font-bold text-[#e6edf3] font-pixel">{currentClass ? currentClass.name : "Champion"}</h1>
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
                <span>Health</span>
                <span>{healthPct}%</span>
              </div>
              <div className="h-2 w-full bg-[#0d1117] border border-[#30363d] rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full transition-[width]"
                  style={{ width: `${healthPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <AttributeStats
          logs={logs}
          seenAttributeTiers={seenAttributeTiers}
          onAcknowledgeTier={onAcknowledgeAttributeTier}
        />
      </div>
    </div>
  );
}
