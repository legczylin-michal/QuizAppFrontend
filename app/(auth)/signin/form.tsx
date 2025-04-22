'use client';

import { useState } from 'react';
import { FormEvent } from "react";

import { ErrorAlert, SuccessAlert } from '../../alerts';

export default function SignInForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData(event.currentTarget);

            const plainData: Record<string, string> = {};
            formData.forEach((value, key) => {
                plainData[key] = value.toString();
            });

            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(plainData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data['error'])
            }

            setSuccess(plainData['username']);
        } catch (error) {
            setError(error.message)
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {success && <SuccessAlert msg={success}></SuccessAlert>}
            {error && <ErrorAlert msg={error}></ErrorAlert>}

            <form onSubmit={onSubmit} className="space-y-6">
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

                <div>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    >
                        Sign in
                    </button>
                </div>
            </form>
        </>
    )
}