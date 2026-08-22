import AppError from "../errors/AppError.js"
import type makeRemoveRecipe from "../use-cases/removeRecipe.js"

interface Dependencies {
    removeRecipe: ReturnType<typeof makeRemoveRecipe>
}

export default function makeDeleteSingleRecipe({ removeRecipe }: Dependencies) {
    return async function deleteSingleRecipe({ recipeId }: { recipeId: string }) {
        if (!recipeId) {
          throw new AppError("A recipe ID is required", 400);
        }

        await removeRecipe({ recipeId })

        return {
            statusCode: 204
        }
    }
}