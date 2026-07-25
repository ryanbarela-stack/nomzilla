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

/** All abilities deal identical base damage — the only thing that varies is which attribute (and its level) you pick. */
const BASE_DAMAGE = 8;
const PER_LEVEL_DAMAGE = 2;

function ability(classId: ClassId, name: string, scalesWith: AttributeId): Ability {
  return { classId, name, scalesWith, baseDamage: BASE_DAMAGE, perLevelDamage: PER_LEVEL_DAMAGE };
}

/** Each class has one attack per attribute, so any build can fight effectively with whichever stat it's leveled. */
export const ABILITIES: Record<ClassId, Ability[]> = {
  warrior: [
    ability("warrior", "Shield Bash", "strength"),
    ability("warrior", "Relentless Charge", "endurance"),
    ability("warrior", "Tactical Strike", "intelligence"),
    ability("warrior", "Disciplined Riposte", "wisdom"),
  ],
  barbarian: [
    ability("barbarian", "Reckless Swing", "strength"),
    ability("barbarian", "Savage Sprint", "endurance"),
    ability("barbarian", "Feral Instinct", "intelligence"),
    ability("barbarian", "Battle Fury", "wisdom"),
  ],
  monk: [
    ability("monk", "Iron Palm", "strength"),
    ability("monk", "Flowing Kick", "endurance"),
    ability("monk", "Pressure Point", "intelligence"),
    ability("monk", "Focused Strike", "wisdom"),
  ],
  cleric: [
    ability("cleric", "Righteous Blow", "strength"),
    ability("cleric", "Zealous Charge", "endurance"),
    ability("cleric", "Holy Word", "intelligence"),
    ability("cleric", "Smite", "wisdom"),
  ],
  wizard: [
    ability("wizard", "Force Push", "strength"),
    ability("wizard", "Haste Strike", "endurance"),
    ability("wizard", "Arcane Bolt", "intelligence"),
    ability("wizard", "Mystic Ray", "wisdom"),
  ],
  rogue: [
    ability("rogue", "Brutal Stab", "strength"),
    ability("rogue", "Backstab", "endurance"),
    ability("rogue", "Poison Blade", "intelligence"),
    ability("rogue", "Shadow Step", "wisdom"),
  ],
};

/** All 4 of a class's attacks (one per attribute), or empty if no class is chosen. */
export function getAbilities(classId: ClassId | null): Ability[] {
  return classId ? ABILITIES[classId] : [];
}

/** The specific ability a class uses to attack with a given attribute. */
export function getAbilityFor(classId: ClassId | null, attributeId: AttributeId): Ability | null {
  if (!classId) return null;
  return ABILITIES[classId].find((a) => a.scalesWith === attributeId) ?? null;
}

/** Damage an ability deals given the current level of the attribute it scales with. */
export function computeDamage(ability: Ability, attributeLevel: number): number {
  return Math.round(ability.baseDamage + ability.perLevelDamage * attributeLevel);
}
