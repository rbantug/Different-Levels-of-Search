import AppError from "../errors/AppError.js";
import type makeFindRecipeBySlug from "../use-cases/findRecipeBySlug.js"


interface Dependencies {
  findRecipeBySlug: ReturnType<typeof makeFindRecipeBySlug>;
}

export default function makeGetSingleRecipe({ findRecipeBySlug }: Dependencies) {
  return function getSingleRecipe({ slug }: { slug: string }) {
    if (!slug) {
      throw new AppError("A slug is required", 400);
    }

    const recipe = findRecipeBySlug({ slug });

    return {
      statusCode: 200,
      body: {
        status: "success",
        data: recipe,
      },
    };
  };
}
