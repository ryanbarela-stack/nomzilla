import type { SpriteSize } from "./classes";
import type { AttributeId } from "./types";

export type MonsterId = "titan" | "emperor" | "mothman" | "quetzalcoatl";

export interface Monster {
  id: MonsterId;
  name: string;
  tagline: string;
  sprite: string;
  spriteSize: SpriteSize;
  maxHealth: number;
  /** Attribute that deals bonus damage to this monster, and drops by 1 level if it's not defeated in time. */
  weakness: AttributeId;
}

export const MONSTERS: Monster[] = [
  {
    id: "titan",
    name: "Titan",
    tagline: "A stocky kaiju, all muscle and menace",
    sprite: "/sprites/monsters/titan/south.png",
    spriteSize: { width: 92, height: 92 },
    maxHealth: 80,
    weakness: "strength",
  },
  {
    id: "emperor",
    name: "Emperor",
    tagline: "A three-headed hydra wreathed in gold",
    sprite: "/sprites/monsters/emperor/south.png",
    spriteSize: { width: 92, height: 92 },
    maxHealth: 100,
    weakness: "endurance",
  },
  {
    id: "mothman",
    name: "Mothman",
    tagline: "Iridescent wings, an omen given form",
    sprite: "/sprites/monsters/mothman/south.png",
    spriteSize: { width: 96, height: 96 },
    maxHealth: 90,
    weakness: "intelligence",
  },
  {
    id: "quetzalcoatl",
    name: "Quetzalcoatl",
    tagline: "A feathered serpent titan, coiled and ancient",
    sprite: "/sprites/monsters/quetzalcoatl/south.png",
    spriteSize: { width: 92, height: 92 },
    maxHealth: 120,
    weakness: "wisdom",
  },
];

export function getMonster(id: string | null | undefined): Monster | null {
  return MONSTERS.find((m) => m.id === id) ?? null;
}

export function getRandomMonster(): Monster {
  return MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
}
