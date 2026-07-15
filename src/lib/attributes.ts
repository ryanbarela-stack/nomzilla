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
  /** Same color as barClassName, as a hex value for use in SVG (e.g. the radar chart). */
  hex: string;
}

export const ATTRIBUTES: Attribute[] = [
  {
    id: "strength",
    name: "Strength",
    habitLabel: "Weight training",
    barClassName: "bg-red-500",
    activeButtonClassName: "bg-red-950 border-red-600 text-red-200",
    hex: "#ef4444",
  },
  {
    id: "endurance",
    name: "Stamina",
    habitLabel: "Cardio",
    barClassName: "bg-green-500",
    activeButtonClassName: "bg-green-950 border-green-600 text-green-200",
    hex: "#22c55e",
  },
  {
    id: "intelligence",
    name: "Intelligence",
    habitLabel: "Reading / learning",
    barClassName: "bg-blue-500",
    activeButtonClassName: "bg-blue-950 border-blue-600 text-blue-200",
    hex: "#3b82f6",
  },
  {
    id: "wisdom",
    name: "Wisdom",
    habitLabel: "Self-care",
    barClassName: "bg-yellow-500",
    activeButtonClassName: "bg-yellow-950 border-yellow-600 text-yellow-200",
    hex: "#eab308",
  },
];

/** Lifetime days logged required to advance one level. Uncapped — there is no max level. */
export const DAYS_PER_LEVEL = 5;

/** Total lifetime days with at least one habit entry logged for this attribute. */
export function computeAttributeCount(logs: LogsByDate, id: AttributeId): number {
  return Object.values(logs).filter((log) => (log.habitEntries ?? []).some((entry) => entry.attributeId === id)).length;
}

/** Attribute level for a given lifetime day count — one level per DAYS_PER_LEVEL days, uncapped. */
export function getAttributeLevel(count: number): number {
  return Math.floor(count / DAYS_PER_LEVEL);
}

/** Days still needed (of this attribute) to reach the next level. */
export function getDaysToNextLevel(count: number): number {
  const level = getAttributeLevel(count);
  return (level + 1) * DAYS_PER_LEVEL - count;
}

/** Progress (0-100) through the current level. */
export function getLevelProgressPct(count: number): number {
  const intoLevel = count - getAttributeLevel(count) * DAYS_PER_LEVEL;
  return Math.min(100, Math.max(0, (intoLevel / DAYS_PER_LEVEL) * 100));
}

/**
 * The player's auto-selected title, e.g. "Level 3 Strength" — drawn from
 * whichever attribute has progressed the furthest. Ties break on raw count,
 * then on ATTRIBUTES order. Returns null until at least one attribute has
 * reached Level 1.
 */
export function getTopAttributeTitle(logs: LogsByDate): string | null {
  let best: { attr: Attribute; level: number; count: number } | null = null;
  for (const attr of ATTRIBUTES) {
    const count = computeAttributeCount(logs, attr.id);
    const level = getAttributeLevel(count);
    if (level === 0) continue;
    if (!best || level > best.level || (level === best.level && count > best.count)) {
      best = { attr, level, count };
    }
  }
  return best ? `Level ${best.level} ${best.attr.name}` : null;
}

/** A given attribute's current title, e.g. "Level 3 Strength" — null if still Level 0. */
export function getAttributeTitle(logs: LogsByDate, id: AttributeId): string | null {
  const attr = ATTRIBUTES.find((a) => a.id === id);
  if (!attr) return null;
  const level = getAttributeLevel(computeAttributeCount(logs, id));
  return level === 0 ? null : `Level ${level} ${attr.name}`;
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
