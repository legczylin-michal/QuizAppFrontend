'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
import { getSet, updateSet } from '@/app/lib/dal'
import ItemForm from '@/app/ui/item-form'
import { useRouter } from 'next/navigation'
import SetForm from '@/app/ui/set-form'

export default function EditSetPage({ params, }: { params: Promise<{ setId: string }> }) {
    const { setId } = use(params)
    const router = useRouter()

    const [set, setSet] = useState<{ title: string; description: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchSet = async () => {
            try {
                const data = await getSet(setId)
                setSet({ title: data.title, description: data.description })
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch item')
            } finally {
                setLoading(false)
            }
        }
        fetchSet()
    }, [setId])

    const handleUpdate = async (title: string, description: string) => {
        setError(null)
        try {
            await updateSet(setId, title, description)
            router.push(`/sets/${setId}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update item')
            throw err
        }
    }

    if (loading) return <div className="p-4">Loading...</div>
    if (!set) return <div className="p-4">Set not found</div>

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Set</h1>
            <SetForm
                onSubmit={handleUpdate}
                error={error}
                initialTitle={set.title}
                initialDescription={set.description}
            />
            {error && <div className="mt-4 text-red-600">{error}</div>}
        </div>
    )
}
