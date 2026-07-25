import type { ClassId } from "./classes";
import type { AttributeId } from "./types";

export interface Ability {
  classId: ClassId;
  name: string;
  /** The attribute this ability's damage scales with. */
  scalesWith: AttributeId;
  baseDamage: number;
  perLevelDamage: number;
}

export const ABILITIES: Record<ClassId, Ability> = {
  warrior: { classId: "warrior", name: "Shield Bash", scalesWith: "strength", baseDamage: 8, perLevelDamage: 2 },
  barbarian: { classId: "barbarian", name: "Reckless Swing", scalesWith: "strength", baseDamage: 10, perLevelDamage: 2.5 },
  monk: { classId: "monk", name: "Focused Strike", scalesWith: "wisdom", baseDamage: 8, perLevelDamage: 2 },
  cleric: { classId: "cleric", name: "Smite", scalesWith: "wisdom", baseDamage: 8, perLevelDamage: 2 },
  wizard: { classId: "wizard", name: "Arcane Bolt", scalesWith: "intelligence", baseDamage: 8, perLevelDamage: 2 },
  rogue: { classId: "rogue", name: "Backstab", scalesWith: "endurance", baseDamage: 9, perLevelDamage: 2 },
};

export function getAbility(classId: ClassId | null): Ability | null {
  return classId ? ABILITIES[classId] : null;
}

/** Damage an ability deals given the current level of the attribute it scales with. */
export function computeDamage(ability: Ability, attributeLevel: number): number {
  return Math.round(ability.baseDamage + ability.perLevelDamage * attributeLevel);
}
