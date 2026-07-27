interface BuildKeywords {
  category: string;
  area: string;
  ingredients?: string[];
}

/**
 * creates a list of keywords without duplicates from the recipe category, area and ingredients.
 * @param {object} parameter
 * @param {string} [parameter.category] 
 * @param {string} [parameter.area] 
 * @param {string[]} [parameter.ingredients] 
 * @returns string[]
 */

export function buildKeywords({
  category,
  area,
  ingredients,
}: BuildKeywords): string[] {
  const keywords = new Set<string>();

  keywords.add(category);
  keywords.add(area);

  if (ingredients) {
      ingredients.forEach((ing) => keywords.add(ing));
  }

  return [...keywords];
}
