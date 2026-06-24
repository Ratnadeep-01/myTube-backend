import { z } from "zod";

const usernameValidation = z
    .string({ required_error: "Username is required" })
    .trim()
    .toLowerCase()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username cannot exceed 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" });

const emailValidation = z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address" });

const passwordValidation = z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(120, { message: "Password is too long" });


// input validation for registeration
export const createUserSchema = z.object({
    username: usernameValidation,
    email: emailValidation,
    fullName: z
        .string({ required_error: "Full name is required" })
        .trim()
        .min(1, { message: "Full name cannot be empty" })
        .max(100, { message: "Full name is too long" }),

    password: passwordValidation,

    watchHistory: z
        .array(
            z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid MongoDB ObjectId" })
        )
        .optional()
        .default([]),

    refreshToken: z
        .string()
        .optional(),
});


// validator for login using username or email
export const loginUserSchema = z.union([
    z.object({
        username: usernameValidation,
        password: passwordValidation,
    }),
    z.object({
        email: emailValidation,
        password: passwordValidation,
    })
]);


export const databaseUserSchema = createUserSchema.extend({
    _id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid MongoDB ObjectId" }),
    createdAt: z.date().or(z.string().datetime()),
    updatedAt: z.date().or(z.string().datetime()),
});
