'use client'

import { signup } from '@/app/actions/auth'
import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/app/lib/firebase'

// Declare the interface locally to avoid import issues
interface AuthResult {
    success?: boolean
    message?: string
    errors?: Record<string, string[]>
    email?: string
    password?: string
}

export default function SignupForm() {
    const [state, action, pending] = useActionState(signup, undefined)
    const [error, setError] = useState<string>('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [formData, setFormData] = useState<{ email: string; password: string } | null>(null)
    const router = useRouter()

    // Handle the server action result when state changes
    useEffect(() => {
        if (state && formData) {
            handleAuthResult(state, formData)
        }
    }, [state, formData])

    async function handleAuthResult(result: AuthResult, credentials: { email: string; password: string }) {
        setIsProcessing(true)

        try {
            if (result?.message) {
                setError(result.message)
                setIsProcessing(false)
                setFormData(null)
                return
            }

            if (result?.success) {
                // Backend registration successful, now sign in with Firebase
                await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
                
                // Redirect to dashboard/home page after successful auth
                router.push('/')
            }

        } catch (firebaseError: any) {
            console.error('Firebase auth error:', firebaseError)
            setError('Authentication failed. Please try again.')
        } finally {
            setIsProcessing(false)
            setFormData(null)
        }
    }

    async function handleSubmit(formData: FormData) {
        setError('')

        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const repPassword = formData.get('rep-password') as string

        // Client-side password validation
        if (password !== repPassword) {
            setError('Passwords do not match')
            return
        }

        // Store form data for use when state updates
        setFormData({ email, password })

        // Call the server action - result will be in state
        action(formData)
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                    Username
                </label>

                <div className="mt-2">
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        autoComplete="text"
                        placeholder="Username"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>
            {state?.errors?.username && <p className="text-red-600 text-sm">{state.errors.username}</p>}

            <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Email address
                </label>

                <div className="mt-2">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder='Email'
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>
            {state?.errors?.email && <p className="text-red-600 text-sm">{state.errors.email}</p>}

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                        Password
                    </label>
                </div>

                <div className="mt-2">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="rep-password" className="block text-sm/6 font-medium text-gray-900">
                        Repeat password
                    </label>
                </div>

                <div className="mt-2">
                    <input
                        id="rep-password"
                        name="rep-password"
                        type="password"
                        required
                        autoComplete="current-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>

            {state?.errors?.password && (
                <div className="text-red-600 text-sm">
                    <p>Password must:</p>
                    <ul>
                        {state.errors.password.map((error) => (
                            <li key={error}>- {error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {error && (
                <div className="text-red-600 text-sm">
                    {error}
                </div>
            )}

            {state?.message && (
                <div className="text-red-600 text-sm">
                    {state.message}
                </div>
            )}

            <div>
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    disabled={pending || isProcessing}
                >
                    {pending || isProcessing ? 'Loading...' : 'Sign up'}
                </button>
            </div>
        </form>
    )
}
