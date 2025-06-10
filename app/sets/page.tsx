'use client'

import { useEffect, useState } from 'react'
import Link from "next/link"
import { createSet, getSets } from '../lib/dal'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/app/lib/firebase'
import { useRouter } from 'next/navigation'
import SetForm from '../ui/set-form'

export default function SetsPage() {
    const router = useRouter()

    const [sets, setSets] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [authChecked, setAuthChecked] = useState(false)
    const [searchTitle, setSearchTitle] = useState('')

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

        const fetchSets = async () => {
            try {
                const data = await getSets()
                setSets(data)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load sets')
            } finally {
                setLoading(false)
            }
        }

        fetchSets()
    }, [authChecked])

    // Create item, then add to top of list
    const handleAddSet = async (title: string, description: string) => {
        setError(null)
        try {
            const response = await createSet(title, description)
            setSets(prev => [response, ...prev])
            console.log('Set created:', response)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create set')
            throw err
        }
    }

    const filteredSets = sets.filter(set =>
        set.title.toLowerCase().includes(searchTitle.toLowerCase())
    )

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Sets Management</h1>

            <SetForm onSubmit={handleAddSet} error={error} />

            <input
                className="mb-6 p-2 border rounded w-full"
                type="text"
                placeholder="Search by title..."
                value={searchTitle}
                onChange={e => setSearchTitle(e.target.value)}
            />

            <div>
                <h2 className="text-lg font-semibold mb-4">
                    Current Items ({filteredSets.length})
                </h2>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <ul className="space-y-2">
                        {filteredSets.map((set) => (
                            <li
                                key={set.set_id}
                                className="p-3 border rounded bg-gray-50"
                            >
                                <Link href={`/sets/${set.set_id}`}>
                                    <div className="font-medium cursor-pointer text-blue-700 hover:underline">{set.title}</div>
                                </Link>
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