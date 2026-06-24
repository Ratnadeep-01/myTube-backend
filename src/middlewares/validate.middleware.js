import { ApiError } from "../utils/ApiError.js";
import fs from "fs";

export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body);
        next(); 
    } catch (error) {
        if (req.file) {
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        }
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                req.files[key].forEach((file) => {
                    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                });
            });
        }
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
