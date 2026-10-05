import type makeRecipeDB from "../database/recipeDB.js";

interface Dependencies {
  recipeDB: {
    findRecipeBySlug: ReturnType<typeof makeRecipeDB>["findRecipeBySlug"];
  };
}

export default function makeFindRecipeBySlug({ recipeDB }: Dependencies) {
  return function findRecipeBySlug({ slug }: { slug: string }) {
    const res = recipeDB.findRecipeBySlug(slug);

    if (!res) {
      throw new Error("The recipe does not exist");
    }

    return res;
  };
}
