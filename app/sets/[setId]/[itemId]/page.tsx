'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
import { getItem, updateItem, deleteItem } from '@/app/lib/dal'
import ItemForm from '@/app/ui/item-form'
import { useRouter } from 'next/navigation'

export default function EditItemPage({
    params,
}: {
    params: Promise<{ setId: string; itemId: string }>
}) {
    const { setId, itemId } = use(params)
    const router = useRouter()
    const [item, setItem] = useState<{ term: string; definition: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const data = await getItem(setId, itemId)
                setItem({ term: data.term, definition: data.definition })
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch item')
            } finally {
                setLoading(false)
            }
        }
        fetchItem()
    }, [setId, itemId])

    const handleUpdate = async (term: string, definition: string) => {
        setError(null)
        try {
            await updateItem(setId, itemId, term, definition)
            router.push(`/sets/${setId}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update item')
            throw err
        }
    }

    const handleDelete = async () => {
        setError(null)
        try {
            await deleteItem(setId, itemId)
            router.push(`/sets/${setId}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete item')
        }
    }

    if (loading) return <div className="p-4">Loading...</div>
    if (!item) return <div className="p-4">Item not found</div>

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Item</h1>
            <ItemForm
                onSubmit={handleUpdate}
                error={error}
                initialTerm={item.term}
                initialDefinition={item.definition}
            />
            <button
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
            >
                Delete Item
            </button>
            {error && <div className="mt-4 text-red-600">{error}</div>}
        </div>
    )
}
