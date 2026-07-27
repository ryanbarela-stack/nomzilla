import { useState } from "react";
import { ATTRIBUTES } from "../lib/attributes";
import { formatHabitDetails } from "../lib/habitFormat";
import { parseWorkoutText, type ParsedExercise } from "../lib/workoutImport";
import type { AttributeId, SetDetail } from "../lib/types";

export interface ImportedExercise {
  description: string;
  attributeId: AttributeId;
  setDetails?: SetDetail[];
}

interface Props {
  onImport: (entries: ImportedExercise[]) => void;
  onClose: () => void;
}

export function ImportWorkoutModal({ onImport, onClose }: Props) {
  const [text, setText] = useState("");
  const [attributeId, setAttributeId] = useState<AttributeId | null>(null);
  const [parsed, setParsed] = useState<ParsedExercise[] | null>(null);

  function handleParse() {
    setParsed(parseWorkoutText(text));
  }

  function removeParsedRow(index: number) {
    setParsed((prev) => (prev ? prev.filter((_, i) => i !== index) : prev));
  }

  function handleImport() {
    if (!parsed || !attributeId || parsed.length === 0) return;
    onImport(
      parsed.map((p) => ({
        description: p.description,
        attributeId,
        setDetails: p.setDetails.length > 0 ? p.setDetails : undefined,
      })),
    );
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 max-w-lg w-full max-h-[85vh] flex flex-col gap-4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-pixel font-bold text-[#e6edf3] text-sm">Import workout</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 px-2 text-lg leading-none">
            ✕
          </button>
        </div>

        {parsed === null ? (
          <>
            <p className="text-xs text-gray-400">
              Paste a workout below, one exercise per line — e.g. "Bench Press 3x10 135lb" or "Squat 135x10, 155x8,
              175x6". You'll get a chance to remove anything that parses wrong before it's added.
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder={"Bench Press 3x10 135lb\nSquat 5x5 @ 225\nPlank 3x30"}
              className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-sm text-[#e6edf3] placeholder:text-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-gray-400">Attribute for this whole workout</div>
              <div className="flex flex-wrap gap-2">
                {ATTRIBUTES.map((attr) => {
                  const selected = attributeId === attr.id;
                  return (
                    <button
                      key={attr.id}
                      type="button"
                      onClick={() => setAttributeId(attr.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        selected
                          ? attr.activeButtonClassName
                          : "bg-[#0d1117] border-[#30363d] text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      {attr.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={handleParse}
              disabled={!text.trim() || !attributeId}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded px-4 py-2 text-sm font-medium"
            >
              Parse
            </button>
          </>
        ) : (
          <>
            <p className="text-xs text-gray-400">
              Remove anything that didn't parse right — reps/weight per set can still be fixed after importing, any
              time before you complete each one.
            </p>
            <ul className="flex flex-col gap-1">
              {parsed.length === 0 && (
                <li className="text-sm text-gray-500 italic py-2">Nothing parsed from that text.</li>
              )}
              {parsed.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between bg-[#0d1117] border border-[#21262d] rounded px-3 py-2"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-[#e6edf3]">{p.description}</span>
                    {formatHabitDetails(p) && <span className="text-xs text-gray-500">{formatHabitDetails(p)}</span>}
                  </div>
                  <button
                    onClick={() => removeParsedRow(i)}
                    className="text-gray-500 hover:text-red-400 text-sm"
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <button
                onClick={() => setParsed(null)}
                className="flex-1 bg-[#0d1117] border border-[#30363d] hover:border-gray-500 text-gray-300 rounded px-4 py-2 text-sm font-medium"
              >
                Back
              </button>
              <button
                onClick={handleImport}
                disabled={parsed.length === 0}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded px-4 py-2 text-sm font-medium"
              >
                Add {parsed.length} to today's plan
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
