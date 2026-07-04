import type { GrowthStage } from "./streak";

export type PathId = "titan" | "emperor" | "quetzacoatl" | "mothman";

export interface SpriteSize {
  width: number;
  height: number;
}

export interface EvolutionPath {
  id: PathId;
  name: string;
  tagline: string;
  babyName: string;
  finalName: string;
  babySprite: string;
  babySpriteSize: SpriteSize;
  /** Not yet available — final-form art hasn't been produced yet. Falls back to the baby sprite. */
  finalSprite?: string;
  finalSpriteSize?: SpriteSize;
}

export const PATHS: EvolutionPath[] = [
  {
    id: "titan",
    name: "Titan",
    tagline: "Atomic-age colossus",
    babyName: "Baby Titan",
    finalName: "Titan",
    babySprite: "/sprites/titan/baby/south.png",
    babySpriteSize: { width: 92, height: 92 },
  },
  {
    id: "emperor",
    name: "Emperor",
    tagline: "Three-headed golden dragon",
    babyName: "Baby Emperor",
    finalName: "Emperor",
    babySprite: "/sprites/emperor/baby/south.png",
    babySpriteSize: { width: 92, height: 92 },
  },
  {
    id: "quetzacoatl",
    name: "Quetzacoatl",
    tagline: "Vibrant feathered serpent",
    babyName: "Baby Quetzacoatl",
    finalName: "Quetzacoatl",
    babySprite: "/sprites/quetzacoatl/baby/south.png",
    babySpriteSize: { width: 88, height: 88 },
  },
  {
    id: "mothman",
    name: "Mothman",
    tagline: "Fuzzy cryptid of the night",
    babyName: "Baby Mothman",
    finalName: "Mothman",
    babySprite: "/sprites/mothman/baby/south.png",
    babySpriteSize: { width: 92, height: 92 },
  },
];

export function getPath(id: string | null): EvolutionPath | null {
  return PATHS.find((p) => p.id === id) ?? null;
}

/** The name to show for the current stage, accounting for the (possibly still unchosen) evolution path. */
export function getStageDisplayName(stage: GrowthStage, pathId: string | null): string {
  if (stage.index === 0) return stage.name;
  const path = getPath(pathId);
  if (!path) return "Choose Your Path!";
  return stage.index === 1 ? path.babyName : path.finalName;
}

/** Name to use when previewing an upcoming (not-yet-reached) stage, e.g. in "log N more days to reach X". */
export function getStagePreviewName(stage: GrowthStage, pathId: string | null): string {
  if (stage.index === 0) return stage.name;
  const path = getPath(pathId);
  if (!path) return "your evolved form";
  return stage.index === 1 ? path.babyName : path.finalName;
}
