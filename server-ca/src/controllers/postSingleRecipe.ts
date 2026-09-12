import type makeAddRecipe from "../use-cases/addRecipe.js";
import type { CreateRecipe } from "../entities/types.js";

interface Dependencies {
  addRecipe: ReturnType<typeof makeAddRecipe>;
}

export type PostSingleRecipeParam = CreateRecipe & {
  ingredientNames: string[]
}

export default function makePostSingleRecipe({ addRecipe }: Dependencies) {
  return async function postSingleRecipe({ body }: { body: PostSingleRecipeParam }) {
    const recipe = await addRecipe(body);

    return {
      statusCode: 201,
      body: {
        status: "success",
        data: recipe,
      },
    };
  };
}
