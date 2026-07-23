import { useState } from "react";
import type { DayLog, FoodEntry } from "../lib/types";
import { formatFriendly, todayISO } from "../lib/date";
import { formatProtein } from "../lib/foodFormat";
import { estimateFood, matchFoodSegment, splitFoodSegments } from "../lib/foodEstimate";
import { lookupSegmentsViaUsda } from "../lib/usdaEstimate";

interface Props {
  log: DayLog;
  target: number;
  proteinTarget: number;
  usdaApiKey: string;
  onAddEntry: (name: string, calories: number, protein?: number) => void;
  onUpdateEntry: (id: string, name: string, calories: number, protein?: number) => void;
  onRemoveEntry: (id: string) => void;
  onJumpToday: () => void;
  onChangeTarget: (value: number) => void;
  onChangeProteinTarget: (value: number) => void;
  onChangeUsdaApiKey: (value: string) => void;
}

export function CaloriePanel({
  log,
  target,
  proteinTarget,
  usdaApiKey,
  onAddEntry,
  onUpdateEntry,
  onRemoveEntry,
  onJumpToday,
  onChangeTarget,
  onChangeProteinTarget,
  onChangeUsdaApiKey,
}: Props) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [estimateNote, setEstimateNote] = useState<string | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetDraft, setTargetDraft] = useState(String(target));
  const [editingProteinTarget, setEditingProteinTarget] = useState(false);
  const [proteinTargetDraft, setProteinTargetDraft] = useState(String(proteinTarget));

  const total = log.entries.reduce((sum, e) => sum + e.calories, 0);
  const remaining = target - total;
  const isToday = log.date === todayISO();
  const pct = Math.min(100, Math.round((total / Math.max(1, target)) * 100));

  const proteinTotal = log.entries.reduce((sum, e) => sum + (e.protein ?? 0), 0);
  const proteinRemaining = proteinTarget - proteinTotal;
  const proteinPct = Math.min(100, Math.round((proteinTotal / Math.max(1, proteinTarget)) * 100));

  function commitTarget() {
    const val = Number(targetDraft);
    if (val > 0) onChangeTarget(Math.round(val));
    else setTargetDraft(String(target));
    setEditingTarget(false);
  }

  function commitProteinTarget() {
    const val = Number(proteinTargetDraft);
    if (val > 0) onChangeProteinTarget(Math.round(val));
    else setProteinTargetDraft(String(proteinTarget));
    setEditingProteinTarget(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cal = Number(calories);
    if (!name.trim() || !cal || cal <= 0) return;

    if (editingId) {
      onUpdateEntry(editingId, name.trim(), Math.round(cal), protein ? Number(protein) : undefined);
    } else {
      onAddEntry(name.trim(), Math.round(cal), protein ? Number(protein) : undefined);
    }
    setName("");
    setCalories("");
    setProtein("");
    setEstimateNote(null);
    setEditingId(null);
  }

  function startEdit(entry: FoodEntry) {
    setEditingId(entry.id);
    setName(entry.name);
    setCalories(String(entry.calories));
    setProtein(entry.protein !== undefined ? String(entry.protein) : "");
    setEstimateNote(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setCalories("");
    setProtein("");
    setEstimateNote(null);
  }

  function finishEstimate(calories: number, protein: number, unmatched: string[], source: string) {
    if (calories <= 0 && protein <= 0) {
      setEstimateNote("Couldn't estimate that — try common food names, or enter kcal/protein manually.");
      return;
    }
    setCalories(String(Math.round(calories)));
    setProtein(String(Math.round(protein)));
    setEstimateNote(
      unmatched.length > 0
        ? `Estimated (${source}) — couldn't match: ${unmatched.join(", ")}. Adjust before adding.`
        : `Estimated (${source}) — adjust before adding if it looks off.`,
    );
  }

  async function handleEstimate() {
    const key = usdaApiKey.trim();
    const segments = splitFoodSegments(name);

    if (!key || segments.length === 0) {
      const local = estimateFood(name);
      finishEstimate(local?.calories ?? 0, local?.protein ?? 0, local?.unmatched ?? [], "local table");
      return;
    }

    setEstimating(true);
    try {
      const usda = await lookupSegmentsViaUsda(segments, key);
      let calories = usda.calories;
      let protein = usda.protein;
      const unmatched: string[] = [];

      for (const segment of usda.stillUnmatched) {
        const local = matchFoodSegment(segment);
        if (local) {
          calories += local.calories;
          protein += local.protein;
        } else {
          unmatched.push(segment);
        }
      }

      const usedLocalFallback = unmatched.length < usda.stillUnmatched.length;
      finishEstimate(calories, protein, unmatched, usedLocalFallback ? "USDA + local table" : "USDA");
    } catch {
      const local = estimateFood(name);
      if (local && (local.calories > 0 || local.protein > 0)) {
        setCalories(String(local.calories));
        setProtein(String(local.protein));
      }
      setEstimateNote(
        local
          ? "USDA lookup failed (check your API key or connection) — showing local-table estimate only."
          : "USDA lookup failed (check your API key or connection), and no local match either.",
      );
    } finally {
      setEstimating(false);
    }
  }

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-semibold text-[#e6edf3]">{formatFriendly(log.date)}</h2>
          {!isToday && (
            <button
              onClick={onJumpToday}
              className="text-xs text-emerald-400 hover:text-emerald-300 underline"
            >
              jump to today
            </button>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#e6edf3]">
            {total}{" "}
            <span className="text-sm font-normal text-gray-400">
              /{" "}
              {editingTarget ? (
                <input
                  autoFocus
                  type="number"
                  value={targetDraft}
                  onChange={(e) => setTargetDraft(e.target.value)}
                  onBlur={commitTarget}
                  onKeyDown={(e) => e.key === "Enter" && commitTarget()}
                  className="w-20 bg-[#0d1117] border border-emerald-600 rounded px-1 py-0.5 text-[#e6edf3] text-sm focus:outline-none"
                />
              ) : (
                <button
                  onClick={() => {
                    setTargetDraft(String(target));
                    setEditingTarget(true);
                  }}
                  className="underline decoration-dotted hover:text-emerald-400"
                >
                  {target}
                </button>
              )}{" "}
              kcal
            </span>
          </div>
          <div className={`text-sm ${remaining >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {remaining >= 0 ? `${remaining} remaining` : `${Math.abs(remaining)} over`}
          </div>
        </div>
      </div>

      <div className="w-full h-2 bg-[#0d1117] rounded overflow-hidden border border-[#30363d]">
        <div
          className={`h-full ${total > target ? "bg-red-500" : "bg-emerald-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="pl-3 border-l-2 border-[#30363d] flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-gray-400">Protein</span>
          <span className="text-xs text-gray-400">
            {proteinTotal}g /{" "}
            {editingProteinTarget ? (
              <input
                autoFocus
                type="number"
                value={proteinTargetDraft}
                onChange={(e) => setProteinTargetDraft(e.target.value)}
                onBlur={commitProteinTarget}
                onKeyDown={(e) => e.key === "Enter" && commitProteinTarget()}
                className="w-14 bg-[#0d1117] border border-sky-600 rounded px-1 py-0.5 text-[#e6edf3] text-xs focus:outline-none"
              />
            ) : (
              <button
                onClick={() => {
                  setProteinTargetDraft(String(proteinTarget));
                  setEditingProteinTarget(true);
                }}
                className="underline decoration-dotted hover:text-sky-400"
              >
                {proteinTarget}
              </button>
            )}
            g
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#0d1117] rounded overflow-hidden border border-[#30363d]">
          <div className="h-full bg-sky-500" style={{ width: `${proteinPct}%` }} />
        </div>
        {proteinRemaining >= 0 ? (
          <span className="text-xs text-gray-500">{proteinRemaining}g remaining</span>
        ) : (
          <span className="text-xs text-sky-400">{Math.abs(proteinRemaining)}g over target</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Food name or description, e.g. 2 eggs and toast"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setEstimateNote(null);
            }}
            className="flex-1 min-w-[120px] bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-sm text-[#e6edf3] placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={handleEstimate}
            disabled={!name.trim() || estimating}
            className="bg-[#0d1117] border border-emerald-600 text-emerald-400 hover:bg-emerald-950 disabled:opacity-40 disabled:cursor-not-allowed rounded px-3 py-2 text-sm font-medium"
          >
            {estimating ? "Estimating…" : "Estimate"}
          </button>
          <input
            type="number"
            placeholder="kcal"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-24 bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-sm text-[#e6edf3] placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
            min={1}
          />
          <input
            type="number"
            placeholder="Protein (g)"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            min={0}
            className="w-28 bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-sm text-[#e6edf3] placeholder:text-gray-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded px-4 py-2 text-sm font-medium"
          >
            {editingId ? "Save" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-[#0d1117] border border-[#30363d] text-gray-400 hover:text-gray-200 rounded px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
          )}
        </div>
        {editingId && <p className="text-xs text-sky-400">Editing entry — Save to update, or Cancel.</p>}
        {estimateNote && <p className="text-xs text-gray-500">{estimateNote}</p>}

        <details className="text-xs text-gray-500">
          <summary className="cursor-pointer hover:text-emerald-400 select-none">
            Improve estimates with a free USDA API key
          </summary>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <input
              type="text"
              placeholder="USDA API key (optional)"
              value={usdaApiKey}
              onChange={(e) => onChangeUsdaApiKey(e.target.value)}
              className="flex-1 min-w-[160px] bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-xs text-[#e6edf3] placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
            />
            <a
              href="https://fdc.nal.usda.gov/api-key-signup"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline"
            >
              Get a free key
            </a>
          </div>
          <p className="mt-1 text-gray-600">
            When set, USDA is checked first for real nutrition data; the built-in table only fills in
            anything USDA can't find. Stored only on this device.
          </p>
        </details>
      </form>

      <ul className="flex flex-col gap-1 max-h-64 overflow-y-auto">
        {log.entries.length === 0 && (
          <li className="text-sm text-gray-500 italic py-2">No food logged yet.</li>
        )}
        {log.entries.map((entry) => {
          const protein = formatProtein(entry);
          return (
            <li
              key={entry.id}
              className={`flex items-center justify-between bg-[#0d1117] border rounded px-3 py-2 ${
                editingId === entry.id ? "border-sky-600" : "border-[#21262d]"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm text-[#e6edf3]">{entry.name}</span>
                {protein && <span className="text-xs text-gray-500">{protein}</span>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">{entry.calories} kcal</span>
                <button
                  onClick={() => startEdit(entry)}
                  className="text-gray-500 hover:text-emerald-400 text-sm"
                  aria-label="Edit entry"
                >
                  ✎
                </button>
                <button
                  onClick={() => {
                    onRemoveEntry(entry.id);
                    if (editingId === entry.id) cancelEdit();
                  }}
                  className="text-gray-500 hover:text-red-400 text-sm"
                  aria-label="Remove entry"
                >
                  ✕
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
