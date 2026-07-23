import { parseExplicitGrams, parseLeadingMultiplier, stripLeadingQuantity } from "./foodEstimate";

interface UsdaNutrient {
  nutrientName: string;
  value: number;
}

interface UsdaFood {
  description: string;
  foodNutrients: UsdaNutrient[];
}

interface UsdaSearchResponse {
  foods?: UsdaFood[];
}

const USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";
/** Per-item grams assumed when a segment has a count (e.g. "2 kimchi") but USDA gives no serving size. */
const DEFAULT_SERVING_GRAMS = 100;

async function lookupPer100g(query: string, apiKey: string): Promise<{ calories: number; protein: number } | null> {
  const url = new URL(USDA_SEARCH_URL);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("query", query);
  url.searchParams.set("pageSize", "1");
  url.searchParams.set("dataType", "Foundation,SR Legacy");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`USDA lookup failed (${res.status})`);

  const data = (await res.json()) as UsdaSearchResponse;
  const food = data.foods?.[0];
  if (!food) return null;

  const calories = food.foodNutrients.find((n) => n.nutrientName === "Energy")?.value;
  const protein = food.foodNutrients.find((n) => n.nutrientName === "Protein")?.value;
  if (calories === undefined || protein === undefined) return null;

  return { calories, protein };
}

async function lookupSegment(segment: string, apiKey: string): Promise<{ calories: number; protein: number } | null> {
  const grams = parseExplicitGrams(segment);
  const multiplier = parseLeadingMultiplier(segment);
  const query = stripLeadingQuantity(segment);
  if (!query) return null;

  const per100g = await lookupPer100g(query, apiKey);
  if (!per100g) return null;

  const factor = grams !== null ? grams / 100 : (DEFAULT_SERVING_GRAMS * multiplier) / 100;
  return { calories: per100g.calories * factor, protein: per100g.protein * factor };
}

export interface UsdaSegmentsResult {
  calories: number;
  protein: number;
  /** Segments that USDA also couldn't find. */
  stillUnmatched: string[];
}

/**
 * Looks up each segment against USDA FoodData Central (Foundation/SR Legacy, per-100g data),
 * scaling by any explicit weight or leading count in the segment. Segments with no explicit
 * weight fall back to a flat 100g assumption, since generic USDA entries don't carry serving sizes.
 */
export async function lookupSegmentsViaUsda(segments: string[], apiKey: string): Promise<UsdaSegmentsResult> {
  let calories = 0;
  let protein = 0;
  const stillUnmatched: string[] = [];

  const results = await Promise.all(segments.map((segment) => lookupSegment(segment, apiKey)));

  results.forEach((result, i) => {
    if (!result) {
      stillUnmatched.push(segments[i]);
      return;
    }
    calories += result.calories;
    protein += result.protein;
  });

  return { calories, protein, stillUnmatched };
}
