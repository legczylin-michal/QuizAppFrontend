'use server'

import { redirect } from 'next/navigation'
import { SignupFormSchema, SigninFormSchema, FormState, AuthResult } from '@/app/lib/definitions'

// Remove this duplicate interface declaration:
// interface AuthResult {
//     success?: boolean
//     message?: string
//     errors?: Record<string, string[]>
//     email?: string
//     password?: string
// }

export async function signin(state: FormState, formData: FormData): Promise<AuthResult> {
    const validatedFields = SigninFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { email, password } = validatedFields.data

    try {
        // Change this URL to your login endpoint
        const signinResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, { // Changed from /register to /login
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }), // Your backend might expect different format
        })

        if (!signinResponse.ok) {
            const errorData = await signinResponse.json()
            return {
                message: errorData.error || 'An error occurred while signing in.',
            }
        }

        return { success: true, email, password }

    } catch (error) {
        return {
            message: 'An error occurred while signing in.',
        }
    }
}

export async function signup(state: FormState, formData: FormData): Promise<AuthResult> {
    const validatedFields = SignupFormSchema.safeParse({
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { username, email, password } = validatedFields.data

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            return {
                message: errorData.error || 'An error occurred while creating your account.',
            }
        }

        const data = await response.json()
        console.log('Registration successful:', data)

        return { success: true, email, password }

    } catch (error) {
        return {
            message: 'An error occurred while creating your account.',
        }
    }
}

export async function logout() {
    redirect('/signin')
}
