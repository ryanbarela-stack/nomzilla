import { MAX_ACTION_POINTS } from "../lib/monsterEncounter";
import type { Monster } from "../lib/monsters";

interface Props {
  monster: Monster | null;
  currentHealth: number;
  actionPoints: number;
  abilityName: string | null;
  onAttack: () => void;
}

export function MonsterCard({ monster, currentHealth, actionPoints, abilityName, onAttack }: Props) {
  const actionPointsLabel = `⚡ ${actionPoints}/${MAX_ACTION_POINTS}`;

  if (!monster) {
    return (
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex items-center justify-between gap-2">
        <span className="text-sm text-gray-500 italic">
          The wilds are quiet — a monster will emerge sometime this week.
        </span>
        <span className="text-xs text-gray-500">{actionPointsLabel}</span>
      </div>
    );
  }

  const pct = Math.max(0, Math.min(100, Math.round((currentHealth / monster.maxHealth) * 100)));
  const canAttack = actionPoints > 0 && !!abilityName;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="bg-[#0d1117] rounded-lg p-2 border-2 border-[#30363d] flex items-center justify-center">
          <img src={monster.sprite} alt={monster.name} className="pixelated" width={72} height={72} />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#e6edf3]">{monster.name}</span>
            <span className="text-xs text-gray-400">
              {currentHealth}/{monster.maxHealth} HP
            </span>
          </div>
          <div className="h-2 w-full bg-[#0d1117] border border-[#30363d] rounded-full overflow-hidden">
            <div className="h-full bg-red-600 rounded-full transition-[width]" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-gray-500">{monster.tagline}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-gray-400">{actionPointsLabel}</span>
        <button
          onClick={onAttack}
          disabled={!canAttack}
          className="bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded px-4 py-2 text-sm font-medium"
        >
          {abilityName ? `Attack (${abilityName})` : "Choose a class to attack"}
        </button>
      </div>
    </div>
  );
}
