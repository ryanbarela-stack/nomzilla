import type { HabitFlags, LogsByDate } from "./types";

export type AttributeId = keyof HabitFlags;

export interface Attribute {
  id: AttributeId;
  name: string;
  /** The daily habit that grows this attribute. */
  habitLabel: string;
  /** Solid fill color used for this attribute's progress bar. */
  barClassName: string;
  /** Classes for the habit-toggle button when active. */
  activeButtonClassName: string;
}

export const ATTRIBUTES: Attribute[] = [
  {
    id: "strength",
    name: "Strength",
    habitLabel: "Weight training",
    barClassName: "bg-red-500",
    activeButtonClassName: "bg-red-950 border-red-600 text-red-200",
  },
  {
    id: "endurance",
    name: "Endurance",
    habitLabel: "Cardio",
    barClassName: "bg-green-500",
    activeButtonClassName: "bg-green-950 border-green-600 text-green-200",
  },
  {
    id: "intelligence",
    name: "Intelligence",
    habitLabel: "Reading / learning",
    barClassName: "bg-blue-500",
    activeButtonClassName: "bg-blue-950 border-blue-600 text-blue-200",
  },
  {
    id: "wisdom",
    name: "Wisdom",
    habitLabel: "Self-care",
    barClassName: "bg-yellow-500",
    activeButtonClassName: "bg-yellow-950 border-yellow-600 text-yellow-200",
  },
];

export interface AttributeTier {
  index: number;
  name: string;
  /** Total (lifetime) days that habit was logged required to reach this tier. */
  minCount: number;
}

export const ATTRIBUTE_TIERS: AttributeTier[] = [
  { index: 0, name: "Untrained", minCount: 0 },
  { index: 1, name: "Novice", minCount: 5 },
  { index: 2, name: "Trained", minCount: 15 },
  { index: 3, name: "Veteran", minCount: 30 },
  { index: 4, name: "Master", minCount: 60 },
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
