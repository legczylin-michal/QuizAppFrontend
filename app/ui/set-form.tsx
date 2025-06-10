'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"

interface SetFormProps {
    onSubmit: (title: string, description: string) => Promise<void>
    error?: string | null
    initialTitle?: string
    initialDescription?: string
}

export default function SetForm({ onSubmit, error, initialTitle = '', initialDescription = '' }: SetFormProps) {
    const [title, setTitle] = useState(initialTitle)
    const [description, setDescription] = useState(initialDescription)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setTitle(initialTitle)
        setDescription(initialDescription)
    }, [initialTitle, initialDescription])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await onSubmit(title, description)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
            <input
                type="text"
                placeholder="Title"
                className="w-full p-2 border rounded"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
            />
            <textarea
                placeholder="Description"
                className="w-full p-2 border rounded"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                disabled={isSubmitting}
            />
            
            <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            {error && <div className="text-red-600">{error}</div>}
        </form>
    )
}