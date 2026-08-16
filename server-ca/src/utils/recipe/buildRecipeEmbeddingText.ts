interface BuildRecipeEmbeddingText {
  recipeName: string;
  instructions: string[];
  category: string;
  area: string;
  ingredients: string[];
}

export default function buildRecipeEmbeddingText({
  recipeName,
  instructions,
  category,
  area,
  ingredients,
}: BuildRecipeEmbeddingText) {
  return `
        ${recipeName}

        ${instructions.join(", ")}

        ${category}

        ${area}

        ${ingredients.join(", ")}
    `;
}
