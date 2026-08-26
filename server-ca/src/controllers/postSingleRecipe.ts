import type makeAddRecipe from "../use-cases/addRecipe.js";
import type { CreateRecipe } from "../entities/types.js";

interface Dependencies {
  addRecipe: ReturnType<typeof makeAddRecipe>;
}

export default function makePostSingleRecipe({ addRecipe }: Dependencies) {
  return async function postSingleRecipe({ body }: { body: CreateRecipe }) {
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
