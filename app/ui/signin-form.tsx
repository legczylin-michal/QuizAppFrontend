'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/app/lib/firebase'

export default function SigninForm() {
    const [error, setError] = useState<string>('')
    const [isProcessing, setIsProcessing] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setError('')
        setIsProcessing(true)

        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
            // Sign in directly with Firebase - no backend validation needed
            await signInWithEmailAndPassword(auth, email, password)
            
            // Redirect to home page after successful auth
            router.push('/')

        } catch (firebaseError: any) {
            console.error('Firebase signin error:', firebaseError)
            
            // Handle common Firebase auth errors
            switch (firebaseError.code) {
                case 'auth/user-not-found':
                    setError('No account found with this email address.')
                    break
                case 'auth/wrong-password':
                    setError('Incorrect password.')
                    break
                case 'auth/invalid-email':
                    setError('Invalid email address.')
                    break
                case 'auth/user-disabled':
                    setError('This account has been disabled.')
                    break
                default:
                    setError('Failed to sign in. Please check your credentials.')
            }
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
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
                        placeholder="Email"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                        Password
                    </label>

                    <div className="text-sm">
                        <a href="#" className="font-semibold text-gray-600 hover:text-gray-500">
                            Forgot password?
                        </a>
                    </div>
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

            {error && (
                <div className="text-red-600 text-sm">
                    {error}
                </div>
            )}

            <div>
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-indigo-600"
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Signing in...' : 'Sign in'}
                </button>
            </div>
        </form>
    )
}
