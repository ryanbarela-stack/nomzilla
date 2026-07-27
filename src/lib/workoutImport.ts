import type { SetDetail } from "./types";

export interface ParsedExercise {
  description: string;
  setDetails: SetDetail[];
}

/** Matches "3x10", "3 x 10", "3×10" — pairs of numbers joined by an x-like separator. */
const PAIR_RE = /(\d+(?:\.\d+)?)\s*[x×X]\s*(\d+(?:\.\d+)?)/g;
/** An explicit weight mention: "@135", "at 135", "135lb(s)", "135kg(s)". */
const WEIGHT_UNIT_RE = /(?:@|at)\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*(?:lbs?|kgs?)\b/i;
const SETS_WORD_RE = /(\d+)\s*sets?\b/i;
const REPS_WORD_RE = /(\d+)\s*reps?\b/i;
/** Leading bullet/numbering to strip, e.g. "1. ", "- ", "* ", "3) ". */
const LEADING_MARKER_RE = /^[\s\-*•]*(?:\d+[.)]\s*)?/;

function extractDescription(line: string, firstDigitIndex: number): string {
  const raw = firstDigitIndex >= 0 ? line.slice(0, firstDigitIndex) : line;
  return raw.replace(/[-–:.]+\s*$/, "").trim();
}

function parseLine(rawLine: string): ParsedExercise | null {
  const line = rawLine.replace(LEADING_MARKER_RE, "").trim();
  if (!line) return null;

  const firstDigit = line.match(/\d/);
  const firstDigitIndex = firstDigit ? (firstDigit.index ?? -1) : -1;
  const description = extractDescription(line, firstDigitIndex) || line;
  if (!description) return null;

  const pairMatches = [...line.matchAll(PAIR_RE)];

  // "135x10, 145x8, 155x6" — a per-set list, weight first (the common paste convention).
  if (pairMatches.length >= 2) {
    const setDetails = pairMatches.map((m) => ({ weight: Number(m[1]), reps: Number(m[2]) }));
    return { description, setDetails };
  }

  if (pairMatches.length === 1) {
    const match = pairMatches[0];
    const a = Number(match[1]);
    const b = Number(match[2]);
    const rest = line.slice((match.index ?? 0) + match[0].length);

    const weightMatch = rest.match(WEIGHT_UNIT_RE);
    let explicitWeight = weightMatch ? Number(weightMatch[1] ?? weightMatch[2]) : undefined;
    if (explicitWeight === undefined) {
      const bareNumber = rest.match(/(\d+(?:\.\d+)?)/);
      if (bareNumber) explicitWeight = Number(bareNumber[1]);
    }

    if (explicitWeight !== undefined) {
      // "3x10 135lb" / "5x5 @ 225" / "1x5 315" — sets x reps, then a trailing weight.
      const sets = Math.max(1, Math.round(a));
      return {
        description,
        setDetails: Array.from({ length: sets }, () => ({ reps: b, weight: explicitWeight })),
      };
    }

    // No separate weight found in the rest of the line.
    if (a >= 20 && b <= 20) {
      // "Bench Press 135x10" — a single weight x reps set, no explicit "sets" count.
      return { description, setDetails: [{ weight: a, reps: b }] };
    }

    // "Push-ups 3x10" — sets x reps with no weight (bodyweight).
    const sets = Math.max(1, Math.round(a));
    return { description, setDetails: Array.from({ length: sets }, () => ({ reps: b })) };
  }

  // No "AxB" pattern — try verbose "3 sets x 10 reps @ 135 lbs" style wording.
  const setsMatch = line.match(SETS_WORD_RE);
  const repsMatch = line.match(REPS_WORD_RE);
  const weightMatch = line.match(WEIGHT_UNIT_RE);
  const weight = weightMatch ? Number(weightMatch[1] ?? weightMatch[2]) : undefined;

  if (setsMatch || repsMatch || weight !== undefined) {
    const sets = setsMatch ? Math.max(1, Number(setsMatch[1])) : 1;
    const reps = repsMatch ? Number(repsMatch[1]) : undefined;
    return { description, setDetails: Array.from({ length: sets }, () => ({ reps, weight })) };
  }

  // Just a name, no numbers at all — still worth listing so it can be filled in by hand.
  return { description, setDetails: [] };
}

/** Best-effort parse of pasted workout text into exercises with per-set reps/weight. */
export function parseWorkoutText(text: string): ParsedExercise[] {
  return text
    .split(/\r?\n/)
    .map(parseLine)
    .filter((entry): entry is ParsedExercise => entry !== null && entry.description.length > 0);
}
