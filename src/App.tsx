import { useMemo, useState } from "react";
import { useAppData } from "./lib/useAppData";
import { sumMacros, scoreDay, pct } from "./lib/nutrition";
import KaijuDisplay from "./components/KaijuDisplay";
import CalorieRing from "./components/CalorieRing";
import MacroBar from "./components/MacroBar";
import EntryList from "./components/EntryList";
import AddEntryModal from "./components/AddEntryModal";
import GoalsModal from "./components/GoalsModal";
import HistoryView from "./components/HistoryView";

type Tab = "today" | "history";

function App() {
  const { data, todayEntries, addEntry, removeEntry, updateGoals, renameKaiju } = useAppData();
  const [tab, setTab] = useState<Tab>("today");
  const [showAdd, setShowAdd] = useState(false);
  const [showGoals, setShowGoals] = useState(false);

  const todayMacros = useMemo(() => sumMacros(todayEntries), [todayEntries]);
  const todayScore = useMemo(
    () => (todayEntries.length > 0 ? scoreDay(todayMacros, data.goals).overall : null),
    [todayEntries, todayMacros, data.goals],
  );

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl px-4 pb-24 pt-6">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white">
            Nom<span className="text-kaiju-green">zilla</span>
          </h1>
          <p className="text-xs text-white/40">Feed it well. Watch it grow.</p>
        </div>
        <button
          onClick={() => setShowGoals(true)}
          className="rounded-lg border border-kaiju-border bg-kaiju-panel px-3 py-2 text-sm text-white/70 transition hover:border-kaiju-green hover:text-white"
        >
          ⚙ Goals
        </button>
      </header>

      <nav className="mb-5 flex gap-2 rounded-xl border border-kaiju-border bg-kaiju-panel p-1">
        {(["today", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition ${
              tab === t ? "bg-kaiju-green text-kaiju-bg" : "text-white/60 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "today" ? (
        <div className="space-y-4">
          <KaijuDisplay
            name={data.kaijuName}
            totalXp={data.kaiju.totalXp}
            streak={data.kaiju.streak}
            bestStreak={data.kaiju.bestStreak}
            todayScore={todayScore}
          />

          <div className="rounded-2xl border border-kaiju-border bg-kaiju-panel p-5">
            <div className="flex items-center gap-5">
              <CalorieRing actual={todayMacros.calories} goal={data.goals.calories} />
              <div className="flex-1 space-y-3">
                <MacroBar label="Protein" actual={todayMacros.protein} goal={data.goals.protein} color="#a374ff" />
                <MacroBar label="Carbs" actual={todayMacros.carbs} goal={data.goals.carbs} color="#39e6c8" />
                <MacroBar label="Fat" actual={todayMacros.fat} goal={data.goals.fat} color="#ffcf5c" />
              </div>
            </div>
            {todayScore !== null && (
              <p className="mt-4 text-center text-xs text-white/40">
                Today's adherence score: <span className="font-semibold text-white/70">{Math.round(todayScore)}</span> ·
                calories at {pct(todayMacros.calories, data.goals.calories)}% of goal
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-kaiju-border bg-kaiju-panel p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-white">Today's food</h3>
              <button
                onClick={() => setShowAdd(true)}
                className="rounded-lg bg-kaiju-green px-3 py-1.5 text-sm font-semibold text-kaiju-bg transition hover:brightness-110"
              >
                + Add food
              </button>
            </div>
            <EntryList entries={todayEntries} onRemove={removeEntry} />
          </div>
        </div>
      ) : (
        <HistoryView data={data} />
      )}

      {showAdd && <AddEntryModal onClose={() => setShowAdd(false)} onAdd={addEntry} />}
      {showGoals && (
        <GoalsModal
          goals={data.goals}
          kaijuName={data.kaijuName}
          onClose={() => setShowGoals(false)}
          onSave={updateGoals}
          onRename={renameKaiju}
        />
      )}
    </div>
  );
}

export default App;
