import { z } from "zod";

export const AuthCredentialsValidator = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message: "Password must be 8 characters or long"})
})

export type AuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator>


export const ProductRegisterValidator = z.object({
    productName: z.string().min(1, {message:"Product name is required"}),
    productDescription: z.string().min(1, {message:"Product description is required"}),
    price: z.coerce.number().nonnegative(),
    stockQuantity: z.coerce.number().int().nonnegative(),
    category: z.string().min(1, {message:"Category is required"}),
    productId: z.string().min(1, {message:"Product ID is required"}),
    productImages: z.any().refine((files) => files instanceof FileList && files.length > 0 , {message: "At least one image is required"}),

})

export type ProductRegisterValidator = z.infer<typeof ProductRegisterValidator>