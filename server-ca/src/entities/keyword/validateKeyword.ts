import type { ValidationDependencies } from "../types.js";

export default function buildValidateKeyword({ joi }: ValidationDependencies) {
    const keywordSchema = joi.string().trim().min(1).max(100).required()

    function validateKeyword(keyword: string) {
        const { error, value } = keywordSchema.validate(keyword, {
          convert: false,
          abortEarly: false,
        });

        if (error) {
          throw new Error(`Joi validation error: ${error.message}`);
        }

        return value;
    }

    return { validateKeyword }
}