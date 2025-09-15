import { z } from "zod";

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    mobile: z.string()
    .min(10, "Mobile number must be 10 digits")
    .max(13, "Mobile number must be at most 13 digits"),
    role: z.enum([
        "user", "vendor", "delivery", "admin"
    ])
    .default("user"),
});

const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export { signupSchema, loginSchema };