export type Mood = "great" | "good" | "neutral" | "rough";

export function moodFromScore(score: number | null): Mood {
  if (score === null) return "neutral";
  if (score >= 85) return "great";
  if (score >= 70) return "good";
  if (score >= 50) return "neutral";
  return "rough";
}
