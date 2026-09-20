import type makeListRecipes from "../use-cases/listRecipes.js";

interface Dependencies {
  listRecipes: ReturnType<typeof makeListRecipes>;
}

export default function makeGetAllRecipes({ listRecipes }: Dependencies) {
  return function getAllRecipes() {
    const recipes = listRecipes();

    return {
      statusCode: 200,
      body: {
        status: "success",
        data: recipes,
      },
    };
  };
}
