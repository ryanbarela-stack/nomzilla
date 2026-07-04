import type { GrowthStage } from "./streak";

export type PathId = "titan" | "warden" | "emperor";

export interface EvolutionPath {
  id: PathId;
  name: string;
  tagline: string;
  /** Display names for stage index 2, 3, and 4. */
  stageNames: [string, string, string];
}

export const PATHS: EvolutionPath[] = [
  { id: "titan", name: "Titan", tagline: "Atomic-age colossus", stageNames: ["Young Titan", "Titan", "Ancient Titan"] },
  { id: "warden", name: "Warden", tagline: "Guardian of light and wind", stageNames: ["Young Warden", "Warden", "Grand Warden"] },
  { id: "emperor", name: "Emperor", tagline: "Three-headed golden dragon", stageNames: ["Young Emperor", "Emperor", "Emperor Eternal"] },
];

export function getPath(id: string | null): EvolutionPath | null {
  return PATHS.find((p) => p.id === id) ?? null;
}

/** The name to show for the current stage, accounting for the (possibly still unchosen) evolution path. */
export function getStageDisplayName(stage: GrowthStage, pathId: string | null): string {
  if (stage.index < 2) return stage.name;
  const path = getPath(pathId);
  if (!path) return "Choose Your Path!";
  return path.stageNames[stage.index - 2];
}

/** Name to use when previewing an upcoming (not-yet-reached) stage, e.g. in "log N more days to reach X". */
export function getStagePreviewName(stage: GrowthStage, pathId: string | null): string {
  if (stage.index < 2) return stage.name;
  const path = getPath(pathId);
  if (!path) return "your evolved form";
  return path.stageNames[stage.index - 2];
}
