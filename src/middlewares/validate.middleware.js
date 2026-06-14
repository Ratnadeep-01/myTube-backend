import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body);
        next(); 
    } catch (error) {
        // 1. Zod uses .issues for unions/alternatives. Fallback to .errors 🌟
        const rawErrors = error.issues || error.errors || [];
        
        const summaryMessage = rawErrors.length > 0
            ? rawErrors.map((err) => `${err.path.join(".")}: ${err.message}`).join(" | ")
            : "Validation failed";

        const apiError = new ApiError(400, summaryMessage, rawErrors);
        
        // This will now print the nested errors in your terminal!
        console.log("DEBUG API_ERROR DATA:", apiError.errors); 

        next(apiError);
    }
};
