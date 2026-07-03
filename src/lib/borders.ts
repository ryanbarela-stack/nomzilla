export interface Border {
  id: string;
  name: string;
  /** Total (lifetime) days logged required to unlock — permanent progress, unlike the streak-based growth stage. */
  minDays: number;
  className: string;
}

export const BORDERS: Border[] = [
  { id: "default", name: "Plain", minDays: 0, className: "border-2 border-[#30363d]" },
  { id: "bronze", name: "Bronze", minDays: 5, className: "border-2 border-[#a9744f] shadow-[0_0_6px_rgba(169,116,79,0.55)]" },
  { id: "silver", name: "Silver", minDays: 15, className: "border-2 border-[#c9d1d9] shadow-[0_0_6px_rgba(201,209,217,0.55)]" },
  { id: "gold", name: "Gold", minDays: 30, className: "border-2 border-[#e3b341] shadow-[0_0_10px_rgba(227,179,65,0.65)]" },
  { id: "emerald", name: "Emerald", minDays: 60, className: "border-2 border-[#2ea043] shadow-[0_0_10px_rgba(46,160,67,0.65)]" },
  { id: "legendary", name: "Legendary", minDays: 100, className: "border-2 border-legendary" },
];

export function isBorderUnlocked(border: Border, totalDaysLogged: number): boolean {
  return totalDaysLogged >= border.minDays;
}

export function getBorderById(id: string): Border {
  return BORDERS.find((b) => b.id === id) ?? BORDERS[0];
}

/** Index of the highest border tier the player has earned — this doubles as their "level". */
export function getCurrentLevelIndex(totalDaysLogged: number): number {
  let index = 0;
  BORDERS.forEach((border, i) => {
    if (totalDaysLogged >= border.minDays) index = i;
  });
  return index;
}

export function getNextBorder(totalDaysLogged: number): Border | null {
  return BORDERS.find((border) => border.minDays > totalDaysLogged) ?? null;
}
