import { ATTRIBUTES } from "../lib/attributes";
import { MAX_ACTION_POINTS } from "../lib/monsterEncounter";
import type { Ability } from "../lib/abilities";
import type { AttributeId } from "../lib/types";
import type { Monster } from "../lib/monsters";

export interface AttackOption {
  ability: Ability;
  level: number;
}

interface Props {
  monster: Monster | null;
  currentHealth: number;
  actionPoints: number;
  attacks: AttackOption[];
  onAttack: (attributeId: AttributeId) => void;
}

export function MonsterCard({ monster, currentHealth, actionPoints, attacks, onAttack }: Props) {
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
  const weakness = ATTRIBUTES.find((attr) => attr.id === monster.weakness);

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
          {weakness && (
            <span className="text-xs" style={{ color: weakness.hex }}>
              Weak to {weakness.name} — undefeated at week's end drops your {weakness.name} by 1 level
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Attacks</span>
          <span className="text-xs text-gray-400">{actionPointsLabel}</span>
        </div>

        {attacks.length === 0 ? (
          <span className="text-xs text-gray-500 italic">Choose a class to attack.</span>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {attacks.map(({ ability, level }) => {
              const attr = ATTRIBUTES.find((a) => a.id === ability.scalesWith);
              const isWeakness = ability.scalesWith === monster.weakness;
              return (
                <button
                  key={ability.scalesWith}
                  onClick={() => onAttack(ability.scalesWith)}
                  disabled={actionPoints <= 0}
                  title={`Scales with ${attr?.name ?? ability.scalesWith} (Level ${level})`}
                  className={`flex flex-col items-start gap-0.5 rounded px-3 py-2 text-left text-white disabled:opacity-40 disabled:cursor-not-allowed ${
                    isWeakness
                      ? "bg-red-700 hover:bg-red-600 ring-1 ring-red-400"
                      : "bg-[#0d1117] border border-[#30363d] hover:border-red-600"
                  }`}
                >
                  <span className="text-sm font-medium">{ability.name}</span>
                  <span className="text-[10px]" style={{ color: attr?.hex }}>
                    {attr?.name} Lv {level}
                    {isWeakness && " · bonus"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
