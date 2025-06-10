'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getItems, createItem, deleteSet } from '@/app/lib/dal'
import ItemForm from '@/app/ui/item-form'
import { auth } from '@/app/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import type { Item } from '@/app/lib/definitions'
import Link from 'next/link'

export default function ItemsPage({ params }: { params: Promise<{ setId: string }> }) {
    const { setId } = use(params)
    const router = useRouter()

    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [authChecked, setAuthChecked] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Fetch all items on page load
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/signin')
            } else {
                setAuthChecked(true)
            }
        })
        return () => unsubscribe()
    }, [router])

    // Data fetching after auth confirmation
    useEffect(() => {
        if (!authChecked) return

        const fetchItems = async () => {
            try {
                const data = await getItems(setId)
                setItems(data)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load items')
            } finally {
                setLoading(false)
            }
        }
        fetchItems()
    }, [setId, authChecked])

    const handleDelete = async () => {
        setError(null)
        try {
            await deleteSet(setId)
            router.push(`/sets/`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete set')
        }
    }

    // Create item, then add to top of list
    const handleAddItem = async (term: string, definition: string) => {
        setError(null)
        try {
            const response = await createItem(setId, term, definition)
            setItems(prev => [response, ...prev])
            console.log('Item created:', response)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create item')
            throw err
        }
    }

    const filteredItems = items.filter(item =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <div>
                <Link href={`/sets/${setId}/edit`}>Edit</Link>
                
                <button
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={handleDelete}
                >
                    Delete Set
                </button>
            </div>

            <h1 className="text-2xl font-bold mb-6">Items Management</h1>

            <ItemForm onSubmit={handleAddItem} error={error} />

            <input
                className="mb-6 p-2 border rounded w-full"
                type="text"
                placeholder="Search by term..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />

            <div>
                <h2 className="text-lg font-semibold mb-4">
                    Current Items ({filteredItems.length})
                </h2>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <ul className="space-y-2">
                        {filteredItems.map((item) => (

                            <li
                                key={item.id}
                                className="p-3 border rounded bg-gray-50"
                            >
                                <Link href={`/sets/${setId}/${item.id}`}>
                                    <div className="font-medium cursor-pointer text-blue-700 hover:underline">{item.term}</div>
                                </Link>
                                <div className="text-gray-600">{item.definition}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                    Error: {error}
                </div>
            )}
        </div>
    )
}
