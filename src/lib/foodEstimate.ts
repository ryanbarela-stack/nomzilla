/** Result of estimating calories/protein from a free-text food description. */
export interface FoodEstimate {
  calories: number;
  /** Grams of protein, rounded to the nearest gram. */
  protein: number;
  /** Segments of the description that didn't match any known food. */
  unmatched: string[];
}

interface FoodDbEntry {
  keywords: string[];
  per: "item" | "100g";
  calories: number;
  protein: number;
  /** Typical serving size in grams, used for "100g" foods when no explicit weight is given. */
  defaultGrams?: number;
}

/** Small curated table of common foods with rough USDA-ish macros — an estimate, not a lookup service. */
const FOOD_DB: FoodDbEntry[] = [
  { keywords: ["chicken breast", "grilled chicken", "chicken"], per: "100g", calories: 165, protein: 31, defaultGrams: 150 },
  { keywords: ["salmon"], per: "100g", calories: 208, protein: 20, defaultGrams: 150 },
  { keywords: ["ground beef", "beef"], per: "100g", calories: 250, protein: 26, defaultGrams: 150 },
  { keywords: ["steak"], per: "100g", calories: 271, protein: 25, defaultGrams: 200 },
  { keywords: ["pork chop", "pork"], per: "100g", calories: 242, protein: 27, defaultGrams: 150 },
  { keywords: ["bacon"], per: "item", calories: 43, protein: 3 },
  { keywords: ["egg"], per: "item", calories: 70, protein: 6 },
  { keywords: ["turkey"], per: "100g", calories: 189, protein: 29, defaultGrams: 150 },
  { keywords: ["shrimp"], per: "100g", calories: 99, protein: 24, defaultGrams: 100 },
  { keywords: ["tofu"], per: "100g", calories: 76, protein: 8, defaultGrams: 150 },
  { keywords: ["tuna"], per: "100g", calories: 132, protein: 28, defaultGrams: 100 },

  { keywords: ["greek yogurt"], per: "100g", calories: 59, protein: 10, defaultGrams: 170 },
  { keywords: ["yogurt"], per: "100g", calories: 61, protein: 3.5, defaultGrams: 170 },
  { keywords: ["cottage cheese"], per: "100g", calories: 98, protein: 11, defaultGrams: 150 },
  { keywords: ["cheddar cheese", "cheese"], per: "100g", calories: 402, protein: 25, defaultGrams: 30 },
  { keywords: ["milk"], per: "100g", calories: 42, protein: 3.4, defaultGrams: 240 },
  { keywords: ["protein shake", "protein powder"], per: "item", calories: 120, protein: 24 },

  { keywords: ["white rice", "brown rice", "rice"], per: "100g", calories: 130, protein: 2.7, defaultGrams: 180 },
  { keywords: ["pasta", "spaghetti"], per: "100g", calories: 158, protein: 5.8, defaultGrams: 180 },
  { keywords: ["oatmeal", "oats"], per: "100g", calories: 68, protein: 2.4, defaultGrams: 234 },
  { keywords: ["sweet potato"], per: "100g", calories: 86, protein: 1.6, defaultGrams: 170 },
  { keywords: ["potato"], per: "100g", calories: 87, protein: 2, defaultGrams: 170 },
  { keywords: ["bread", "toast"], per: "item", calories: 80, protein: 3 },
  { keywords: ["bagel"], per: "item", calories: 245, protein: 10 },
  { keywords: ["tortilla"], per: "item", calories: 110, protein: 3 },

  { keywords: ["banana"], per: "item", calories: 105, protein: 1.3 },
  { keywords: ["apple"], per: "item", calories: 95, protein: 0.5 },
  { keywords: ["orange"], per: "item", calories: 62, protein: 1.2 },
  { keywords: ["avocado"], per: "item", calories: 234, protein: 2.9 },
  { keywords: ["broccoli"], per: "100g", calories: 34, protein: 2.8, defaultGrams: 90 },
  { keywords: ["spinach"], per: "100g", calories: 23, protein: 2.9, defaultGrams: 30 },
  { keywords: ["salad"], per: "item", calories: 150, protein: 4 },

  { keywords: ["almonds"], per: "100g", calories: 579, protein: 21, defaultGrams: 30 },
  { keywords: ["peanut butter"], per: "100g", calories: 588, protein: 25, defaultGrams: 32 },
  { keywords: ["protein bar"], per: "item", calories: 200, protein: 20 },
  { keywords: ["pizza"], per: "item", calories: 285, protein: 12 },
  { keywords: ["burger"], per: "item", calories: 354, protein: 20 },
  { keywords: ["french fries", "fries"], per: "100g", calories: 312, protein: 3.4, defaultGrams: 115 },
];

/** Keyword → owning entry, longest keyword first so "chicken breast" wins over "chicken". */
const KEYWORD_INDEX = FOOD_DB.flatMap((entry) => entry.keywords.map((keyword) => ({ keyword, entry }))).sort(
  (a, b) => b.keyword.length - a.keyword.length,
);

const NUMBER_WORDS: Record<string, number> = {
  half: 0.5,
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

function parseLeadingMultiplier(segment: string): number {
  const match = segment.match(/^(\d+(?:\.\d+)?|\d+\/\d+|[a-z]+)\b/);
  if (!match) return 1;
  const token = match[1];
  if (/^\d+\/\d+$/.test(token)) {
    const [num, den] = token.split("/").map(Number);
    return den ? num / den : 1;
  }
  if (/^\d+(\.\d+)?$/.test(token)) return Number(token);
  return NUMBER_WORDS[token] ?? 1;
}

function parseExplicitGrams(segment: string): number | null {
  const match = segment.match(/(\d+(?:\.\d+)?)\s*(g|gram|grams|oz|ounce|ounces)\b/);
  if (!match) return null;
  const amount = Number(match[1]);
  const unit = match[2];
  return unit.startsWith("oz") || unit.startsWith("ounce") ? amount * 28.35 : amount;
}

/**
 * Estimates calories/protein for a free-text description like "2 eggs and a slice of toast"
 * against a small built-in food table. Returns null if no segment matched a known food.
 */
export function estimateFood(description: string): FoodEstimate | null {
  const segments = description
    .toLowerCase()
    .split(/,|&|\+|\b(?:and|with|plus)\b/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (segments.length === 0) return null;

  let calories = 0;
  let protein = 0;
  let matchedAny = false;
  const unmatched: string[] = [];

  for (const segment of segments) {
    const hit = KEYWORD_INDEX.find(({ keyword }) => segment.includes(keyword));
    if (!hit) {
      unmatched.push(segment);
      continue;
    }

    const { entry } = hit;
    const multiplier = parseLeadingMultiplier(segment);
    const explicitGrams = entry.per === "100g" ? parseExplicitGrams(segment) : null;

    let factor: number;
    if (explicitGrams !== null) {
      factor = explicitGrams / 100;
    } else if (entry.per === "100g") {
      factor = ((entry.defaultGrams ?? 100) * multiplier) / 100;
    } else {
      factor = multiplier;
    }

    calories += entry.calories * factor;
    protein += entry.protein * factor;
    matchedAny = true;
  }

  if (!matchedAny) return null;

  return { calories: Math.round(calories), protein: Math.round(protein), unmatched };
}
