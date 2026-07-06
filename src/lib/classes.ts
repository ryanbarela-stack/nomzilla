import type { SpriteSize } from "./paths";

export type ClassId = "warrior" | "cleric" | "monk" | "wizard" | "barbarian" | "rogue";

export interface ChampionClass {
  id: ClassId;
  name: string;
  tagline: string;
  sprite: string;
  spriteSize: SpriteSize;
}

export const CLASSES: ChampionClass[] = [
  {
    id: "warrior",
    name: "Warrior",
    tagline: "Sturdy iron, shield and blade",
    sprite: "/sprites/warrior/south.png",
    spriteSize: { width: 92, height: 92 },
  },
  {
    id: "barbarian",
    name: "Barbarian",
    tagline: "Fierce, grounded, unstoppable",
    sprite: "/sprites/barbarian/south.png",
    spriteSize: { width: 96, height: 96 },
  },
  {
    id: "monk",
    name: "Monk",
    tagline: "Saffron robes, centered stance",
    sprite: "/sprites/monk/south.png",
    spriteSize: { width: 96, height: 96 },
  },
  {
    id: "cleric",
    name: "Cleric",
    tagline: "Layered white and gold, staff in hand",
    sprite: "/sprites/cleric/south.png",
    spriteSize: { width: 88, height: 88 },
  },
  {
    id: "wizard",
    name: "Wizard",
    tagline: "Flowing robes, glowing staff",
    sprite: "/sprites/wizard/south.png",
    spriteSize: { width: 96, height: 96 },
  },
  {
    id: "rogue",
    name: "Rogue",
    tagline: "Hooded, twin daggers, quick and quiet",
    sprite: "/sprites/rogue/south.png",
    spriteSize: { width: 96, height: 96 },
  },
];

export function getClass(id: string | null): ChampionClass | null {
  return CLASSES.find((c) => c.id === id) ?? null;
}
