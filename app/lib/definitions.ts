import { z } from 'zod'

export const SignupFormSchema = z.object({
    username: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Contain at least one special character.',
        })
        .trim(),
})

export const SigninFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .trim(),
})

export type FormState =
    | {
        errors?: {
            username?: string[]
            email?: string[]
            password?: string[]
        }
        message?: string
        success?: boolean
        email?: string
        password?: string
    }
    | undefined

// Add this interface here
export interface AuthResult {
    success?: boolean
    message?: string
    errors?: Record<string, string[]>
    email?: string
    password?: string
}

export interface Item {
  id: string
  term: string
  definition: string
  owner_id?: string // optional, if you use it
}
