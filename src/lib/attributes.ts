import type { AttributeId, LogsByDate } from "./types";

export type { AttributeId };

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
    name: "Stamina",
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

/** Total lifetime days with at least one habit entry logged for this attribute. */
export function computeAttributeCount(logs: LogsByDate, id: AttributeId): number {
  return Object.values(logs).filter((log) => (log.habitEntries ?? []).some((entry) => entry.attributeId === id)).length;
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

/**
 * The player's auto-selected title, e.g. "Novice Strength" — drawn from
 * whichever attribute has progressed the furthest. Ties break on raw count,
 * then on ATTRIBUTES order. Returns null until at least one attribute is
 * past Untrained.
 */
export function getTopAttributeTitle(logs: LogsByDate): string | null {
  let best: { attr: Attribute; tier: AttributeTier; count: number } | null = null;
  for (const attr of ATTRIBUTES) {
    const count = computeAttributeCount(logs, attr.id);
    const tier = getAttributeTier(count);
    if (tier.index === 0) continue;
    if (!best || tier.index > best.tier.index || (tier.index === best.tier.index && count > best.count)) {
      best = { attr, tier, count };
    }
  }
  return best ? `${best.tier.name} ${best.attr.name}` : null;
}

/** A given attribute's current title, e.g. "Novice Strength" — null if still Untrained. */
export function getAttributeTitle(logs: LogsByDate, id: AttributeId): string | null {
  const attr = ATTRIBUTES.find((a) => a.id === id);
  if (!attr) return null;
  const tier = getAttributeTier(computeAttributeCount(logs, id));
  return tier.index === 0 ? null : `${tier.name} ${attr.name}`;
}

/**
 * The title to actually display: the player's manually-chosen attribute's
 * title if set and unlocked, otherwise falls back to the auto-selected
 * top title.
 */
export function getDisplayTitle(logs: LogsByDate, titleAttributeId: AttributeId | null): string | null {
  if (titleAttributeId) {
    const title = getAttributeTitle(logs, titleAttributeId);
    if (title) return title;
  }
  return getTopAttributeTitle(logs);
}
