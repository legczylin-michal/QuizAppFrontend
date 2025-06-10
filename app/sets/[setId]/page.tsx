'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getItems, createItem, deleteSet, getSet } from '@/app/lib/dal'
import ItemForm from '@/app/ui/item-form'
import { auth } from '@/app/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import type { Item, Set } from '@/app/lib/definitions'
import Link from 'next/link'

export default function ItemsPage({ params }: { params: Promise<{ setId: string }> }) {
    const { setId } = use(params)
    const router = useRouter()

    const [set, setSet] = useState<Set | null>(null)
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

    useEffect(() => {
        if (!authChecked) return

        const fetchSet = async () => {
            try {
                const data = await getSet(setId)
                setSet(data)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load set')
            } finally {
                setLoading(false)
            }
        }
        fetchSet()
    }, [setId, authChecked])

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{set?.title}</h1>
                    <h3>{set?.description}</h3>
                </div>

                <div className="inline-flex gap-2 mt-4 sm:mt-0" role="group">
                    <Link href={`/sets`} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
                        Back
                    </Link>

                    <Link href={`/sets/${setId}/edit`} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Edit
                    </Link>
                    <Link href={`/sets/${setId}/learn`} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Learn
                    </Link>

                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
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
