'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
import { getItems } from '@/app/lib/dal'
import { auth } from '@/app/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function LearnPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = use(params)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [showDefinition, setShowDefinition] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Wait for Firebase Auth to be ready
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Optionally redirect to signin
        window.location.href = '/signin'
      } else {
        setAuthChecked(true)
      }
    })
    return () => unsubscribe()
  }, [])

  // Fetch items only after auth is ready
  useEffect(() => {
    if (!authChecked) return
    const fetchItems = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getItems(setId)
        setItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load items')
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [setId, authChecked])

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>
  if (!items.length) return <div className="p-4">No items in this set.</div>

  const current = items[index]

  return (
    <div className="p-4 max-w-xl mx-auto flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Learn Mode</h1>
      <div className="mb-4 text-gray-500">Item {index + 1} of {items.length}</div>
      <div className="w-full mb-6 p-6 border rounded shadow text-center bg-white">
        <div className="text-xl font-semibold mb-4">{current.term}</div>
        {showDefinition ? (
          <div className="text-lg text-gray-700">{current.definition}</div>
        ) : (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setShowDefinition(true)}
          >
            Show Definition
          </button>
        )}
      </div>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => { setIndex(i => i - 1); setShowDefinition(false) }}
          disabled={index === 0}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => { setIndex(i => i + 1); setShowDefinition(false) }}
          disabled={index === items.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}
