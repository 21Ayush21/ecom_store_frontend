import { z } from "zod";

export const AuthCredentialsValidator = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message: "Password must be 8 characters or long"})
})

export type AuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator>