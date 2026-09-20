export interface BuildKeywords {
  category: string;
  area: string;
  ingredients?: string[];
}

/**
 * creates a list of keywords without duplicates from the recipe category, area and ingredients.
 * @param {object} parameter
 * @param {string} [parameter.category] - string
 * @param {string} [parameter.area] - string
 * @param {string[]} [parameter.ingredients] - string[]
 * @returns string[]
 */

export default function buildKeywords({
  category,
  area,
  ingredients,
}: BuildKeywords): string[] {
  const keywords = new Set<string>();

  keywords.add(normalizeKeyword(category));
  keywords.add(normalizeKeyword(area));

  if (ingredients) {
    ingredients.forEach((ing) => keywords.add(normalizeKeyword(ing)));
  }

  return [...keywords];
}

function normalizeKeyword(keyword: string) {
  return keyword.trim().toLowerCase().replace(/\s+/g, " ");
}