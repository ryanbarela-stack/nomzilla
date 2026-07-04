import type { HabitFlags, LogsByDate } from "./types";

export type AttributeId = keyof HabitFlags;

export interface Attribute {
  id: AttributeId;
  name: string;
  emoji: string;
  /** The daily habit that grows this attribute. */
  habitLabel: string;
}

export const ATTRIBUTES: Attribute[] = [
  { id: "strength", name: "Strength", emoji: "💪", habitLabel: "Weight training" },
  { id: "endurance", name: "Endurance", emoji: "🏃", habitLabel: "Cardio" },
  { id: "intelligence", name: "Intelligence", emoji: "📖", habitLabel: "Reading / learning" },
  { id: "wisdom", name: "Wisdom", emoji: "🧘", habitLabel: "Self-care" },
];

export interface AttributeTier {
  index: number;
  name: string;
  /** Total (lifetime) days that habit was logged required to reach this tier. */
  minCount: number;
  barClassName: string;
}

export const ATTRIBUTE_TIERS: AttributeTier[] = [
  { index: 0, name: "Untrained", minCount: 0, barClassName: "bg-gray-600" },
  { index: 1, name: "Novice", minCount: 5, barClassName: "bg-[#a9744f]" },
  { index: 2, name: "Trained", minCount: 15, barClassName: "bg-[#c9d1d9]" },
  { index: 3, name: "Veteran", minCount: 30, barClassName: "bg-[#e3b341]" },
  { index: 4, name: "Master", minCount: 60, barClassName: "bg-[#2ea043]" },
];

/** Total lifetime days a given habit was logged. */
export function computeAttributeCount(logs: LogsByDate, id: AttributeId): number {
  return Object.values(logs).filter((log) => log.habits?.[id]).length;
}

export function getAttributeTier(count: number): AttributeTier {
  let current = ATTRIBUTE_TIERS[0];
  for (const tier of ATTRIBUTE_TIERS) {
    if (count >= tier.minCount) current = tier;
  }
  return current;
}

export function getNextAttributeTier(tier: AttributeTier): AttributeTier | null {
  return ATTRIBUTE_TIERS[tier.index + 1] ?? null;
}
