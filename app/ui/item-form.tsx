'use client'

import { useState, useEffect } from 'react'

interface ItemFormProps {
    onSubmit: (term: string, definition: string) => Promise<void>
    error?: string | null
    initialTerm?: string
    initialDefinition?: string
}

export default function ItemForm({
    onSubmit,
    error,
    initialTerm = '',
    initialDefinition = '',
}: ItemFormProps) {
    const [term, setTerm] = useState(initialTerm)
    const [definition, setDefinition] = useState(initialDefinition)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Update form fields if initial values change (for edit)
    useEffect(() => {
        setTerm(initialTerm)
        setDefinition(initialDefinition)
    }, [initialTerm, initialDefinition])

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
        await onSubmit(term, definition)
        setTerm('')
        setDefinition('')
    } finally {
        setIsSubmitting(false)
    }
}


    return (
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
            <input
                type="text"
                placeholder="Term"
                className="w-full p-2 border rounded"
                value={term}
                onChange={e => setTerm(e.target.value)}
                required
                disabled={isSubmitting}
            />
            <textarea
                placeholder="Definition"
                className="w-full p-2 border rounded"
                value={definition}
                onChange={e => setDefinition(e.target.value)}
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
