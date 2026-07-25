export function buildKeywords( category:string, area:string, ingredients: string[] ): string[] {
    const keywords = new Set<string>()

    keywords.add(category)
    keywords.add(area)

    ingredients.forEach((ing) => keywords.add(ing));

    return [...keywords]
}