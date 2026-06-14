import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body);
        next(); 
    } catch (error) {
        const rawErrors = error.errors || [];
        
        const summaryMessage = rawErrors.length > 0
            ? rawErrors.map((err) => `${err.path.join(".")}: ${err.message}`).join(" | ")
            : "Validation failed";

        const apiError = new ApiError(400, summaryMessage, rawErrors);

        next(apiError);
    }
};
