'use client'

import { auth } from './firebase'
import { User } from 'firebase/auth'
import { Item, Set } from '@/app/lib/definitions'

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
    return !!auth.currentUser
}

// Helper function to get current user
export function getCurrentUser(): User | null {
    return auth.currentUser
}

// Helper function to make authenticated API requests
export async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    const user = auth.currentUser
    if (!user) {
        throw new Error('Not authenticated')
    }

    const idToken = await user.getIdToken()

    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
        }
    })
}

// API functions for your Flask backend
export async function registerUser(email: string, password: string) {
    return fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
}

export async function loginUser(idToken: string) {
    return fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
    })
}

export async function getItems(setId: string) {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')
    const token = await user.getIdToken()
    const response = await fetch(`http://localhost:5000/sets/${setId}/items`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch items')
    return response.json()
}

export async function createItem(setId: string, term: string, definition: string): Promise<Item> {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const token = await user.getIdToken()
    const response = await fetch(`http://localhost:5000/sets/${setId}/items`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ term, definition })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create item')
    }

    // Get the created item's ID from response
    const { item_id } = await response.json()

    // Fetch the full item details
    const itemResponse = await fetch(`http://localhost:5000/sets/${setId}/items/${item_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!itemResponse.ok) throw new Error('Failed to fetch created item')

    return itemResponse.json()
}

export async function getItem(setId: string, itemId: string) {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')
    const token = await user.getIdToken()
    const response = await fetch(`http://localhost:5000/sets/${setId}/items/${itemId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('Failed to fetch item')
    return response.json()
}

export async function updateItem(setId: string, itemId: string, term: string, definition: string) {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')
    const token = await user.getIdToken()
    const response = await fetch(`http://localhost:5000/sets/${setId}/items/${itemId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ term, definition }),
    })
    if (!response.ok) throw new Error('Failed to update item')
    return response.json()
}

export async function deleteItem(setId: string, itemId: string) {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')
    const token = await user.getIdToken()
    const response = await fetch(`http://localhost:5000/sets/${setId}/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('Failed to delete item')
    return response.json()
}

export async function getSets() {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const token = await user.getIdToken()
    const response = await fetch(`http://localhost:5000/sets`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!response.ok) throw new Error('Failed to fetch sets')

    return response.json()
}

// Set management functions
export async function createSet(title: string, description: string): Promise<Set> {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const token = await user.getIdToken()
    const response = await fetch(`http://localhost:5000/sets`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create set')
    }

    const { set_id } = await response.json()

    return { id: set_id, title: title, description: description }
}

export async function getSet(setId: string) {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const token = await user.getIdToken()
    const response = await fetch(`http://localhost:5000/sets/${setId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    })

    if (!response.ok) throw new Error('Failed to fetch item')

    return response.json()
}

export async function updateSet(setId: string, title: string, description: string) {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const token = await user.getIdToken()
    const response = await fetch(`http://localhost:5000/sets/${setId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
    })

    if (!response.ok) throw new Error('Failed to update set')

    return response.json()
}

export async function deleteSet(setId: string) {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const token = await user.getIdToken()
    const response = await fetch(`http://localhost:5000/sets/${setId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    })

    if (!response.ok) throw new Error('Failed to delete set')

    return response.json()
}