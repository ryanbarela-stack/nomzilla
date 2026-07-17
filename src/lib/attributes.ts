import type { AttributeId, HabitEntry, LogsByDate } from "./types";

export type { AttributeId };

export type AttributeProgressMode = "volume" | "days";

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
  /**
   * How this attribute earns points: "volume" credits the actual reps/weight/duration logged
   * per entry (so a heavier or longer session is worth more); "days" credits one point per
   * lifetime day the attribute was logged at all, regardless of how much.
   */
  progressMode: AttributeProgressMode;
  /** Points needed to gain one level. */
  pointsPerLevel: number;
  /** Unit shown next to remaining-points-to-level-up, e.g. "XP" or "days". */
  unitLabel: string;
  /**
   * Fantasy title tiers for this attribute, ascending by minLevel — the title shown is whichever
   * tier's minLevel is the highest one not exceeding the current level.
   */
  titleTiers: { minLevel: number; name: string }[];
}

export const ATTRIBUTES: Attribute[] = [
  {
    id: "strength",
    name: "Strength",
    habitLabel: "Weight training",
    barClassName: "bg-red-500",
    activeButtonClassName: "bg-red-950 border-red-600 text-red-200",
    hex: "#ef4444",
    progressMode: "volume",
    pointsPerLevel: 5000,
    unitLabel: "XP",
    titleTiers: [
      { minLevel: 1, name: "Brawler" },
      { minLevel: 3, name: "Bruiser" },
      { minLevel: 6, name: "Warbringer" },
      { minLevel: 10, name: "Berserker" },
      { minLevel: 15, name: "Juggernaut" },
      { minLevel: 21, name: "Titan of Strength" },
    ],
  },
  {
    id: "endurance",
    name: "Stamina",
    habitLabel: "Cardio",
    barClassName: "bg-green-500",
    activeButtonClassName: "bg-green-950 border-green-600 text-green-200",
    hex: "#22c55e",
    progressMode: "volume",
    pointsPerLevel: 5000,
    unitLabel: "XP",
    titleTiers: [
      { minLevel: 1, name: "Sprinter" },
      { minLevel: 3, name: "Pathfinder" },
      { minLevel: 6, name: "Windrunner" },
      { minLevel: 10, name: "Stormrunner" },
      { minLevel: 15, name: "Tireless Wanderer" },
      { minLevel: 21, name: "Endless Marathoner" },
    ],
  },
  {
    id: "intelligence",
    name: "Intelligence",
    habitLabel: "Reading / learning",
    barClassName: "bg-blue-500",
    activeButtonClassName: "bg-blue-950 border-blue-600 text-blue-200",
    hex: "#3b82f6",
    progressMode: "days",
    pointsPerLevel: 5,
    unitLabel: "days",
    titleTiers: [
      { minLevel: 1, name: "Apprentice" },
      { minLevel: 3, name: "Scholar" },
      { minLevel: 6, name: "Adept" },
      { minLevel: 10, name: "Magus" },
      { minLevel: 15, name: "Archmage" },
      { minLevel: 21, name: "Loremaster" },
    ],
  },
  {
    id: "wisdom",
    name: "Wisdom",
    habitLabel: "Self-care",
    barClassName: "bg-yellow-500",
    activeButtonClassName: "bg-yellow-950 border-yellow-600 text-yellow-200",
    hex: "#eab308",
    progressMode: "days",
    pointsPerLevel: 5,
    unitLabel: "days",
    titleTiers: [
      { minLevel: 1, name: "Acolyte" },
      { minLevel: 3, name: "Mystic" },
      { minLevel: 6, name: "Serene Adept" },
      { minLevel: 10, name: "Enlightened One" },
      { minLevel: 15, name: "Ascendant" },
      { minLevel: 21, name: "Transcendent Sage" },
    ],
  },
];

/** The fantasy title name for an attribute at a given level — the highest tier reached, uncapped. */
export function getFantasyTitleName(id: AttributeId, level: number): string | null {
  const attr = ATTRIBUTES.find((a) => a.id === id);
  if (!attr || level < 1) return null;
  let name: string | null = null;
  for (const tier of attr.titleTiers) {
    if (tier.minLevel > level) break;
    name = tier.name;
  }
  return name;
}

/** Assumed load (lb) for a rep logged with no weight, e.g. a bodyweight set. */
const BODYWEIGHT_LOAD_LB = 50;
/** Points credited per minute of a timed entry. */
const POINTS_PER_MINUTE = 60;
/** Points credited for an entry with no logged sets, reps, weight, or duration. */
const MIN_ENTRY_POINTS = 50;

/** Points earned from a single habit entry's logged detail — more/heavier/longer is worth more. */
function computeEntryPoints(entry: HabitEntry): number {
  if (entry.setDetails && entry.setDetails.length > 0) {
    const points = entry.setDetails.reduce((sum, set) => {
      if (set.reps !== undefined) return sum + set.reps * (set.weight ?? BODYWEIGHT_LOAD_LB);
      if (set.weight !== undefined) return sum + set.weight;
      return sum;
    }, 0);
    if (points > 0) return points;
  } else if (entry.sets !== undefined || entry.reps !== undefined || entry.weight !== undefined) {
    const sets = entry.sets ?? 1;
    const reps = entry.reps ?? 1;
    return sets * reps * (entry.weight ?? BODYWEIGHT_LOAD_LB);
  }
  if (entry.durationMinutes !== undefined) return entry.durationMinutes * POINTS_PER_MINUTE;
  return MIN_ENTRY_POINTS;
}

/** Lifetime points earned toward this attribute, per its progressMode. */
export function computeAttributePoints(logs: LogsByDate, id: AttributeId): number {
  const attr = ATTRIBUTES.find((a) => a.id === id);
  if (!attr) return 0;

  if (attr.progressMode === "days") {
    return Object.values(logs).filter((log) => (log.habitEntries ?? []).some((entry) => entry.attributeId === id))
      .length;
  }

  return Object.values(logs).reduce((sum, log) => {
    const entries = (log.habitEntries ?? []).filter((entry) => entry.attributeId === id);
    return sum + entries.reduce((s, entry) => s + computeEntryPoints(entry), 0);
  }, 0);
}

/**
 * Concave curve applied to in-level progress for rendering only (bar widths, radar shape) — a small
 * amount of real progress still reads as a visible nudge instead of a near-invisible sliver. Numeric
 * displays (percent text, points remaining) stay linear/accurate; only this visual mapping is curved.
 */
export function visualProgressPct(pct: number): number {
  return Math.sqrt(Math.max(0, Math.min(100, pct)) / 100) * 100;
}

export interface AttributeProgress {
  points: number;
  level: number;
  pointsIntoLevel: number;
  pointsToNextLevel: number;
  /** Progress (0-100) through the current level. */
  pct: number;
}

/** Current level and progress-to-next-level for an attribute, uncapped. */
export function getAttributeProgress(logs: LogsByDate, id: AttributeId): AttributeProgress {
  const attr = ATTRIBUTES.find((a) => a.id === id);
  const pointsPerLevel = attr?.pointsPerLevel ?? 1;
  const points = computeAttributePoints(logs, id);
  const level = Math.floor(points / pointsPerLevel);
  const pointsIntoLevel = points - level * pointsPerLevel;
  return {
    points,
    level,
    pointsIntoLevel,
    pointsToNextLevel: pointsPerLevel - pointsIntoLevel,
    pct: Math.min(100, Math.max(0, (pointsIntoLevel / pointsPerLevel) * 100)),
  };
}

/**
 * The player's auto-selected title, e.g. "Level 3 Warbringer" — drawn from
 * whichever attribute has progressed the furthest. Ties break on raw points,
 * then on ATTRIBUTES order. Returns null until at least one attribute has
 * reached Level 1.
 */
export function getTopAttributeTitle(logs: LogsByDate): string | null {
  let best: { attr: Attribute; level: number; points: number } | null = null;
  for (const attr of ATTRIBUTES) {
    const { level, points } = getAttributeProgress(logs, attr.id);
    if (level === 0) continue;
    if (!best || level > best.level || (level === best.level && points > best.points)) {
      best = { attr, level, points };
    }
  }
  return best ? `Level ${best.level} ${getFantasyTitleName(best.attr.id, best.level)}` : null;
}

/** A given attribute's current title, e.g. "Level 3 Warbringer" — null if still Level 0. */
export function getAttributeTitle(logs: LogsByDate, id: AttributeId): string | null {
  const { level } = getAttributeProgress(logs, id);
  if (level === 0) return null;
  return `Level ${level} ${getFantasyTitleName(id, level)}`;
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
