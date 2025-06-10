'use client'

import Link from 'next/link'
import { Set } from '@/app/lib/definitions'

interface SetsListProps {
    sets: Set[]
    onDelete: (setId: string) => void
}

export default function SetsList({ sets, onDelete }: SetsListProps) {
    return (
        <ul className="space-y-2">
            {sets.map((set) => (
                <li
                    key={set.id}
                    className="p-3 border rounded bg-gray-50 group hover:bg-gray-100 transition-colors"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <Link href={`/sets/${set.id}`} className="font-medium">{set.title}</Link>
                        </div>
                        <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onDelete(set.id)}
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