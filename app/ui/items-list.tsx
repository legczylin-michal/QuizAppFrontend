'use client'

import Link from 'next/link'
import { Item } from '@/app/lib/definitions'

interface ItemsListProps {
  items: Item[]
  onDelete: (itemId: string) => void
  setId: string
}

export default function ItemsList({ items, onDelete, setId }: ItemsListProps) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="p-3 border rounded bg-gray-50 group hover:bg-gray-100 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-medium">{item.term}</div>
              <div className="text-gray-600">{item.definition}</div>
            </div>
            <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                href={`/sets/${setId}/items/${item.id}`}
                className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(item.id)}
                className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
